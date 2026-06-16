import { useState } from 'react'
import { X, Plus, Code } from 'lucide-react'

const TEMPLATE = `{
  "$schema": "../../schemas/app-manifest.json",
  "id": "mon-application",
  "name": "Mon application",
  "description": "Description de l'application",
  "category": "Gestion",
  "icon": "LayoutGrid",
  "access": {
    "type": "redirect",
    "url": "https://"
  },
  "roles": ["admin"]
}`

interface AddAppModalProps {
  onClose: () => void
  onAdd: (json: string) => Promise<void>
}

export function AddAppModal({ onClose, onAdd }: AddAppModalProps) {
  const [json, setJson] = useState(TEMPLATE)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(json)
    } catch {
      setError('JSON invalide. Vérifiez la syntaxe.')
      return
    }

    if (name.trim()) {
      parsed.id = name.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/\s+/g, '-') || parsed.id
      parsed.name = name.trim()
    }

    if (!parsed.id || typeof parsed.id !== 'string') {
      setError('Le champ "id" est requis dans le JSON.')
      return
    }
    if (!parsed.name || typeof parsed.name !== 'string') {
      setError('Le champ "name" est requis dans le JSON.')
      return
    }

    setSubmitting(true)
    try {
      await onAdd(JSON.stringify(parsed, null, 2))
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#3B2800]/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold font-heading" style={{ color: '#3B2800' }}>
              Ajouter une application
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: '#8C6A40' }}>
              Définir le manifest JSON de l&rsquo;application
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-[#FEEAD3] transition-colors"
            aria-label="Fermer"
          >
            <X size={18} color="#8C6A40" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-semibold block mb-1.5" style={{ color: '#3B2800' }}>
              Nom (optionnel &mdash; surcharge &laquo; name &raquo; et &laquo; id &raquo; du JSON)
            </label>
            <input
              type="text"
              placeholder="Ex : Mon application"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-[14px]"
              style={{
                borderColor: 'rgba(59,40,0,0.15)',
                backgroundColor: '#FDFAF5',
                color: '#3B2800',
              }}
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold block mb-1.5" style={{ color: '#3B2800' }}>
              Manifest JSON
            </label>
            <div
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: 'rgba(59,40,0,0.15)' }}
            >
              <div
                className="flex items-center gap-2 px-4 py-2 border-b text-[12px] font-medium"
                style={{ backgroundColor: '#FDFAF5', borderColor: 'rgba(59,40,0,0.08)', color: '#8C6A40' }}
              >
                <Code size={14} />
                metadata.json
              </div>
              <textarea
                value={json}
                onChange={(e) => { setJson(e.target.value); setError(null) }}
                className="w-full px-4 py-3 outline-none text-[13px] font-mono leading-relaxed resize-y min-h-[300px]"
                style={{ backgroundColor: '#FFFFFF', color: '#3B2800' }}
                spellCheck={false}
              />
            </div>
          </div>

          {error && (
            <p className="text-[13px] font-medium" style={{ color: '#F08159' }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border transition-colors text-[14px] font-medium"
              style={{ borderColor: 'rgba(59,40,0,0.15)', color: '#8C6A40' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 hover:brightness-95 transition-all text-[14px] font-semibold disabled:opacity-50"
              style={{ backgroundColor: '#FFDD00', color: '#3B2800' }}
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-isb-brown border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Créer l&rsquo;application
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
