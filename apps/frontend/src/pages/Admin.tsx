import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Trash2, Pencil, ArrowLeft, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { api, type AppResponse } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/Header'
import { LoadingScreen } from '@/components/LoadingScreen'
import { ErrorScreen } from '@/components/ErrorScreen'
import { NotAuthorizedScreen } from '@/components/NotAuthorizedScreen'
import { AddAppModal } from '@/components/AddAppModal'
import { GroupManager } from '@/components/GroupManager'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  const [tab, setTab] = useState<'apps' | 'groups'>('apps')

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

  useEffect(() => {
    if (!authLoading) fetchApps()
  }, [authLoading, fetchApps])

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Supprimer l'application "${name}" ?`)) return
    try {
      await api.admin.deleteApp(id)
      toast.success(`"${name}" supprimée`)
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
    const { id: _, ...patch } = data
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
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} aria-label="Retour au portail">
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-[28px] font-extrabold font-heading leading-tight text-isb-brown">
                Administration
              </h1>
              <p className="text-[15px] mt-1.5 text-isb-muted">
                {tab === 'apps' ? "Gestion des applications" : "Gestion des groupes d'accès"}
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
          <Button
            variant={tab === 'apps' ? 'default' : 'ghost'}
            onClick={() => setTab('apps')}
          >
            Applications
          </Button>
          <Button
            variant={tab === 'groups' ? 'default' : 'ghost'}
            onClick={() => setTab('groups')}
          >
            Groupes
          </Button>
        </div>

        {tab === 'groups' ? (
          <GroupManager />
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
            <p className="text-[16px] font-semibold text-isb-brown">
              Aucune application
            </p>
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
                      <div className="text-[14px] font-medium text-isb-brown">
                        {app.name}
                      </div>
                      <div className="text-[12px] text-isb-muted">
                        {app.id}
                      </div>
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
                        onClick={() => handleDelete(app.id, app.name)}
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
