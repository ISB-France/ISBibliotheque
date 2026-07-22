import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import pinoHttp from 'pino-http'
import { resolve } from 'node:path'
import { logger } from './utils/logger.js'
import { config } from './config/index.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/error-handler.js'
import { notFoundHandler } from './middleware/not-found.js'

export function createApp(): express.Application {
  const app = express()

  app.set('trust proxy', 1)

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  app.use(cors({ origin: config.corsOrigin, credentials: true }))
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())
  app.use('/uploads', express.static(resolve(process.cwd(), '../../infra/uploads')))
  app.use(
    pinoHttp({
      logger,
      customLogLevel(_req, res) {
        if (res.statusCode >= 500) return 'error'
        if (res.statusCode >= 400) return 'warn'
        return 'info'
      },
    }),
  )

  app.use('/api', routes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
