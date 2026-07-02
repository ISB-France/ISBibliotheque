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
  renameMemberInAllGroups,
} from '../services/groups.js'
import { listProfiles, upsertProfile, updateProfileEmail, deleteProfile } from '../services/profiles.js'

const router: Router = Router()

router.use('/admin', requireAuth, requireAction('admin_manage_groups'))

router.get('/admin/groups', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await listGroups()
    res.json({ groups })
  } catch (err) {
    next(err)
  }
})

router.get('/admin/groups/:name', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await getGroup(String(req.params.name))
    if (!group) {
      res.status(404).json({ error: { message: 'Groupe introuvable' } })
      return
    }
    res.json({ group })
  } catch (err) {
    next(err)
  }
})

router.post('/admin/groups', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, members } = req.body
    if (!name) {
      res.status(400).json({ error: { message: 'Le nom du groupe est requis' } })
      return
    }
    const group = await createGroup({ name, description, members })
    res.status(201).json({ group })
  } catch (err) {
    next(err)
  }
})

router.put('/admin/groups/:name', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, members } = req.body
    const group = await updateGroup(String(req.params.name), { name, description, members })
    res.json({ group })
  } catch (err) {
    next(err)
  }
})

router.delete('/admin/groups/:name', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteGroup(String(req.params.name))
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

router.post(
  '/admin/groups/:name/members',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body
      if (!email) {
        res.status(400).json({ error: { message: 'Email requis' } })
        return
      }
      const group = await addMember(String(req.params.name), email, name)
      res.json({ group })
    } catch (err) {
      next(err)
    }
  },
)

router.delete(
  '/admin/groups/:name/members/:email',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const group = await removeMember(String(req.params.name), String(req.params.email))
      res.json({ group })
    } catch (err) {
      next(err)
    }
  },
)

// ── Profils utilisateurs (admin) ──

router.get('/admin/profiles', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const profiles = await listProfiles()
    res.json({ profiles })
  } catch (err) {
    next(err)
  }
})

router.put('/admin/profiles/:email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oldEmail = String(req.params.email)
    const { name, icon, email: newEmail, isAdmin } = req.body

    if (newEmail && newEmail !== oldEmail) {
      await updateProfileEmail(oldEmail, newEmail)
      await renameMemberInAllGroups(oldEmail, newEmail)
    }

    const targetEmail = newEmail ?? oldEmail
    const updated = await upsertProfile(targetEmail, { name, icon, isAdmin })
    res.json({ profile: updated })
  } catch (err) {
    next(err)
  }
})

router.delete('/admin/profiles/:email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = String(req.params.email)
    await deleteProfile(email)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default router
