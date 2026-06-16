import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import { getApp, getManifestRoles } from '../services/registry.js'
import { startContainer, stopContainer, getContainerStatus } from '../services/docker.js'
import { NotFoundError, ForbiddenError } from '../utils/errors.js'
import { requireAuth } from '../middleware/auth.js'
import { requireAction } from '../middleware/authorize.js'

const launchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Trop de lancements, réessayez dans 1 minute' } },
})

function checkAppAccess(req: Request): void {
  const id = String(req.params.id)
  const manifest = getApp(id)
  if (!manifest) throw new NotFoundError('Application')
  if (manifest.accessType !== 'docker') {
    throw new ForbiddenError("Cette application n'est pas de type Docker")
  }
  const roles = getManifestRoles(manifest.id)
  if (roles.length === 0) return
  if (!req.user) throw new NotFoundError('Application')
  if (req.user.isAdmin) return
  if (!req.user.roles.some((r) => roles.includes(r))) throw new NotFoundError('Application')
}

const router: Router = Router()

router.post(
  '/apps/:id/start',
  requireAuth,
  requireAction('launch_app'),
  launchLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      checkAppAccess(req)
      const status = await startContainer(String(req.params.id))
      res.json({ status })
    } catch (err) {
      next(err)
    }
  },
)

router.post(
  '/apps/:id/stop',
  requireAuth,
  requireAction('launch_app'),
  launchLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      checkAppAccess(req)
      const status = await stopContainer(String(req.params.id))
      res.json({ status })
    } catch (err) {
      next(err)
    }
  },
)

router.get(
  '/apps/:id/status',
  requireAuth,
  requireAction('view_apps'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      checkAppAccess(req)
      const status = await getContainerStatus(String(req.params.id))
      res.json({ status })
    } catch (err) {
      next(err)
    }
  },
)

export default router
