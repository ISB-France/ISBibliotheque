import { Router, Request, Response } from 'express'
import { config } from '../config/index.js'

const router: Router = Router()

router.get('/version', (_req: Request, res: Response) => {
  res.json({
    name: config.name,
    version: config.version,
    commit: config.commit,
  })
})

export default router
