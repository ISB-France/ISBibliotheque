import { Router } from 'express'
import type { Request, Response } from 'express'
import { listApps, getApp, getManifestRoles } from '../services/registry.js'
import { NotFoundError } from '../utils/errors.js'
import { optionalAuth } from '../middleware/auth.js'
import type { AuthUser } from '../middleware/auth.js'

function filterAppsByUser(user?: AuthUser) {
  const apps = listApps()
  if (!user) return apps
  if (user.isAdmin) return apps
  return apps.filter((app) => {
    const roles = getManifestRoles(app.id)
    if (roles.length === 0) return true
    return user.roles.some((r) => roles.includes(r))
  })
}

const router: Router = Router()

router.get('/apps', optionalAuth, (req: Request, res: Response) => {
  const user = (req as Request & { user?: AuthUser }).user
  const apps = filterAppsByUser(user)
  res.json({ apps })
})

router.get('/apps/categories', optionalAuth, (req: Request, res: Response) => {
  const user = (req as Request & { user?: AuthUser }).user
  const apps = filterAppsByUser(user)
  const categories = [...new Set(apps.map((a) => a.category))].sort()
  res.json({ categories })
})

router.get('/apps/:id', optionalAuth, (req: Request, res: Response) => {
  const app = getApp(String(req.params.id))
  if (!app) throw new NotFoundError('Application')
  const roles = getManifestRoles(app.id)
  const user = (req as Request & { user?: AuthUser }).user
  if (user && !user.isAdmin && roles.length > 0) {
    if (!user.roles.some((r) => roles.includes(r))) throw new NotFoundError('Application')
  }
  res.json({ app })
})

export default router
