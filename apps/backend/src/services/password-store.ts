import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { logger } from '../utils/logger.js'

const PASSWORDS_PATH = resolve(process.cwd(), '../../infra/auth/passwords.json')

interface PasswordEntry {
  hash: string
  updatedAt: string
}

function loadPasswords(): Record<string, PasswordEntry> {
  if (!existsSync(PASSWORDS_PATH)) return {}
  try {
    return JSON.parse(readFileSync(PASSWORDS_PATH, 'utf-8'))
  } catch {
    logger.warn('Failed to read passwords.json')
    return {}
  }
}

function savePasswords(data: Record<string, PasswordEntry>): void {
  writeFileSync(PASSWORDS_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export function setPassword(email: string, password: string): void {
  const store = loadPasswords()
  store[email.toLowerCase()] = {
    hash: hashPassword(password),
    updatedAt: new Date().toISOString(),
  }
  savePasswords(store)
}

export function hasPassword(email: string): boolean {
  return email.toLowerCase() in loadPasswords()
}

export function verifyStoredPassword(email: string, password: string): boolean {
  const entry = loadPasswords()[email.toLowerCase()]
  if (!entry) return false
  return verifyPassword(password, entry.hash)
}
