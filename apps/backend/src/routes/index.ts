import { Router } from 'express'
import healthRouter from './health.js'
import versionRouter from './version.js'
import appsRouter from './apps.js'
import authRouter from './auth.js'
import adminRouter from './admin.js'
import appsAdminRouter from './apps-admin.js'
import dockerRouter from './docker.js'
import groupsRouter from './groups.js'
import discoveryRouter from './discovery.js'

const router: Router = Router()

router.use(healthRouter)
router.use(versionRouter)
router.use(appsRouter)
router.use(authRouter)
router.use(adminRouter)
router.use(appsAdminRouter)
router.use(dockerRouter)
router.use(groupsRouter)
router.use(discoveryRouter)

export default router
