import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requireAction } from '../middleware/authorize.js'
import { scan, importContainer } from '../services/discovery.js'

const router: Router = Router()

router.use('/admin', requireAuth, requireAction('admin_manage_apps'))

router.post('/admin/discover', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { host } = req.body as { host?: string }
    const containers = await scan(host)
    res.json({ containers })
  } catch (err) {
    next(err)
  }
})

router.post('/admin/discover/import', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { host, containerId, accessType, redirectUrl, manifest } = req.body as {
      host?: string
      containerId: string
      accessType?: 'redirect' | 'docker'
      redirectUrl?: string
      manifest: {
        id: string
        name: string
        description: string
        category: string
        icon: string
        roles?: string[]
      }
    }
    if (!containerId || !manifest?.id || !manifest?.name) {
      res
        .status(400)
        .json({ error: { message: 'containerId, manifest.id et manifest.name requis' } })
      return
    }
    const app = await importContainer({ host, containerId, accessType, redirectUrl, manifest })
    res.status(201).json({ app })
  } catch (err) {
    next(err)
  }
})

export default router
