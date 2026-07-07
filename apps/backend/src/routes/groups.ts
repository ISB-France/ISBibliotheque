import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../services/db.js'
import { requireAuth } from '../middleware/auth.js'
import type { AuthUser } from '../middleware/auth.js'

const router: Router = Router()

router.get('/groups', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as Request & { user?: AuthUser }).user
    const where = user?.isAdmin
      ? undefined
      : { members: { some: { user: { email: user?.email } } } }
    const groups = await prisma.group.findMany({
      where,
      orderBy: { name: 'asc' },
      select: { name: true, description: true },
    })
    res.json({ groups })
  } catch (err) {
    next(err)
  }
})

export default router
