import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requireAction } from '../middleware/authorize.js'
import { validate } from '../middleware/validate.js'
import { appManifestSchema, appManifestUpdateSchema } from '../utils/validation.js'
import { listApps, writeManifest, updateManifest, deleteManifest } from '../services/registry.js'
import { NotFoundError } from '../utils/errors.js'

const router: Router = Router()

router.use('/admin', requireAuth, requireAction('admin_manage_apps'))

router.post('/admin/apps', validate(appManifestSchema), (req: Request, res: Response) => {
  const manifest = writeManifest(req.body)
  res.status(201).json({ app: manifest })
})

router.put(
  '/admin/apps/:id',
  validate(appManifestUpdateSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id)
      const updated = updateManifest(id, req.body)
      if (!updated) throw new NotFoundError('Application')
      res.json({ app: updated })
    } catch (err) {
      next(err)
    }
  },
)

router.delete('/admin/apps/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id)
    if (!deleteManifest(id)) throw new NotFoundError('Application')
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

router.get('/admin/apps', (_req: Request, res: Response) => {
  const apps = listApps()
  res.json({ apps })
})

export default router
