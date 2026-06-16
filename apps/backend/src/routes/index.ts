import { Router } from 'express'
import healthRouter from './health.js'
import versionRouter from './version.js'
import appsRouter from './apps.js'
import authRouter from './auth.js'
import adminRouter from './admin.js'
import appsAdminRouter from './apps-admin.js'
import dockerRouter from './docker.js'

const router: Router = Router()

router.use(healthRouter)
router.use(versionRouter)
router.use(appsRouter)
router.use(authRouter)
router.use(adminRouter)
router.use(appsAdminRouter)
router.use(dockerRouter)

export default router
