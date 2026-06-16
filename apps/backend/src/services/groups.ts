import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { logger } from '../utils/logger.js'

const GROUPS_PATH = resolve(process.cwd(), '../../infra/auth/groups.json')

export interface Group {
  name: string
  description: string
  members: string[]
}

function loadGroups(): Group[] {
  if (!existsSync(GROUPS_PATH)) {
    logger.warn({ path: GROUPS_PATH }, 'Fichier groups.json introuvable')
    return []
  }
  try {
    return JSON.parse(readFileSync(GROUPS_PATH, 'utf-8')) as Group[]
  } catch (err) {
    logger.error({ err }, 'Erreur lecture groups.json')
    return []
  }
}

function saveGroups(groups: Group[]): void {
  writeFileSync(GROUPS_PATH, JSON.stringify(groups, null, 2), 'utf-8')
}

export function listGroups(): Group[] {
  return loadGroups()
}

export function getGroup(name: string): Group | undefined {
  return loadGroups().find((g) => g.name === name)
}

export function createGroup(data: Pick<Group, 'name' | 'description'>): Group {
  const groups = loadGroups()
  if (groups.some((g) => g.name === data.name)) {
    throw new Error(`Le groupe "${data.name}" existe déjà`)
  }
  const group: Group = { name: data.name, description: data.description ?? '', members: [] }
  groups.push(group)
  saveGroups(groups)
  return group
}

export function updateGroup(
  name: string,
  data: Partial<Pick<Group, 'description' | 'members'>>,
): Group {
  const groups = loadGroups()
  const idx = groups.findIndex((g) => g.name === name)
  if (idx === -1) throw new Error(`Groupe "${name}" introuvable`)
  if (data.description !== undefined) groups[idx].description = data.description
  if (data.members !== undefined) groups[idx].members = data.members
  saveGroups(groups)
  return groups[idx]
}

export function deleteGroup(name: string): void {
  const groups = loadGroups()
  const idx = groups.findIndex((g) => g.name === name)
  if (idx === -1) throw new Error(`Groupe "${name}" introuvable`)
  groups.splice(idx, 1)
  saveGroups(groups)
}

export function addMember(groupName: string, email: string): Group {
  const groups = loadGroups()
  const idx = groups.findIndex((g) => g.name === groupName)
  if (idx === -1) throw new Error(`Groupe "${groupName}" introuvable`)
  if (!groups[idx].members.includes(email)) {
    groups[idx].members.push(email)
  }
  saveGroups(groups)
  return groups[idx]
}

export function removeMember(groupName: string, email: string): Group {
  const groups = loadGroups()
  const idx = groups.findIndex((g) => g.name === groupName)
  if (idx === -1) throw new Error(`Groupe "${groupName}" introuvable`)
  groups[idx].members = groups[idx].members.filter((m) => m !== email)
  saveGroups(groups)
  return groups[idx]
}

export function getRolesForEmail(email: string): string[] {
  const groups = loadGroups()
  return groups.filter((g) => g.members.includes(email)).map((g) => g.name)
}
