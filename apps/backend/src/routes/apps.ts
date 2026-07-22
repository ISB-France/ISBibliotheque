import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { listApps, getApp, getManifestRoles } from '../services/registry.js'
import { getRolesForEmail } from '../services/groups.js'
import { NotFoundError } from '../utils/errors.js'
import { optionalAuth } from '../middleware/auth.js'
import type { AuthUser } from '../middleware/auth.js'

async function filterAppsByUser(user?: AuthUser) {
  const apps = listApps()
  if (user?.isAdmin) return apps
  if (!user) return []
  const userRoles = await getRolesForEmail(user.email)
  if (userRoles.length === 0) return []
  return apps.filter((app) => {
    const roles = getManifestRoles(app.id)
    if (roles.length === 0) return false
    return userRoles.some((r) => roles.includes(r))
  })
}

const router: Router = Router()

router.get('/apps', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as Request & { user?: AuthUser }).user
    const apps = await filterAppsByUser(user)
    res.json({ apps })
  } catch (err) {
    next(err)
  }
})

router.get(
  '/apps/categories',
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as Request & { user?: AuthUser }).user
      const apps = await filterAppsByUser(user)
      const categories = [...new Set(apps.map((a) => a.category))].sort()
      res.json({ categories })
    } catch (err) {
      next(err)
    }
  },
)

router.get('/apps/:id', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const app = getApp(String(req.params.id))
    if (!app) throw new NotFoundError('Application')
    const roles = getManifestRoles(app.id)
    const user = (req as Request & { user?: AuthUser }).user
    if (user?.isAdmin) {
      res.json({ app })
      return
    }
    if (roles.length === 0 || !user) throw new NotFoundError('Application')
    const userRoles = await getRolesForEmail(user.email)
    if (!userRoles.some((r) => roles.includes(r))) throw new NotFoundError('Application')
    res.json({ app })
  } catch (err) {
    next(err)
  }
})

export default router
