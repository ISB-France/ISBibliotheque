import { config } from '../config/index.js'
import { createToken } from '../utils/jwt.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { getRolesForEmail } from './groups.js'

const ADMIN_HASH = hashPassword(config.authAdminPassword)

export interface AuthResult {
  token: string
  email: string
  name: string
  roles: string[]
  isAdmin: boolean
}

export function login(email: string, password: string): AuthResult | null {
  const isAdmin = email.toLowerCase() === config.authAdminEmail.toLowerCase()
  if (isAdmin) {
    if (!verifyPassword(password, ADMIN_HASH)) return null
    const roles = ['admin']
    const token = createToken({
      sub: email,
      email,
      name: config.authAdminName,
      roles,
      isAdmin: true,
    })
    return { token, email, name: config.authAdminName, roles, isAdmin: true }
  }

  const roles = getRolesForEmail(email)
  if (roles.length === 0) return null

  const token = createToken({
    sub: email,
    email,
    name: email.split('@')[0],
    roles,
    isAdmin: false,
  })
  return { token, email, name: email.split('@')[0], roles, isAdmin: false }
}

export function loginByEmail(email: string): AuthResult | null {
  const isAdmin = email.toLowerCase() === config.authAdminEmail.toLowerCase()
  if (isAdmin) return null

  const roles = getRolesForEmail(email)
  if (roles.length === 0) return null

  const token = createToken({
    sub: email,
    email,
    name: email.split('@')[0],
    roles,
    isAdmin: false,
  })
  return { token, email, name: email.split('@')[0], roles, isAdmin: false }
}
