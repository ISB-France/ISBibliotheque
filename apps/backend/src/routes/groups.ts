import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../services/db.js'

const router: Router = Router()

router.get('/groups', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { name: 'asc' },
      select: { name: true, description: true },
    })
    res.json({ groups })
  } catch (err) { next(err) }
})

export default router
