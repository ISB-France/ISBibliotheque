import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'
import { ValidationError } from '../utils/errors.js'

export function validate(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      next(new ValidationError(result.error.errors))
      return
    }
    req.body = result.data
    next()
  }
}
