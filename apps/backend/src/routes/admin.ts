import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requireAction } from '../middleware/authorize.js'
import {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
} from '../services/groups.js'

const router: Router = Router()

router.use(requireAuth, requireAction('admin_manage_groups'))

router.get('/admin/groups', (_req: Request, res: Response) => {
  res.json({ groups: listGroups() })
})

router.get('/admin/groups/:name', (req: Request, res: Response) => {
  const group = getGroup(String(req.params.name))
  if (!group) {
    res.status(404).json({ error: { message: 'Groupe introuvable' } })
    return
  }
  res.json({ group })
})

router.post('/admin/groups', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body
    if (!name) {
      res.status(400).json({ error: { message: 'Le nom du groupe est requis' } })
      return
    }
    const group = createGroup({ name, description })
    res.status(201).json({ group })
  } catch (err) {
    next(err)
  }
})

router.put('/admin/groups/:name', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description, members } = req.body
    const group = updateGroup(String(req.params.name), { description, members })
    res.json({ group })
  } catch (err) {
    next(err)
  }
})

router.delete('/admin/groups/:name', (req: Request, res: Response, next: NextFunction) => {
  try {
    deleteGroup(String(req.params.name))
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

router.post('/admin/groups/:name/members', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    if (!email) {
      res.status(400).json({ error: { message: 'Email requis' } })
      return
    }
    const group = addMember(String(req.params.name), email)
    res.json({ group })
  } catch (err) {
    next(err)
  }
})

router.delete(
  '/admin/groups/:name/members/:email',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const group = removeMember(String(req.params.name), String(req.params.email))
      res.json({ group })
    } catch (err) {
      next(err)
    }
  },
)

export default router
