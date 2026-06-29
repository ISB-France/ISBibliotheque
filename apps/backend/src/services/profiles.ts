import { prisma } from './db.js'
import type { User } from '../generated/prisma/index.js'

export interface UserProfile {
  email: string
  name: string
  icon: string
}

export async function getProfile(email: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
  return { email: user.email, name: user.name, icon: user.icon }
}

export async function listProfiles(): Promise<UserProfile[]> {
  const users = await prisma.user.findMany({ orderBy: { email: 'asc' } })
  return users.map((u: { email: string; name: string; icon: string }) => ({
    email: u.email,
    name: u.name,
    icon: u.icon,
  }))
}

export async function upsertProfile(
  email: string,
  data: { name?: string; icon?: string },
): Promise<UserProfile> {
  const user = await prisma.user.upsert({
    where: { email },
    update: { name: data.name, icon: data.icon },
    create: { email, name: data.name ?? email.split('@')[0], icon: data.icon ?? '' },
  })
  return { email: user.email, name: user.name, icon: user.icon }
}

export async function updateProfileEmail(oldEmail: string, newEmail: string): Promise<void> {
  await prisma.user.update({ where: { email: oldEmail }, data: { email: newEmail } })
}
