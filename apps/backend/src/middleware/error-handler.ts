import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'
import { AppError } from '../utils/errors.js'
import { ZodError } from 'zod'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    })
    return
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Données invalides',
        details: err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
    })
    return
  }

  logger.error({ err }, 'Unhandled error')
  res.status(500).json({
    error: { message: 'Erreur interne du serveur' },
  })
}
