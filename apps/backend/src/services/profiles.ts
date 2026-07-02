import { prisma } from './db.js'
import { config } from '../config/index.js'

export interface UserProfile {
  email: string
  name: string
  icon: string
}

export interface UserProfileWithGroups extends UserProfile {
  groups: string[]
  isAdmin: boolean
}

function computeIsAdmin(email: string, dbIsAdmin: boolean): boolean {
  return email.toLowerCase() === config.authAdminEmail.toLowerCase() || dbIsAdmin
}

export async function getProfile(email: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
  return { email: user.email, name: user.name, icon: user.icon }
}

export async function listProfiles(): Promise<UserProfileWithGroups[]> {
  const users = await prisma.user.findMany({
    orderBy: { email: 'asc' },
    include: { groups: { include: { group: { select: { name: true } } } } },
  })
  return users.map((u: { email: string; name: string; icon: string; isAdmin: boolean; groups: Array<{ group: { name: string } }> }) => ({
    email: u.email,
    name: u.name,
    icon: u.icon,
    groups: u.groups.map((g: { group: { name: string } }) => g.group.name),
    isAdmin: computeIsAdmin(u.email, u.isAdmin),
  }))
}

export async function upsertProfile(
  email: string,
  data: { name?: string; icon?: string; isAdmin?: boolean },
): Promise<UserProfile> {
  const user = await prisma.user.upsert({
    where: { email },
    update: { name: data.name, icon: data.icon, isAdmin: data.isAdmin },
    create: {
      email,
      name: data.name ?? email.split('@')[0],
      icon: data.icon ?? '',
      isAdmin: data.isAdmin ?? false,
    },
  })
  return { email: user.email, name: user.name, icon: user.icon }
}

export async function updateProfileEmail(oldEmail: string, newEmail: string): Promise<void> {
  await prisma.user.update({ where: { email: oldEmail }, data: { email: newEmail } })
}

export async function deleteProfile(email: string): Promise<void> {
  await prisma.user.delete({ where: { email } })
}

export async function getDbUser(email: string): Promise<{ isAdmin: boolean } | null> {
  const user = await prisma.user.findUnique({ where: { email }, select: { isAdmin: true } })
  return user
}
