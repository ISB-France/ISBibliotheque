import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Trash2, RefreshCw, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { api, type AppResponse } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/Header'
import { LoadingScreen } from '@/components/LoadingScreen'
import { ErrorScreen } from '@/components/ErrorScreen'
import { NotAuthorizedScreen } from '@/components/NotAuthorizedScreen'
import { AddAppModal } from '@/components/AddAppModal'
import { GroupManager } from '@/components/GroupManager'

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [apps, setApps] = useState<AppResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
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
    <div className="min-h-screen" style={{ backgroundColor: '#FDFAF5' }}>
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#FEEAD3] transition-colors"
              aria-label="Retour au portail"
            >
              <ArrowLeft size={18} style={{ color: '#3B2800' }} />
            </button>
            <div>
              <h1
                className="text-[28px] font-extrabold font-heading leading-tight"
                style={{ color: '#3B2800' }}
              >
                Administration
              </h1>
              <p className="text-[15px] mt-1.5" style={{ color: '#8C6A40' }}>
                {tab === 'apps' ? "Gestion des applications du portail" : "Gestion des groupes d'accès"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-8">
          <button
            onClick={() => setTab('apps')}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors"
            style={{
              backgroundColor: tab === 'apps' ? '#3B2800' : 'transparent',
              color: tab === 'apps' ? '#FFDD00' : '#8C6A40',
            }}
          >
            Applications
          </button>
          <button
            onClick={() => setTab('groups')}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors"
            style={{
              backgroundColor: tab === 'groups' ? '#3B2800' : 'transparent',
              color: tab === 'groups' ? '#FFDD00' : '#8C6A40',
            }}
          >
            Groupes
          </button>
        </div>

        {tab === 'groups' ? (
          <GroupManager />
        ) : loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-white rounded-2xl border animate-pulse"
                style={{ borderColor: 'rgba(59,40,0,0.08)' }}
              />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[16px] font-semibold" style={{ color: '#3B2800' }}>
              Aucune application
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[14px]"
              style={{ backgroundColor: '#FFDD00', color: '#3B2800' }}
            >
              <Plus size={16} />
              Ajouter la première application
            </button>
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(59,40,0,0.08)' }}
          >
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(59,40,0,0.08)' }}>
                  <th
                    className="text-left px-6 py-4 text-[13px] font-semibold"
                    style={{ color: '#8C6A40' }}
                  >
                    Nom
                  </th>
                  <th
                    className="text-left px-6 py-4 text-[13px] font-semibold"
                    style={{ color: '#8C6A40' }}
                  >
                    Type
                  </th>
                  <th
                    className="text-left px-6 py-4 text-[13px] font-semibold"
                    style={{ color: '#8C6A40' }}
                  >
                    Catégorie
                  </th>
                  <th
                    className="text-right px-6 py-4 text-[13px] font-semibold"
                    style={{ color: '#8C6A40' }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b last:border-b-0 hover:bg-[#FDFAF5] transition-colors"
                    style={{ borderColor: 'rgba(59,40,0,0.08)' }}
                  >
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-medium" style={{ color: '#3B2800' }}>
                        {app.name}
                      </div>
                      <div className="text-[12px]" style={{ color: '#8C6A40' }}>
                        {app.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px]" style={{ color: '#8C6A40' }}>
                      <span
                        className="px-2 py-0.5 rounded-full text-[12px] font-medium"
                        style={{ backgroundColor: '#FEEAD3', color: '#8C6A40' }}
                      >
                        {app.accessType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px]" style={{ color: '#8C6A40' }}>
                      {app.category}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(app.id, app.name)}
                          className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-[#FEF0EA] transition-colors"
                          aria-label={`Supprimer ${app.name}`}
                        >
                          <Trash2 size={15} style={{ color: '#F08159' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showModal && <AddAppModal onClose={() => setShowModal(false)} onAdd={handleAddApp} />}
    </div>
  )
}
