import { prisma } from './db.js'

type GroupWithMembers = {
  id: string
  name: string
  description: string
  members: string[]
}

function toGroupWithMembers(group: {
  id: string
  name: string
  description: string
  members: Array<{ user: { email: string } }>
}): GroupWithMembers {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    members: group.members.map((m) => m.user.email),
  }
}

const membersInclude = {
  members: {
    include: { user: { select: { email: true } } },
  },
} as const

export async function listGroups(): Promise<GroupWithMembers[]> {
  const groups = await prisma.group.findMany({
    orderBy: { name: 'asc' },
    include: membersInclude,
  })
  return groups.map(toGroupWithMembers)
}

export async function getGroup(name: string): Promise<GroupWithMembers | null> {
  const group = await prisma.group.findUnique({
    where: { name },
    include: membersInclude,
  })
  return group ? toGroupWithMembers(group) : null
}

export async function createGroup(data: { name: string; description: string }): Promise<GroupWithMembers> {
  const existing = await prisma.group.findUnique({ where: { name: data.name } })
  if (existing) throw new Error(`Le groupe "${data.name}" existe déjà`)
  const group = await prisma.group.create({ data, include: membersInclude })
  return toGroupWithMembers(group)
}

export async function updateGroup(
  name: string,
  data: { name?: string; description?: string; members?: string[] },
): Promise<GroupWithMembers> {
  const group = await prisma.group.findUnique({ where: { name } })
  if (!group) throw new Error(`Groupe "${name}" introuvable`)

  const targetName = data.name ?? name

  if (data.members !== undefined) {
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

  const updateData: Record<string, string> = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.description !== undefined) updateData.description = data.description
  if (Object.keys(updateData).length > 0) {
    await prisma.group.update({ where: { id: group.id }, data: updateData })
  }

  const updated = await prisma.group.findUnique({ where: { id: group.id }, include: membersInclude })
  return toGroupWithMembers(updated!)
}

export async function deleteGroup(name: string): Promise<void> {
  await prisma.group.delete({ where: { name } })
}

export async function addMember(groupName: string, email: string): Promise<GroupWithMembers> {
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

  const updated = await prisma.group.findUnique({ where: { name: groupName }, include: membersInclude })
  return toGroupWithMembers(updated!)
}

export async function removeMember(groupName: string, email: string): Promise<GroupWithMembers> {
  const group = await prisma.group.findUnique({ where: { name: groupName } })
  if (!group) throw new Error(`Groupe "${groupName}" introuvable`)

  const user = await prisma.user.findUnique({ where: { email } })
  if (user) {
    await prisma.userGroup.deleteMany({
      where: { userId: user.id, groupId: group.id },
    })
  }

  const updated = await prisma.group.findUnique({ where: { name: groupName }, include: membersInclude })
  return toGroupWithMembers(updated!)
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
