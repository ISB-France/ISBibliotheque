import { prisma } from './db.js'

export async function listGroups() {
  return prisma.group.findMany({ orderBy: { name: 'asc' } })
}

export async function getGroup(name: string) {
  return prisma.group.findUnique({ where: { name } })
}

export async function createGroup(data: { name: string; description: string }) {
  const existing = await prisma.group.findUnique({ where: { name: data.name } })
  if (existing) throw new Error(`Le groupe "${data.name}" existe déjà`)
  return prisma.group.create({ data })
}

export async function updateGroup(
  name: string,
  data: { description?: string; members?: string[] },
) {
  if (data.members !== undefined) {
    const group = await prisma.group.findUnique({ where: { name } })
    if (!group) throw new Error(`Groupe "${name}" introuvable`)

    await prisma.userGroup.deleteMany({ where: { groupId: group.id } })

    for (const email of data.members) {
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, name: email.split('@')[0] },
      })
      await prisma.userGroup.create({ data: { userId: user.id, groupId: group.id } })
    }
  }

  if (data.description !== undefined) {
    return prisma.group.update({ where: { name }, data: { description: data.description } })
  }

  return prisma.group.findUnique({ where: { name } })
}

export async function deleteGroup(name: string): Promise<void> {
  await prisma.group.delete({ where: { name } })
}

export async function addMember(groupName: string, email: string) {
  const group = await prisma.group.findUnique({ where: { name: groupName } })
  if (!group) throw new Error(`Groupe "${groupName}" introuvable`)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: email.split('@')[0] },
  })

  const existing = await prisma.userGroup.findUnique({
    where: { userId_groupId: { userId: user.id, groupId: group.id } },
  })
  if (!existing) {
    await prisma.userGroup.create({ data: { userId: user.id, groupId: group.id } })
  }

  return prisma.group.findUnique({ where: { name: groupName } })
}

export async function removeMember(groupName: string, email: string) {
  const group = await prisma.group.findUnique({ where: { name: groupName } })
  if (!group) throw new Error(`Groupe "${groupName}" introuvable`)

  const user = await prisma.user.findUnique({ where: { email } })
  if (user) {
    await prisma.userGroup.deleteMany({
      where: { userId: user.id, groupId: group.id },
    })
  }

  return prisma.group.findUnique({ where: { name: groupName } })
}

export async function getRolesForEmail(email: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { groups: { include: { group: true } } },
  })
  if (!user) return []
  return user.groups.map((ug: { group: { name: string } }) => ug.group.name)
}

export async function renameMemberInAllGroups(oldEmail: string, newEmail: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email: oldEmail } })
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { email: newEmail },
    })
  }
}
