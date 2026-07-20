import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { join } from 'node:path'
import { logger } from '../utils/logger.js'
import { getAppManifest, REGISTRY_PATH } from './registry.js'
import { AppError } from '../utils/errors.js'

const exec = promisify(execFile)

export interface DockerStatus {
  status: 'running' | 'stopped' | 'error'
  url: string | null
  message?: string
}

const startingApps = new Map<string, Promise<DockerStatus>>()
const healthCheckTimeout = 30_000
const healthCheckInterval = 1_000

function resolveHealthUrl(baseUrl: string, internalPort: number): string {
  if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) return baseUrl
  if (baseUrl.startsWith('/')) return `http://localhost:${internalPort}${baseUrl}`
  return `http://localhost:${internalPort}/${baseUrl}`
}

async function checkHealth(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5_000) })
    return response.ok
  } catch {
    return false
  }
}

async function waitForHealth(url: string): Promise<void> {
  const deadline = Date.now() + healthCheckTimeout
  while (Date.now() < deadline) {
    if (await checkHealth(url)) return
    await new Promise((r) => setTimeout(r, healthCheckInterval))
  }
  throw new AppError(504, `Health check timeout (${healthCheckTimeout}ms)`)
}

export async function startContainer(appId: string): Promise<DockerStatus> {
  const existing = startingApps.get(appId)
  if (existing) {
    logger.info({ appId }, 'Démarrage déjà en cours')
    return existing
  }

  const manifest = getAppManifest(appId)
  if (!manifest || manifest.access.type !== 'docker') {
    return { status: 'error', url: null, message: 'Application introuvable ou type incorrect' }
  }

  const { composeFile, serviceName, internalPort, healthUrl } = manifest.access
  const dir = join(REGISTRY_PATH, appId)

  const promise = (async (): Promise<DockerStatus> => {
    try {
      logger.info({ appId, dir }, 'Démarrage du conteneur')

      await exec('docker', ['compose', '-f', composeFile, 'up', '-d', serviceName], { cwd: dir })

      if (healthUrl) {
        const fullUrl = resolveHealthUrl(healthUrl, internalPort)
        logger.info({ appId, url: fullUrl }, 'Attente du health check')
        await waitForHealth(fullUrl)
      }

      logger.info({ appId }, 'Conteneur démarré avec succès')
      return {
        status: 'running',
        url: `http://localhost:${internalPort}`,
        message: 'Conteneur démarré',
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      logger.error({ err, appId }, 'Échec du démarrage du conteneur')
      return { status: 'error', url: null, message }
    } finally {
      startingApps.delete(appId)
    }
  })()

  startingApps.set(appId, promise)
  return promise
}

export async function stopContainer(appId: string): Promise<DockerStatus> {
  const manifest = getAppManifest(appId)
  if (!manifest || manifest.access.type !== 'docker') {
    return { status: 'error', url: null, message: 'Application introuvable ou type incorrect' }
  }

  const { composeFile, serviceName } = manifest.access
  const dir = join(REGISTRY_PATH, appId)

  try {
    logger.info({ appId, dir }, 'Arrêt du conteneur')
    await exec('docker', ['compose', '-f', composeFile, 'stop', serviceName], { cwd: dir })
    logger.info({ appId }, 'Conteneur arrêté')
    return { status: 'stopped', url: null, message: 'Conteneur arrêté' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    logger.error({ err, appId }, "Échec de l'arrêt du conteneur")
    return { status: 'error', url: null, message }
  }
}

export async function getContainerStatus(appId: string): Promise<DockerStatus> {
  if (startingApps.has(appId)) {
    return { status: 'running', url: null, message: 'Démarrage en cours' }
  }

  const manifest = getAppManifest(appId)
  if (!manifest || manifest.access.type !== 'docker') {
    return { status: 'error', url: null, message: 'Application introuvable' }
  }

  const { composeFile, serviceName, internalPort } = manifest.access
  const dir = join(REGISTRY_PATH, appId)

  try {
    const { stdout } = await exec(
      'docker',
      ['compose', '-f', composeFile, 'ps', '--format', '{{.State}}', serviceName],
      { cwd: dir },
    )

    const state = stdout.trim()
    if (state === 'running') {
      return {
        status: 'running',
        url: `http://localhost:${internalPort}`,
        message: "Conteneur en cours d'exécution",
      }
    }
    return { status: 'stopped', url: null, message: `Conteneur arrêté (${state})` }
  } catch {
    return { status: 'stopped', url: null, message: 'Conteneur arrêté' }
  }
}
