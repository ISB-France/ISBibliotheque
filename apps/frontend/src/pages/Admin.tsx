import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Trash2, Pencil, ArrowLeft, RefreshCw, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { api, type AppResponse, type UserProfile } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/Header'
import { LoadingScreen } from '@/components/LoadingScreen'
import { ErrorScreen } from '@/components/ErrorScreen'
import { NotAuthorizedScreen } from '@/components/NotAuthorizedScreen'
import { AddAppModal } from '@/components/AddAppModal'
import { GroupManager } from '@/components/GroupManager'
import { DockerDiscovery } from '@/components/DockerDiscovery'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [apps, setApps] = useState<AppResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingApp, setEditingApp] = useState<AppResponse | null>(null)
  const [tab, setTab] = useState<'apps' | 'groups' | 'discovery' | 'users'>('apps')
  const [confirmDeleteApp, setConfirmDeleteApp] = useState<{ id: string; name: string } | null>(
    null,
  )
  const [users, setUsers] = useState<UserProfile[]>([])
  const [showUserModal, setShowUserModal] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [submittingUser, setSubmittingUser] = useState(false)
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [submittingEdit, setSubmittingEdit] = useState(false)
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<{
    email: string
    name: string
  } | null>(null)

  const fetchApps = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.admin.listApps()
      setApps(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.admin.listUsers()
      setUsers(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs')
    }
  }, [])

  useEffect(() => {
    if (!authLoading) fetchApps()
  }, [authLoading, fetchApps])

  useEffect(() => {
    if (!authLoading && tab === 'users') fetchUsers()
  }, [authLoading, tab, fetchUsers])

  async function handleDelete(id: string, name: string) {
    try {
      await api.admin.deleteApp(id)
      toast.success(`"${name}" supprimée`)
      setConfirmDeleteApp(null)
      fetchApps()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    }
  }

  async function handleAddApp(json: string) {
    const data = JSON.parse(json) as Parameters<typeof api.admin.createApp>[0]
    await api.admin.createApp(data)
    toast.success(`Application "${data.name}" créée`)
    fetchApps()
  }

  async function handleEditApp(id: string, json: string) {
    const data = JSON.parse(json) as Record<string, unknown>
    const { id: _id, ...patch } = data
    await api.admin.updateApp(id, patch)
    toast.success('Application mise à jour')
    setEditingApp(null)
    fetchApps()
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return
    setSubmittingUser(true)
    try {
      await api.admin.createUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      })
      toast.success('Utilisateur créé')
      setShowUserModal(false)
      setFirstName('')
      setLastName('')
      setEmail('')
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la création')
    } finally {
      setSubmittingUser(false)
    }
  }

  function openEditUser(u: UserProfile) {
    const parts = u.name.split(' ')
    setEditFirstName(parts[0] ?? '')
    setEditLastName(parts.slice(1).join(' '))
    setEditEmail(u.email)
    setEditingUser(u)
  }

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault()
    if (!editingUser) return
    if (!editFirstName.trim() || !editLastName.trim() || !editEmail.trim()) return
    setSubmittingEdit(true)
    try {
      await api.admin.updateUser(editingUser.email, {
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        email: editEmail.trim(),
      })
      toast.success('Utilisateur mis à jour')
      setEditingUser(null)
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la modification')
    } finally {
      setSubmittingEdit(false)
    }
  }

  async function handleDeleteUser(email: string, name: string) {
    try {
      await api.admin.deleteUser(email)
      toast.success(`"${name}" supprimé`)
      setConfirmDeleteUser(null)
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression')
    }
  }

  if (authLoading) return <LoadingScreen />
  if (!user) {
    navigate('/login', { replace: true })
    return null
  }
  if (!user.isAdmin) {
    return <NotAuthorizedScreen userName={user.name} onBack={() => navigate('/')} />
  }

  if (error) return <ErrorScreen message={error} onRetry={fetchApps} />

  return (
    <div className="bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              aria-label="Retour au portail"
            >
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-[28px] font-extrabold font-heading leading-tight text-isb-brown">
                Administration
              </h1>
              <p className="text-[15px] mt-1.5 text-isb-muted">
                {tab === 'apps'
                  ? 'Gestion des applications'
                  : tab === 'groups'
                    ? "Gestion des groupes d'accès"
                    : tab === 'discovery'
                      ? 'Découverte de conteneurs Docker'
                      : 'Gestion des utilisateurs'}
              </p>
            </div>
          </div>
          {tab === 'apps' && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={fetchApps}>
                <RefreshCw size={15} />
                Actualiser
              </Button>
              <Button onClick={() => setShowModal(true)}>
                <Plus size={16} />
                Ajouter
              </Button>
            </div>
          )}
          {tab === 'users' && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={fetchUsers}>
                <RefreshCw size={15} />
                Actualiser
              </Button>
              <Button onClick={() => setShowUserModal(true)}>
                <UserPlus size={16} />
                Ajouter un utilisateur
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 mb-8">
          <Button variant={tab === 'apps' ? 'default' : 'ghost'} onClick={() => setTab('apps')}>
            Applications
          </Button>
          <Button variant={tab === 'groups' ? 'default' : 'ghost'} onClick={() => setTab('groups')}>
            Groupes
          </Button>
          <Button
            variant={tab === 'discovery' ? 'default' : 'ghost'}
            onClick={() => setTab('discovery')}
          >
            Découverte Docker
          </Button>
          <Button variant={tab === 'users' ? 'default' : 'ghost'} onClick={() => setTab('users')}>
            Utilisateurs
          </Button>
        </div>

        {tab === 'groups' ? (
          <GroupManager />
        ) : tab === 'discovery' ? (
          <DockerDiscovery />
        ) : tab === 'users' ? (
          <div>
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-[16px] font-semibold text-isb-brown">Aucun utilisateur</p>
                <Button onClick={() => setShowUserModal(true)}>
                  <UserPlus size={16} />
                  Ajouter le premier utilisateur
                </Button>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => {
                      const isAdmin = u.email === user?.email
                      return (
                        <TableRow key={u.email}>
                          <TableCell>
                            <div className="text-[14px] font-medium text-isb-brown">{u.name}</div>
                          </TableCell>
                          <TableCell className="text-isb-muted">{u.email}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isAdmin}
                              onClick={() => openEditUser(u)}
                              aria-label={`Modifier ${u.name}`}
                            >
                              <Pencil size={14} className="text-isb-muted" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isAdmin}
                              onClick={() => setConfirmDeleteUser({ email: u.email, name: u.name })}
                              aria-label={`Supprimer ${u.name}`}
                            >
                              <Trash2 size={15} className="text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-card rounded-2xl border animate-pulse"
                style={{ borderColor: 'hsl(var(--border))' }}
              />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[16px] font-semibold text-isb-brown">Aucune application</p>
            <Button onClick={() => setShowModal(true)}>
              <Plus size={16} />
              Ajouter la première application
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="text-[14px] font-medium text-isb-brown">{app.name}</div>
                      <div className="text-[12px] text-isb-muted">{app.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{app.accessType}</Badge>
                    </TableCell>
                    <TableCell className="text-isb-muted">{app.category}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingApp(app)}
                        aria-label={`Modifier ${app.name}`}
                      >
                        <Pencil size={14} className="text-isb-muted" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setConfirmDeleteApp({ id: app.id, name: app.name })}
                        aria-label={`Supprimer ${app.name}`}
                      >
                        <Trash2 size={15} className="text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <ConfirmDialog
        open={!!confirmDeleteApp}
        title="Supprimer l'application"
        message={`Supprimer l'application "${confirmDeleteApp?.name}" ? Cette action est irreversible.`}
        confirmLabel="Supprimer"
        onConfirm={() => handleDelete(confirmDeleteApp!.id, confirmDeleteApp!.name)}
        onCancel={() => setConfirmDeleteApp(null)}
      />
      <ConfirmDialog
        open={!!confirmDeleteUser}
        title="Supprimer l'utilisateur"
        message={`Supprimer l'utilisateur "${confirmDeleteUser?.name}" ? Cette action est irreversible.`}
        confirmLabel="Supprimer"
        onConfirm={() => handleDeleteUser(confirmDeleteUser!.email, confirmDeleteUser!.name)}
        onCancel={() => setConfirmDeleteUser(null)}
      />
      {showModal && <AddAppModal onClose={() => setShowModal(false)} onAdd={handleAddApp} />}
      {editingApp && (
        <AddAppModal
          app={editingApp}
          onClose={() => setEditingApp(null)}
          onAdd={(json) => handleEditApp(editingApp.id, json)}
        />
      )}

      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-medium text-isb-brown mb-1 block">Prénom</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jean"
                required
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-isb-brown mb-1 block">Nom</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dupont"
                required
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-isb-brown mb-1 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean.dupont@isb.fr"
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button type="button" variant="ghost" onClick={() => setShowUserModal(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={submittingUser}>
                {submittingUser ? 'Création…' : 'Créer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-medium text-isb-brown mb-1 block">Prénom</label>
              <Input
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                placeholder="Jean"
                required
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-isb-brown mb-1 block">Nom</label>
              <Input
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                placeholder="Dupont"
                required
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-isb-brown mb-1 block">Email</label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="jean.dupont@isb.fr"
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button type="button" variant="ghost" onClick={() => setEditingUser(null)}>
                Annuler
              </Button>
              <Button type="submit" disabled={submittingEdit}>
                {submittingEdit ? 'Modification…' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
