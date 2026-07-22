import Docker from 'dockerode'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { REGISTRY_PATH } from './registry.js'
import type { AppManifest } from '../types/index.js'

export interface DiscoveredContainer {
  id: string
  name: string
  image: string
  status: string
  ports: Array<{
    containerPort: number
    hostPort: number | null
    protocol: string
  }>
  created: string
  labels: Record<string, string>
  env: string[]
  mounts: Array<{
    source: string
    destination: string
    mode: string
  }>
  network: string
  command: string
}

export interface ImportInput {
  host?: string
  containerId: string
  manifest: {
    id: string
    name: string
    description: string
    icon: string
    roles?: string[]
  }
}

function createClient(host?: string): Docker {
  if (!host || host === 'unix:///var/run/docker.sock') {
    return new Docker()
  }
  if (host.startsWith('unix://')) {
    return new Docker({ socketPath: host.slice(7) })
  }
  const url =
    host.startsWith('tcp://') || host.startsWith('http://') || host.startsWith('https://')
      ? new URL(host)
      : new URL(`tcp://${host}`)

  const proto = url.protocol.replace(':', '')
  return new Docker({
    host: url.hostname,
    port: url.port || (proto === 'https' ? '2376' : '2375'),
    protocol: proto === 'https' ? 'https' : 'http',
  })
}

export async function scan(host?: string): Promise<DiscoveredContainer[]> {
  const docker = createClient(host)
  const containers = await docker.listContainers({ all: true })

  return containers.map((c) => {
    const name = c.Names[0]?.replace(/^\//, '') ?? c.Id.slice(0, 12)
    return {
      id: c.Id,
      name,
      image: c.Image,
      status: c.State,
      ports: (c.Ports ?? []).map((p) => ({
        containerPort: p.PrivatePort,
        hostPort: p.PublicPort ?? null,
        protocol: p.Type ?? 'tcp',
      })),
      created: new Date(c.Created * 1000).toISOString(),
      labels: c.Labels ?? {},
      env: [],
      mounts: (c.Mounts ?? []).map((m) => ({
        source: m.Source,
        destination: m.Destination,
        mode: m.Mode ?? 'rw',
      })),
      network: Object.keys(c.NetworkSettings?.Networks ?? {})[0] ?? '',
      command: c.Command ?? '',
    }
  })
}

export async function inspect(
  host: string | undefined,
  containerId: string,
): Promise<DiscoveredContainer> {
  const docker = createClient(host)
  const container = docker.getContainer(containerId)
  const info = await container.inspect()

  const ports = Object.entries(info.NetworkSettings?.Ports ?? {}).map(([key, val]) => {
    const sep = key.lastIndexOf('/')
    const containerPort = parseInt(key.slice(0, sep), 10)
    const protocol = key.slice(sep + 1)
    const hostPort = val && val.length > 0 ? val[0].HostPort : null
    return {
      containerPort,
      hostPort: hostPort ? parseInt(hostPort, 10) : null,
      protocol,
    }
  })

  return {
    id: info.Id,
    name: info.Name.replace(/^\//, ''),
    image: info.Config?.Image ?? '',
    status: info.State?.Status ?? 'unknown',
    ports,
    created: info.Created ?? '',
    labels: info.Config?.Labels ?? {},
    env: info.Config?.Env ?? [],
    mounts: (info.Mounts ?? []).map((m) => ({
      source: m.Source,
      destination: m.Destination,
      mode: m.Mode ?? 'rw',
    })),
    network: Object.keys(info.NetworkSettings?.Networks ?? {})[0] ?? '',
    command: (info.Config?.Cmd ?? []).join(' '),
  }
}

function buildCompose(info: DiscoveredContainer, serviceName: string): string {
  const lines: string[] = ['services:']
  lines.push(`  ${serviceName}:`)
  lines.push(`    image: ${info.image}`)
  lines.push('    restart: unless-stopped')

  if (info.ports.length > 0) {
    lines.push('    ports:')
    for (const p of info.ports) {
      if (p.hostPort) {
        lines.push(`      - "${p.hostPort}:${p.containerPort}/${p.protocol}"`)
      } else {
        lines.push(`      - "${p.containerPort}/${p.protocol}"`)
      }
    }
  }

  const filteredEnv = info.env.filter((e) => {
    const key = e.split('=')[0].toUpperCase()
    return ![
      'PATH',
      'HOME',
      'HOSTNAME',
      'NODE_VERSION',
      'YARN_VERSION',
      'PNPM_VERSION',
      'DEBIAN_FRONTEND',
    ].includes(key)
  })

  if (filteredEnv.length > 0) {
    lines.push('    environment:')
    for (const e of filteredEnv) {
      lines.push(`      - ${e}`)
    }
  }

  if (info.mounts.length > 0) {
    lines.push('    volumes:')
    for (const m of info.mounts) {
      const suffix = m.mode !== 'rw' ? `:${m.mode}` : ''
      lines.push(`      - ${m.source}:${m.destination}${suffix}`)
    }
  }

  if (info.network && info.network !== 'bridge') {
    lines.push(`    networks:`)
    lines.push(`      - ${info.network}`)
    lines.push('')
    lines.push('networks:')
    lines.push(`  ${info.network}:`)
    lines.push('    external: true')
  }

  return lines.join('\n') + '\n'
}

export async function importContainer(input: ImportInput): Promise<AppManifest> {
  const info = await inspect(input.host, input.containerId)

  const appDir = join(REGISTRY_PATH, input.manifest.id)
  if (!existsSync(appDir)) {
    mkdirSync(appDir, { recursive: true })
  }

  const internalPort =
    info.ports.find((p) => p.hostPort)?.hostPort ?? info.ports[0]?.containerPort ?? 80
  const composeFile = 'docker-compose.yml'
  const serviceName = 'app'

  const compose = buildCompose(info, serviceName)
  writeFileSync(join(appDir, composeFile), compose, 'utf-8')

  const access: AppManifest['access'] = {
    type: 'docker',
    composeFile,
    serviceName,
    internalPort,
    healthUrl: info.labels['isb.healthUrl'] || undefined,
  }

  if (input.host && !input.host.startsWith('unix://')) {
    access.host = input.host
  }

  const appManifest: AppManifest = {
    id: input.manifest.id,
    name: input.manifest.name,
    description: input.manifest.description,
    icon: input.manifest.icon,
    access,
    roles: input.manifest.roles ?? [],
  }

  writeFileSync(join(appDir, 'metadata.json'), JSON.stringify(appManifest, null, 2), 'utf-8')

  return appManifest
}
