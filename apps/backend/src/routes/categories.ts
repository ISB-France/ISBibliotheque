import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requireAction } from '../middleware/authorize.js'
import { listCategories, addCategory, deleteCategory } from '../services/categories.js'

const router: Router = Router()

// Lecture publique (utilisée dans AddAppModal)
router.get('/categories', (_req: Request, res: Response) => {
  res.json({ categories: listCategories() })
})

// Création / suppression réservées aux admins
router.use('/admin/categories', requireAuth, requireAction('admin_manage_apps'))

router.post('/admin/categories', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body as { name?: string }
    if (!name) {
      res.status(400).json({ error: 'Le nom est requis' })
      return
    }
    const categories = addCategory(name)
    res.status(201).json({ categories })
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('existe déjà')) {
      res.status(409).json({ error: err.message })
      return
    }
    next(err)
  }
})

router.delete('/admin/categories/:name', (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = decodeURIComponent(String(req.params.name))
    const categories = deleteCategory(name)
    res.json({ categories })
  } catch (err) {
    next(err)
  }
})

export default router
