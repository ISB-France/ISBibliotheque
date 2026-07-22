import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requireAction } from '../middleware/authorize.js'
import { prisma } from '../services/db.js'
import { config } from '../config/index.js'
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
import { listProfiles, upsertProfile, updateProfileEmail } from '../services/profiles.js'

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
    const { name, icon, email: newEmail } = req.body

    if (newEmail && newEmail !== oldEmail) {
      await updateProfileEmail(oldEmail, newEmail)
      await renameMemberInAllGroups(oldEmail, newEmail)
    }

    const targetEmail = newEmail ?? oldEmail
    const updated = await upsertProfile(targetEmail, { name, icon })
    res.json({ profile: updated })
  } catch (err) {
    next(err)
  }
})

// ── Gestion des utilisateurs ──

router.get('/admin/users', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { email: 'asc' },
      select: { id: true, email: true, name: true, icon: true, createdAt: true },
    })
    res.json({ users })
  } catch (err) {
    next(err)
  }
})

router.post('/admin/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email } = req.body
    if (!firstName || !lastName || !email) {
      res.status(400).json({ error: { message: 'Prénom, nom et email sont requis' } })
      return
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      res.status(409).json({ error: { message: 'Un utilisateur avec cet email existe déjà' } })
      return
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: `${firstName} ${lastName}`,
      },
    })

    res.status(201).json({ user: { email: user.email, name: user.name, icon: user.icon } })
  } catch (err) {
    next(err)
  }
})

router.put('/admin/users/:email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oldEmail = String(req.params.email).toLowerCase()
    const { firstName, lastName, email: newEmail } = req.body

    if (oldEmail === config.authAdminEmail.toLowerCase()) {
      res
        .status(403)
        .json({ error: { message: "Impossible de modifier l'administrateur principal" } })
      return
    }

    const existing = await prisma.user.findUnique({ where: { email: oldEmail } })
    if (!existing) {
      res.status(404).json({ error: { message: 'Utilisateur introuvable' } })
      return
    }

    const targetEmail = newEmail ? String(newEmail).toLowerCase() : oldEmail
    const name = firstName && lastName ? `${firstName} ${lastName}` : undefined

    if (newEmail && newEmail !== oldEmail) {
      const emailTaken = await prisma.user.findUnique({ where: { email: targetEmail } })
      if (emailTaken) {
        res.status(409).json({ error: { message: 'Cet email est déjà utilisé' } })
        return
      }
      await prisma.user.update({ where: { email: oldEmail }, data: { email: targetEmail } })
      await renameMemberInAllGroups(oldEmail, targetEmail)
    }

    if (name) {
      await prisma.user.update({ where: { email: targetEmail }, data: { name } })
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      select: { email: true, name: true, icon: true },
    })
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

router.delete('/admin/users/:email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = String(req.params.email).toLowerCase()

    if (email === config.authAdminEmail.toLowerCase()) {
      res
        .status(403)
        .json({ error: { message: "Impossible de supprimer l'administrateur principal" } })
      return
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (!existing) {
      res.status(404).json({ error: { message: 'Utilisateur introuvable' } })
      return
    }

    await prisma.user.delete({ where: { email } })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default router
