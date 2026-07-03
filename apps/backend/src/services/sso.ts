import { randomUUID } from 'node:crypto'
import { prisma } from './db.js'

const TOKEN_TTL_SECONDS = 30

export interface SsoUserInfo {
  email: string
  name: string
  roles: string[]
  isAdmin: boolean
}

export async function generateSsoToken(userId: string): Promise<string> {
  const token = randomUUID()
  const expiresAt = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000)

  await prisma.ssoToken.create({
    data: { token, userId, expiresAt },
  })

  // Nettoyage opportuniste des tokens expirés
  await prisma.ssoToken.deleteMany({
    where: { OR: [{ expiresAt: { lt: new Date() } }, { used: true }] },
  })

  return token
}

export async function consumeSsoToken(token: string): Promise<SsoUserInfo | null> {
  const record = await prisma.ssoToken.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          groups: { include: { group: true } },
        },
      },
    },
  })

  if (!record) return null
  if (record.used) return null
  if (record.expiresAt < new Date()) {
    await prisma.ssoToken.delete({ where: { token } })
    return null
  }

  // Marquer comme utilisé — usage unique
  await prisma.ssoToken.update({ where: { token }, data: { used: true } })

  const roles = record.user.groups.map((ug: { group: { name: string } }) => ug.group.name)

  return {
    email: record.user.email,
    name: record.user.name,
    roles,
    isAdmin: record.user.isAdmin,
  }
}
