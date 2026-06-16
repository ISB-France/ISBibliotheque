import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import { config } from '../config/index.js'
import { login, loginByEmail } from '../services/auth.js'
import { getAuthorizationUrl, handleCallback, getLogoutUrl } from '../services/entra.js'
import { requireAuth } from '../middleware/auth.js'
import { UnauthorizedError } from '../utils/errors.js'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Trop de tentatives, réessayez dans 15 minutes' } },
})

const router: Router = Router()

function setTokenCookie(res: Response, token: string): void {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  })
}

function clearTokenCookie(res: Response): void {
  res.clearCookie('token', { path: '/' })
}

// ── Routes locales ──

router.post('/auth/login', limiter, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: { message: 'Email et mot de passe requis' } })
      return
    }
    const result = login(email, password)
    if (!result) throw new UnauthorizedError('Email ou mot de passe incorrect')
    setTokenCookie(res, result.token)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.post('/auth/login-email', limiter, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    if (!email) {
      res.status(400).json({ error: { message: 'Email requis' } })
      return
    }
    const result = loginByEmail(email)
    if (!result) throw new UnauthorizedError('Email non reconnu')
    setTokenCookie(res, result.token)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

// ── Routes Entra ID ──

router.get('/auth/login', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const url = await getAuthorizationUrl()
    if (!url) {
      res.status(503).json({ error: { message: 'Entra ID non configuré' } })
      return
    }
    res.redirect(url)
  } catch (err) {
    next(err)
  }
})

router.get('/auth/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.query as Record<string, string>
    const result = await handleCallback(params)
    if (!result) {
      res.redirect(`${config.appUrl}/login?error=auth_failed`)
      return
    }
    setTokenCookie(res, result.token)
    res.redirect(config.appUrl)
  } catch (err) {
    next(err)
  }
})

router.post('/auth/logout', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    clearTokenCookie(res)
    const url = await getLogoutUrl()
    res.json({ message: 'Déconnecté', logoutUrl: url ?? undefined })
  } catch (err) {
    next(err)
  }
})

router.get('/auth/me', requireAuth, (req: Request, res: Response) => {
  res.json({ user: req.user })
})

export default router
