import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { join } from 'node:path'
import { logger } from '../utils/logger.js'
import { getAppManifest, REGISTRY_PATH } from './registry.js'

const exec = promisify(execFile)

export interface DockerStatus {
  status: 'running' | 'stopped' | 'error'
  url: string | null
  message?: string
}

export interface RequestOrigin {
  hostname: string
  protocol: string
}

const startingApps = new Map<string, Promise<DockerStatus>>()

function buildAppUrl(
  internalPort: number,
  origin: RequestOrigin,
  accessHost?: string,
): string {
  if (accessHost) return `${origin.protocol}://${accessHost}:${internalPort}`
  return `${origin.protocol}://${origin.hostname}:${internalPort}`
}

async function isPortPublishedAndRunning(hostPort: number): Promise<boolean> {
  try {
    const { stdout } = await exec('docker', [
      'ps',
      '--filter',
      `publish=${hostPort}`,
      '--format',
      '{{.State}}',
    ])
    return stdout
      .trim()
      .split('\n')
      .some((state) => state.trim() === 'running')
  } catch {
    return false
  }
}

async function resolveServiceImage(
  dir: string,
  composeFile: string,
  serviceName: string,
): Promise<string | null> {
  try {
    const { stdout } = await exec(
      'docker',
      ['compose', '-f', composeFile, 'config', '--images', serviceName],
      { cwd: dir },
    )
    const image = stdout.trim().split('\n')[0]?.trim()
    return image || null
  } catch {
    return null
  }
}

async function imageExistsLocally(image: string): Promise<boolean> {
  try {
    await exec('docker', ['image', 'inspect', image])
    return true
  } catch {
    return false
  }
}

export async function startContainer(appId: string, origin: RequestOrigin): Promise<DockerStatus> {
  const existing = startingApps.get(appId)
  if (existing) {
    logger.info({ appId }, 'Démarrage déjà en cours')
    return existing
  }

  const manifest = getAppManifest(appId)
  if (!manifest || manifest.access.type !== 'docker') {
    return { status: 'error', url: null, message: 'Application introuvable ou type incorrect' }
  }

  const { composeFile, serviceName, internalPort, host: accessHost } = manifest.access
  const dir = join(REGISTRY_PATH, appId)
  const appUrl = buildAppUrl(internalPort, origin, accessHost)

  const promise = (async (): Promise<DockerStatus> => {
    try {
      if (await isPortPublishedAndRunning(internalPort)) {
        logger.info({ appId }, 'Port déjà occupé par un conteneur fonctionnel, aucune action nécessaire')
        return {
          status: 'running',
          url: appUrl,
          message: 'Conteneur déjà en cours',
        }
      }

      const image = await resolveServiceImage(dir, composeFile, serviceName)
      if (image && !(await imageExistsLocally(image))) {
        logger.error({ appId, image }, 'Image Docker introuvable localement')
        return {
          status: 'error',
          url: null,
          message: `Image Docker "${image}" introuvable localement. Importez-la ou construisez-la avant de démarrer cette application.`,
        }
      }

      logger.info({ appId, dir }, 'Démarrage du conteneur')

      await exec('docker', ['compose', '-f', composeFile, 'up', '-d', serviceName], { cwd: dir })

      logger.info({ appId }, 'Conteneur démarré avec succès')
      return {
        status: 'running',
        url: appUrl,
        message: 'Conteneur démarré',
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'

      if (message.includes('port is already allocated')) {
        if (await isPortPublishedAndRunning(internalPort)) {
          logger.info({ appId }, 'Port déjà occupé par un conteneur fonctionnel, considéré comme démarré')
          return {
            status: 'running',
            url: appUrl,
            message: 'Conteneur déjà en cours (démarré hors Compose)',
          }
        }
      }

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

export async function getContainerStatus(appId: string, origin: RequestOrigin): Promise<DockerStatus> {
  if (startingApps.has(appId)) {
    return { status: 'running', url: null, message: 'Démarrage en cours' }
  }

  const manifest = getAppManifest(appId)
  if (!manifest || manifest.access.type !== 'docker') {
    return { status: 'error', url: null, message: 'Application introuvable' }
  }

  const { composeFile, serviceName, internalPort, host: accessHost } = manifest.access
  const dir = join(REGISTRY_PATH, appId)
  const appUrl = buildAppUrl(internalPort, origin, accessHost)

  if (await isPortPublishedAndRunning(internalPort)) {
    return {
      status: 'running',
      url: appUrl,
      message: "Conteneur en cours d'exécution",
    }
  }

  try {
    const { stdout } = await exec(
      'docker',
      ['compose', '-f', composeFile, 'ps', '--format', '{{.State}}', serviceName],
      { cwd: dir },
    )
    return { status: 'stopped', url: null, message: `Conteneur arrêté (${stdout.trim()})` }
  } catch {
    return { status: 'stopped', url: null, message: 'Conteneur arrêté' }
  }
}
