import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { generateSsoToken, consumeSsoToken } from '../services/sso.js'

const router: Router = Router()

/**
 * POST /api/sso/generate
 * Génère un token SSO à usage unique valable 30 secondes.
 * Nécessite d'être connecté à ISBibliotheque.
 */
router.post(
  '/sso/generate',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await generateSsoToken(req.user!)
      res.json({ token })
    } catch (err) {
      next(err)
    }
  },
)

/**
 * POST /api/sso/consume
 * Valide et consomme un token SSO.
 * Appelé par l'application tierce (ex: ISBoard, app-recette-frontend-1).
 * Retourne les infos utilisateur — token supprimé après usage.
 */
router.post('/sso/consume', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body as { token?: string }
    if (!token) {
      res.status(400).json({ error: 'Token requis' })
      return
    }

    const user = await consumeSsoToken(token)
    if (!user) {
      res.status(401).json({ error: 'Token invalide, expiré ou déjà utilisé' })
      return
    }

    res.json({ user })
  } catch (err) {
    next(err)
  }
})

export default router
