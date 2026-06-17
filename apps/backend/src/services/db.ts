import { createRequire } from 'node:module'
import { resolve } from 'node:path'

const require = createRequire(import.meta.url)
const { PrismaClient } = require(resolve(import.meta.dirname, '../generated/prisma/index.js'))

export const prisma = new PrismaClient()

