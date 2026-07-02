import { createRequire } from 'node:module'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { hashPassword } from '../src/utils/password.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const require = createRequire(import.meta.url)
const { PrismaClient } = require(resolve(__dirname, '../src/generated/prisma/index.js'))

const prisma = new PrismaClient()

const DEFAULT_GROUPS = [
  {
    name: 'admin',
    description: 'Administrateurs SI — accès à toutes les applications et à la gestion du portail',
  },
]

// Try loading existing groups from JSON for migration
function loadExistingGroupsMembers(): Map<string, string[]> {
  const groupsPath = resolve(process.cwd(), '../../infra/auth/groups.json')
  if (!existsSync(groupsPath)) return new Map()
  try {
    const data = JSON.parse(readFileSync(groupsPath, 'utf-8')) as Array<{
      name: string
      members: string[]
    }>
    const map = new Map<string, string[]>()
    for (const g of data) map.set(g.name, g.members)
    return map
  } catch {
    return new Map()
  }
}

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminEmail = process.env.AUTH_ADMIN_EMAIL ?? 'admin@isb-group.fr'
  const adminPassword = process.env.AUTH_ADMIN_PASSWORD ?? 'admin'
  const adminName = process.env.AUTH_ADMIN_NAME ?? 'Admin SI'

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        passwordHash: hashPassword(adminPassword),
        isAdmin: true,
      },
    })
    console.log(`  ✓ Admin user created: ${adminEmail}`)
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { isAdmin: true },
    })
    console.log(`  ○ Admin user exists: ${adminEmail}`)
  }

  // Create default groups
  const existingMembers = loadExistingGroupsMembers()
  for (const g of DEFAULT_GROUPS) {
    const existing = await prisma.group.findUnique({ where: { name: g.name } })
    if (!existing) {
      const group = await prisma.group.create({ data: g })
      console.log(`  ✓ Group created: ${g.name}`)

      // Migrate members from JSON
      const members = existingMembers.get(g.name) ?? []
      for (const email of members) {
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, name: email.split('@')[0] },
        })
        await prisma.userGroup.create({
          data: { userId: user.id, groupId: group.id },
        })
        console.log(`    → Member added: ${email}`)
      }
    } else {
      console.log(`  ○ Group exists: ${g.name}`)
    }
  }

  console.log('✅ Seed complete')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
