import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { AppManifest, AppResponse } from '../types/index.js'
import { logger } from '../utils/logger.js'

export const REGISTRY_PATH = resolve(process.cwd(), '../../infra/apps.registry/')

function parseManifest(dir: string): AppManifest | null {
  const filePath = join(dir, 'metadata.json')
  if (!existsSync(filePath)) return null
  try {
    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw) as AppManifest
    if (!data.id || !data.name || !data.access?.type) {
      logger.warn({ dir }, 'Manifest invalide ignoré')
      return null
    }
    return data
  } catch (err) {
    logger.warn({ err, dir }, 'Erreur de lecture du manifest')
    return null
  }
}

function manifestToResponse(m: AppManifest): AppResponse {
  const base = {
    id: m.id,
    name: m.name,
    description: m.description,
    icon: m.icon,
    roles: m.roles ?? [],
    sso: m.sso ?? false,
  }
  if (m.access.type === 'redirect') {
    return { ...base, accessType: 'redirect' as const, url: m.access.url, status: null }
  }
  return { ...base, accessType: 'docker' as const, url: null, status: 'stopped' }
}

export function listApps(): AppResponse[] {
  if (!existsSync(REGISTRY_PATH)) {
    logger.warn({ path: REGISTRY_PATH }, 'Dossier registry introuvable')
    return []
  }
  const entries = readdirSync(REGISTRY_PATH, { withFileTypes: true })
  const apps: AppResponse[] = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const manifest = parseManifest(join(REGISTRY_PATH, entry.name))
    if (manifest) apps.push(manifestToResponse(manifest))
  }
  return apps
}

export function getAppManifest(id: string): AppManifest | null {
  const dir = join(REGISTRY_PATH, id)
  if (!existsSync(dir)) return null
  return parseManifest(dir)
}

export function getApp(id: string): AppResponse | undefined {
  const dir = join(REGISTRY_PATH, id)
  if (!existsSync(dir)) return undefined
  const manifest = parseManifest(dir)
  return manifest ? manifestToResponse(manifest) : undefined
}

export function getManifestRoles(id: string): string[] {
  const dir = join(REGISTRY_PATH, id)
  if (!existsSync(dir)) return []
  const manifest = parseManifest(dir)
  return manifest?.roles ?? []
}

function getAppDir(id: string): string {
  return join(REGISTRY_PATH, id)
}

function getMetadataPath(id: string): string {
  return join(getAppDir(id), 'metadata.json')
}

export function writeManifest(data: AppManifest): AppManifest {
  const dir = getAppDir(data.id)
  const filePath = getMetadataPath(data.id)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  const manifest: AppManifest = {
    ...data,
    access: { ...data.access },
  }
  writeFileSync(filePath, JSON.stringify(manifest, null, 2), 'utf-8')
  return manifest
}

export function updateManifest(id: string, data: Partial<AppManifest>): AppManifest | null {
  const dir = getAppDir(id)
  if (!existsSync(dir)) return null
  const existing = parseManifest(dir)
  if (!existing) return null
  const merged: AppManifest = {
    ...existing,
    ...data,
    access: data.access ? { ...existing.access, ...data.access } : existing.access,
    id,
  }
  writeFileSync(getMetadataPath(id), JSON.stringify(merged, null, 2), 'utf-8')
  return merged
}

export function deleteManifest(id: string): boolean {
  const dir = getAppDir(id)
  if (!existsSync(dir)) return false
  rmSync(dir, { recursive: true, force: true })
  return true
}

export function parseRawManifest(raw: string): AppManifest | null {
  try {
    const data = JSON.parse(raw) as AppManifest
    if (!data.id || !data.name || !data.access?.type) return null
    return data
  } catch {
    return null
  }
}
