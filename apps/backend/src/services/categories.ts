import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { logger } from '../utils/logger.js'

const CATEGORIES_PATH = resolve(process.cwd(), '../../infra/categories.json')

function ensureFile() {
  const dir = resolve(process.cwd(), '../../infra')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  if (!existsSync(CATEGORIES_PATH)) {
    writeFileSync(CATEGORIES_PATH, JSON.stringify([], null, 2), 'utf-8')
  }
}

export function listCategories(): string[] {
  try {
    ensureFile()
    const raw = readFileSync(CATEGORIES_PATH, 'utf-8')
    return JSON.parse(raw) as string[]
  } catch (err) {
    logger.warn({ err }, 'Erreur lecture categories.json')
    return []
  }
}

export function addCategory(name: string): string[] {
  const categories = listCategories()
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Le nom de la catégorie est requis')
  if (categories.includes(trimmed)) throw new Error('Cette catégorie existe déjà')
  const updated = [...categories, trimmed].sort()
  writeFileSync(CATEGORIES_PATH, JSON.stringify(updated, null, 2), 'utf-8')
  return updated
}

export function deleteCategory(name: string): string[] {
  const categories = listCategories()
  const updated = categories.filter((c) => c !== name)
  writeFileSync(CATEGORIES_PATH, JSON.stringify(updated, null, 2), 'utf-8')
  return updated
}
