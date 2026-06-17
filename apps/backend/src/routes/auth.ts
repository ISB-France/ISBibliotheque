import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { resolve, extname } from 'node:path'
import { config } from '../config/index.js'
import { prisma } from '../services/db.js'
import { getAuthorizationUrl, handleCallback, getLogoutUrl } from '../services/entra.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'
import { getProfile, upsertProfile } from '../services/profiles.js'
import { createToken } from '../utils/jwt.js'
import { verifyPassword } from '../utils/password.js'
import { logger } from '../utils/logger.js'

const storage = multer.diskStorage({
  destination: resolve(process.cwd(), '../../infra/uploads/avatars'),
  filename(_req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Format d\'image non supporté. Utilisez JPG, PNG, WebP, GIF ou SVG.'))
    }
  },
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

// ── Fallback admin (mot de passe local, sans Entra ID) ──

router.post('/auth/login-admin', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: { message: 'Email et mot de passe requis' } })
      return
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) {
      res.status(401).json({ error: { message: 'Email ou mot de passe incorrect' } })
      return
    }

    if (!user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: { message: 'Email ou mot de passe incorrect' } })
      return
    }

    const isAdmin = email.toLowerCase() === config.authAdminEmail.toLowerCase()

    let roles: string[] = []
    if (isAdmin) {
      roles = ['admin']
    } else {
      const groups = await prisma.user.findUnique({
        where: { id: user.id },
        include: { groups: { include: { group: true } } },
      })
      roles = groups?.groups.map((ug: { group: { name: string } }) => ug.group.name) ?? []
    }

    const token = createToken({
      sub: email,
      email,
      name: user.name,
      roles,
      isAdmin,
    })
    setTokenCookie(res, token)
    res.json({ token, email, name: user.name, roles, isAdmin })
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

router.post('/auth/logout', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    clearTokenCookie(res)
    const url = await getLogoutUrl(req.user?.email)
    res.json({ message: 'Déconnecté', logoutUrl: url ?? undefined })
  } catch (err) {
    next(err)
  }
})

router.get('/auth/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = req.user ? await getProfile(req.user.email) : undefined
    res.json({
      user: {
        ...req.user,
        name: profile?.name ?? req.user?.name,
        icon: profile?.icon ?? '',
      },
    })
  } catch (err) { next(err) }
})

// ── Profil utilisateur ──

router.get('/auth/profile', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return
    const profile = await getProfile(req.user.email)
    res.json({
      profile: {
        email: req.user.email,
        name: profile?.name ?? req.user.name,
        icon: profile?.icon ?? '',
      },
    })
  } catch (err) { next(err) }
})

router.put('/auth/profile', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return
    const { name, icon } = req.body
    const updated = await upsertProfile(req.user.email, { name, icon })
    const token = createToken({
      sub: req.user.email,
      email: req.user.email,
      name: updated.name,
      roles: req.user.roles,
      isAdmin: req.user.isAdmin,
    })
    setTokenCookie(res, token)
    res.json({
      profile: updated,
      token,
      user: {
        email: req.user.email,
        name: updated.name,
        roles: req.user.roles,
        isAdmin: req.user.isAdmin,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.post('/auth/profile/avatar', requireAuth, (req: Request, res: Response, next: NextFunction) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ error: { message: 'Fichier trop volumineux (max 2 Mo)' } })
        return
      }
      res.status(400).json({ error: { message: err.message } })
      return
    }
    try {
      if (!req.user || !req.file) {
        res.status(400).json({ error: { message: 'Aucun fichier fourni' } })
        return
      }
      const avatarUrl = `/uploads/avatars/${req.file.filename}`
      const updated = upsertProfile(req.user.email, { icon: avatarUrl })
      logger.info({ email: req.user.email, avatarUrl }, 'Avatar mis à jour')
      res.json({ profile: updated, url: avatarUrl })
    } catch (error) {
      next(error)
    }
  })
})

export default router
