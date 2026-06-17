import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import * as Lucide from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { toast } from 'sonner'
import { api, type AppResponse } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/Header'
import { AppCard, getAppStyle } from '@/components/AppCard'
import { LoadingScreen } from '@/components/LoadingScreen'
import { ErrorScreen } from '@/components/ErrorScreen'

function getLucideIcon(name: string): LucideIcon {
  const icon = (Lucide as Record<string, unknown>)[name]
  if (typeof icon === 'function') return icon as LucideIcon
  return Lucide.LayoutGrid as LucideIcon
}

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [apps, setApps] = useState<AppResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [groups, setGroups] = useState<Array<{ name: string; description: string }>>([])
  const [launching, setLaunching] = useState<string | null>(null)

  const fetchApps = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [data, groupsData] = await Promise.all([
        api.apps.list(),
        api.groups.list(),
      ])
      setApps(data)
      setGroups(groupsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading) fetchApps()
  }, [authLoading, fetchApps])

  const filtered = apps.filter((app) => {
    const matchSearch =
      !search ||
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase()) ||
      app.category.toLowerCase().includes(search.toLowerCase())
    const matchGroup = !activeGroup || app.roles.length === 0 || app.roles.includes(activeGroup)
    return matchSearch && matchGroup
  })

  async function handleLaunch(app: AppResponse) {
    if (launching) return
    setLaunching(app.id)

    try {
      if (app.accessType === 'redirect' && app.url) {
        window.open(app.url, '_blank', 'noopener,noreferrer')
        toast.success(`${app.name} ouvert`)
        return
      }

      const { status } = await api.docker.start(app.id)
      if (status.status === 'running') {
        if (status.url) {
          window.open(status.url, '_blank', 'noopener,noreferrer')
        }
        toast.success(`${app.name} démarré`)
      } else {
        toast.error(status.message ?? 'Erreur au lancement')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur au lancement')
    } finally {
      setLaunching(null)
    }
  }

  if (authLoading) return <LoadingScreen />
  if (!user) {
    navigate('/login', { replace: true })
    return null
  }
  if (error) return <ErrorScreen message={error} onRetry={fetchApps} />

  return (
    <div style={{ backgroundColor: 'hsl(var(--background))' }}>
      <Header search={search} onSearchChange={setSearch} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
          <div>
            <h1
              className="text-[28px] font-extrabold font-heading leading-tight"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              ISBibliotheque
            </h1>
            <p className="text-[15px] mt-1.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Retrouvez et lancez toutes vos applications métier ISB
            </p>
          </div>


        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap" role="tablist" aria-label="Groupes">
          <button
            onClick={() => setActiveGroup(null)}
            role="tab"
            aria-selected={!activeGroup}
            className="px-4 py-2 rounded-xl transition-all text-[13px]"
            style={{
              fontWeight: !activeGroup ? 600 : 400,
              backgroundColor: !activeGroup ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
              color: !activeGroup ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
            }}
          >
            Tous
          </button>
          {groups.map((g) => (
            <button
              key={g.name}
              onClick={() => setActiveGroup(g.name)}
              role="tab"
              aria-selected={activeGroup === g.name}
              className="px-4 py-2 rounded-xl transition-all text-[13px]"
              style={{
                fontWeight: activeGroup === g.name ? 600 : 400,
                backgroundColor: activeGroup === g.name ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                color: activeGroup === g.name ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
              }}
            >
              {g.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-[rgba(59,40,0,0.08)] min-h-[180px]"
              >
                <div
                  className="w-14 h-14 rounded-xl animate-pulse"
                  style={{ backgroundColor: 'hsl(var(--secondary))' }}
                />
                <div
                  className="h-5 w-20 rounded-full animate-pulse"
                  style={{ backgroundColor: 'hsl(var(--secondary))' }}
                />
                <div
                  className="h-4 w-3/4 rounded-lg animate-pulse"
                  style={{ backgroundColor: 'hsl(var(--muted))' }}
                />
                <div
                  className="h-3 w-full rounded-lg animate-pulse"
                  style={{ backgroundColor: 'hsl(var(--secondary))' }}
                />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
          >
            {filtered.map((app) => {
              const style = getAppStyle(app.category)
              const Icon = getLucideIcon(app.icon)
              return (
                <AppCard
                  key={app.id}
                  name={app.name}
                  description={app.description}
                  icon={Icon}
                  color={style.color}
                  bgColor={style.bgColor}
                  category={app.category}
                  isLaunching={launching === app.id}
                  onClick={() => handleLaunch(app)}
                />
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: 'hsl(var(--secondary))' }}
            >
              <Search size={28} style={{ color: 'hsl(var(--muted-foreground))' }} />
            </div>
            <div className="text-center">
              <p className="text-[16px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                Aucune application trouvée
              </p>
              <p className="text-[14px] mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Essayez un autre terme ou une autre catégorie
              </p>
            </div>
            <button
              onClick={() => {
                setSearch('')
                setActiveGroup(null)
              }}
              className="px-4 py-2 rounded-xl transition-colors text-[13px] font-medium"
              style={{ backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))' }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>

    </div>
  )
}
