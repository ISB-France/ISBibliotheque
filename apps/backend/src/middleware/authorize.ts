import type { Request, Response, NextFunction } from 'express'
import { authorize, auditDenial, type Action } from '../services/authorization.js'
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js'

export function requireAction(action: Action, resource?: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      auditDenial(undefined, action, resource, req.ip ?? 'unknown', req.originalUrl)
      next(new UnauthorizedError('Authentification requise'))
      return
    }

    if (!authorize(req.user, action, resource)) {
      auditDenial(req.user, action, resource, req.ip ?? 'unknown', req.originalUrl)
      next(new ForbiddenError('Action non autorisée'))
      return
    }

    next()
  }
}
