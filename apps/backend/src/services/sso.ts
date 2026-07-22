import { randomUUID } from 'node:crypto'
import { prisma } from './db.js'
import type { AuthUser } from '../middleware/auth.js'

const TOKEN_TTL_SECONDS = 30

export interface SsoUserInfo {
  email: string
  name: string
  roles: string[]
  isAdmin: boolean
}

export async function generateSsoToken(user: AuthUser): Promise<string> {
  const token = randomUUID()
  const expiresAt = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000)

  await prisma.ssoToken.create({
    data: {
      token,
      email: user.email,
      name: user.name,
      roles: user.roles,
      isAdmin: user.isAdmin,
      expiresAt,
    },
  })

  // Nettoyage opportuniste des tokens expirés
  await prisma.ssoToken.deleteMany({
    where: { OR: [{ expiresAt: { lt: new Date() } }, { used: true }] },
  })

  return token
}

export async function consumeSsoToken(token: string): Promise<SsoUserInfo | null> {
  const record = await prisma.ssoToken.findUnique({ where: { token } })

  if (!record) return null
  if (record.used) return null
  if (record.expiresAt < new Date()) {
    await prisma.ssoToken.delete({ where: { token } })
    return null
  }

  // Marquer comme utilisé — usage unique
  await prisma.ssoToken.update({ where: { token }, data: { used: true } })

  return {
    email: record.email,
    name: record.name,
    roles: record.roles,
    isAdmin: record.isAdmin,
  }
}
