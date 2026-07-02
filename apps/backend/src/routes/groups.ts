import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { prisma } from '../services/db.js'
import { optionalAuth } from '../middleware/auth.js'
import type { AuthUser } from '../middleware/auth.js'

const router: Router = Router()

router.get('/groups', optionalAuth, async (req, res: Response, next: NextFunction) => {
  try {
    const user = req.user as AuthUser | undefined
    const allGroups = await prisma.group.findMany({
      orderBy: { name: 'asc' },
      select: { name: true, description: true },
    })
    const groups =
      user && !user.isAdmin
        ? allGroups.filter((g: { name: string; description: string }) => user.roles.includes(g.name))
        : allGroups
    res.json({ groups })
  } catch (err) {
    next(err)
  }
})

export default router
