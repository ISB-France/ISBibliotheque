import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Trash2, Pencil, ArrowLeft, RefreshCw, Save, X } from 'lucide-react'
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
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingApp, setEditingApp] = useState<AppResponse | null>(null)
  const [tab, setTab] = useState<'apps' | 'groups' | 'discovery' | 'profiles'>('apps')
  const [confirmDeleteApp, setConfirmDeleteApp] = useState<{ id: string; name: string } | null>(
    null,
  )

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

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.admin.listProfiles()
      setProfiles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading) fetchApps()
  }, [authLoading, fetchApps])

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
                    : tab === 'profiles'
                      ? "Gestion des profils utilisateurs"
                      : 'Découverte de conteneurs Docker'}
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
        </div>

        <div className="flex items-center gap-1 mb-8">
          <Button variant={tab === 'apps' ? 'default' : 'ghost'} onClick={() => setTab('apps')}>
            Applications
          </Button>
          <Button variant={tab === 'groups' ? 'default' : 'ghost'} onClick={() => setTab('groups')}>
            Groupes
          </Button>
          <Button variant={tab === 'profiles' ? 'default' : 'ghost'} onClick={() => setTab('profiles')}>
            Profils
          </Button>
          <Button
            variant={tab === 'discovery' ? 'default' : 'ghost'}
            onClick={() => setTab('discovery')}
          >
            Découverte Docker
          </Button>
        </div>

        {tab === 'groups' ? (
          <GroupManager />
        ) : tab === 'profiles' ? (
          <ProfileManager />
        ) : tab === 'discovery' ? (
          <DockerDiscovery />
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
      {showModal && <AddAppModal onClose={() => setShowModal(false)} onAdd={handleAddApp} />}
      {editingApp && (
        <AddAppModal
          app={editingApp}
          onClose={() => setEditingApp(null)}
          onAdd={(json) => handleEditApp(editingApp.id, json)}
        />
      )}
    </div>
  )
}

function ProfileManager() {
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [creating, setCreating] = useState(false)
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<UserProfile | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.admin.listProfiles()
      setProfiles(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim() || !newEmail.trim()) return
    setCreating(true)
    try {
      await api.admin.updateProfile(newEmail.trim(), { name: newName.trim() })
      toast.success(`Profil "${newName.trim()}" créé`)
      setShowCreate(false)
      setNewName('')
      setNewEmail('')
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setCreating(false)
    }
  }

  function handleStartEdit(profile: UserProfile) {
    setEditingProfile(profile)
    setEditName(profile.name)
    setEditEmail(profile.email)
  }

  function handleCancelEdit() {
    setEditingProfile(null)
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingProfile || !editName.trim() || !editEmail.trim()) return
    setSaving(true)
    try {
      await api.admin.updateProfile(editingProfile.email, {
        name: editName.trim(),
        email: editEmail.trim() !== editingProfile.email ? editEmail.trim() : undefined,
      })
      toast.success(`Profil "${editName.trim()}" mis à jour`)
      setEditingProfile(null)
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(profile: UserProfile) {
    try {
      await api.admin.deleteProfile(profile.email)
      toast.success(`Profil "${profile.name}" supprimé`)
      setConfirmDelete(null)
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    }
  }

  function isImageUrl(str: string): boolean {
    return str.startsWith('/uploads/') || str.startsWith('http')
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-card rounded-2xl border animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-[15px] text-isb-muted">
          Consultez et gérez les profils utilisateurs
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw size={15} />
            Actualiser
          </Button>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus size={16} />
            Nouveau profil
          </Button>
        </div>
      </div>

      {showCreate && (
        <Card className="p-6 mb-6">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <h3 className="text-[16px] font-bold font-heading text-isb-brown">Nouveau profil</h3>
            <Input
              placeholder="Nom de l'utilisateur"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={creating}>
                {creating ? 'Création...' : 'Créer'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      )}

      {profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-[16px] font-semibold text-isb-brown">Aucun profil</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Groupes</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-secondary text-[14px] overflow-hidden">
                        {profile.icon && isImageUrl(profile.icon) ? (
                          <img src={profile.icon} alt="" className="w-full h-full object-cover" />
                        ) : (
                          profile.icon || profile.name[0].toUpperCase()
                        )}
                      </div>
                      <span className="text-[14px] font-medium text-isb-brown">{profile.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-isb-muted text-[13px]">{profile.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {profile.groups.length === 0 ? (
                        <span className="text-[12px] text-isb-muted italic">Aucun groupe</span>
                      ) : (
                        profile.groups.map((g) => (
                          <Badge key={g} variant="secondary" className="text-[11px]">
                            {g}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={profile.isAdmin ? 'default' : 'outline'} className="text-[11px]">
                      {profile.isAdmin ? 'Admin' : 'Utilisateur'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(profile)}
                      aria-label={`Modifier ${profile.name}`}
                    >
                      <Pencil size={14} className="text-isb-muted" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={profile.isAdmin}
                      onClick={() => setConfirmDelete(profile)}
                      aria-label={`Supprimer ${profile.name}`}
                    >
                      <Trash2 size={15} className={profile.isAdmin ? 'text-muted' : 'text-destructive'} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-2xl border shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-bold font-heading text-isb-brown">Modifier le profil</h3>
              <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                <X size={16} />
              </Button>
            </div>
            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <Input
                placeholder="Nom"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
              <Input
                placeholder="Email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
              <div className="flex gap-2 justify-end mt-2">
                <Button type="submit" disabled={saving}>
                  <Save size={14} />
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Supprimer le profil"
        message={`Supprimer le profil de "${confirmDelete?.name}" (${confirmDelete?.email}) ? Cette action est irreversible.`}
        confirmLabel="Supprimer"
        onConfirm={() => handleDelete(confirmDelete!)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
