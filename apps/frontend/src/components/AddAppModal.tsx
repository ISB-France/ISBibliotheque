import { useEffect, useState } from 'react'
import { X, Plus } from 'lucide-react'
import type { AppResponse } from '@/lib/api'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddAppModalProps {
  app?: AppResponse
  onClose: () => void
  onAdd: (json: string) => Promise<void>
}

export function AddAppModal({ app, onClose, onAdd }: AddAppModalProps) {
  const isEdit = !!app
  const [name, setName] = useState(app?.name ?? '')
  const [description, setDescription] = useState(app?.description ?? '')
  const [category, setCategory] = useState(app?.category ?? '')
  const [accessType, setAccessType] = useState<'redirect' | 'docker'>(app?.accessType ?? 'redirect')
  const [url, setUrl] = useState(app?.url ?? '')
  const [categories, setCategories] = useState<string[]>([])
  const [groups, setGroups] = useState<Array<{ name: string; description: string }>>([])
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set(app?.roles ?? []))
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([api.apps.categories(), api.groups.list()])
      .then(([cats, grps]) => {
        setCategories(cats)
        setGroups(grps)
      })
      .catch(() => {})
  }, [])

  function toggleGroup(name: string) {
    setSelectedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Le nom est requis.')
      return
    }
    if (!category) {
      setError('La catégorie est requise.')
      return
    }

    const roles = Array.from(selectedGroups)
    const rolesField = roles.length > 0 ? { roles } : { roles: [] }

    const redirectUrl = url.trim()
    const validUrl = redirectUrl && redirectUrl !== 'https://'

    if (isEdit) {
      const patch: Record<string, unknown> = {
        name: name.trim(),
        description: description.trim(),
        category,
        ...rolesField,
      }
      if (accessType === 'redirect' && validUrl) {
        patch.access = { type: 'redirect' as const, url: redirectUrl }
      }
      setSubmitting(true)
      try {
        await onAdd(JSON.stringify(patch, null, 2))
        onClose()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la modification')
      } finally {
        setSubmitting(false)
      }
      return
    }

    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/\s+/g, '-')

    const access =
      accessType === 'redirect'
        ? { type: 'redirect' as const, url: validUrl ? redirectUrl : 'https://placeholder.com' }
        : {
            type: 'docker' as const,
            composeFile: 'docker-compose.yml',
            serviceName: 'app',
            internalPort: 8080,
          }

    const manifest = {
      id,
      name: name.trim(),
      description: description.trim(),
      category,
      icon: 'LayoutGrid',
      access,
      ...rolesField,
    }

    setSubmitting(true)
    try {
      await onAdd(JSON.stringify(manifest, null, 2))
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la creation')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-isb-brown/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold font-heading text-isb-brown">
              {isEdit ? "Modifier l'application" : 'Ajouter une application'}
            </h2>
            <p className="text-[13px] mt-0.5 text-isb-muted">
              {isEdit
                ? 'Modifier les acces et la categorie'
                : 'Nouvelle application - ID genere automatiquement'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-semibold block mb-1.5 text-isb-brown">Nom</label>
            <Input
              placeholder="Mon application"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold block mb-1.5 text-isb-brown">
              Description
            </label>
            <Input
              placeholder="Description de l'application"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold block mb-1.5 text-isb-brown">
              Categorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-xl border bg-background text-[14px] text-foreground outline-none focus:ring-2 focus:ring-primary"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              <option value="">Selectionner une categorie</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[13px] font-semibold block mb-1.5 text-isb-brown">
              Type d&rsquo;acces
            </label>
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value as 'redirect' | 'docker')}
              className="w-full h-10 px-3 rounded-xl border bg-background text-[14px] text-foreground outline-none focus:ring-2 focus:ring-primary"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              <option value="redirect">Redirection (URL)</option>
              <option value="docker">Docker</option>
            </select>
          </div>

          {accessType === 'redirect' && (
            <div>
              <label className="text-[13px] font-semibold block mb-1.5 text-isb-brown">
                URL de redirection
              </label>
              <Input placeholder="https://" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          )}

          <div>
            <label className="text-[13px] font-semibold block mb-1.5 text-isb-brown">
              Groupes d&rsquo;acces
            </label>
            {groups.length === 0 ? (
              <p className="text-[13px] text-isb-muted">Aucun groupe disponible</p>
            ) : (
              <div
                className="flex flex-col gap-1.5 max-h-48 overflow-y-auto p-3 rounded-xl border"
                style={{ borderColor: 'hsl(var(--border))' }}
              >
                {groups.map((g) => (
                  <label
                    key={g.name}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors text-[14px]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroups.has(g.name)}
                      onChange={() => toggleGroup(g.name)}
                      className="accent-primary"
                    />
                    <span className="text-isb-brown font-medium">{g.name}</span>
                    {g.description && (
                      <span className="text-[12px] text-isb-muted ml-1">{g.description}</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-[13px] font-medium text-destructive">{error}</p>}

          <div className="flex gap-3 mt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {isEdit ? 'Enregistrer' : "Creer l'application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
