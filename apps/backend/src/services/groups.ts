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

function includeMembers() {
  return {
    members: {
      include: { user: { select: { email: true } } },
    },
  } as const
}

export async function listGroups(): Promise<GroupWithMembers[]> {
  const groups = await prisma.group.findMany({
    orderBy: { name: 'asc' },
    ...includeMembers(),
  })
  return groups.map(toGroupWithMembers)
}

export async function getGroup(name: string): Promise<GroupWithMembers | null> {
  const group = await prisma.group.findUnique({
    where: { name },
    ...includeMembers(),
  })
  return group ? toGroupWithMembers(group) : null
}

export async function createGroup(data: { name: string; description: string }): Promise<GroupWithMembers> {
  const existing = await prisma.group.findUnique({ where: { name: data.name } })
  if (existing) throw new Error(`Le groupe "${data.name}" existe déjà`)
  const group = await prisma.group.create({ data, ...includeMembers() })
  return toGroupWithMembers(group)
}

export async function updateGroup(
  name: string,
  data: { description?: string; members?: string[] },
): Promise<GroupWithMembers> {
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
    await prisma.group.update({ where: { name }, data: { description: data.description } })
  }

  const updated = await prisma.group.findUnique({ where: { name }, ...includeMembers() })
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

  const updated = await prisma.group.findUnique({ where: { name: groupName }, ...includeMembers() })
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

  const updated = await prisma.group.findUnique({ where: { name: groupName }, ...includeMembers() })
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
