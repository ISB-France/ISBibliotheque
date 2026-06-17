import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt.js'
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js'

export interface AuthUser {
  email: string
  name: string
  roles: string[]
  isAdmin: boolean
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

function extractToken(req: Request): string | null {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) return header.slice(7)

  const cookie = req.cookies?.token
  if (cookie) return cookie

  return null
}

function setUserFromToken(req: Request, token: string): boolean {
  const result = verifyToken(token)
  if (!result.ok) return false

  req.user = {
    email: result.payload.email,
    name: result.payload.name,
    roles: result.payload.roles,
    isAdmin: result.payload.isAdmin,
  }
  return true
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req)
  if (!token) {
    next(new UnauthorizedError('Token manquant'))
    return
  }

  if (!setUserFromToken(req, token)) {
    next(new UnauthorizedError('Token invalide ou expiré'))
    return
  }

  next()
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user?.isAdmin) {
    next(new ForbiddenError('Accès réservé aux administrateurs'))
    return
  }
  next()
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req)
  if (!token) {
    next()
    return
  }
  setUserFromToken(req, token)
  next()
}
