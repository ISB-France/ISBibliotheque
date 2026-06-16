import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2, UserPlus, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'

interface Group {
  name: string
  description: string
  members: string[]
}

export function GroupManager() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.admin.listGroups()
      setGroups(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      await api.admin.createGroup({ name: newName.trim(), description: newDesc.trim() })
      toast.success(`Groupe "${newName}" créé`)
      setShowCreate(false)
      setNewName('')
      setNewDesc('')
      fetchGroups()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(name: string) {
    if (!window.confirm(`Supprimer le groupe "${name}" ?`)) return
    try {
      await api.admin.deleteGroup(name)
      toast.success(`Groupe "${name}" supprimé`)
      fetchGroups()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    }
  }

  async function handleAddMember(groupName: string, email: string) {
    try {
      await api.admin.addGroupMember(groupName, email)
      toast.success(`${email} ajouté à ${groupName}`)
      fetchGroups()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    }
  }

  async function handleRemoveMember(groupName: string, email: string) {
    if (!window.confirm(`Retirer ${email} de "${groupName}" ?`)) return
    try {
      await api.admin.removeGroupMember(groupName, email)
      toast.success(`${email} retiré de ${groupName}`)
      fetchGroups()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[15px]" style={{ color: '#8C6A40' }}>
            Gérez les groupes d&apos;utilisateurs et leurs accès
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchGroups}
            className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-[#FEEAD3] transition-colors text-[13px] font-medium"
            style={{ color: '#3B2800' }}
          >
            <RefreshCw size={15} />
            Actualiser
          </button>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl hover:brightness-95 active:scale-95 transition-all shadow-sm font-heading font-bold text-[14px]"
            style={{ backgroundColor: '#FFDD00', color: '#3B2800' }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Nouveau groupe
          </button>
        </div>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl border p-6 mb-6 flex flex-col gap-4"
          style={{ borderColor: 'rgba(59,40,0,0.08)' }}
        >
          <h3 className="text-[16px] font-bold font-heading" style={{ color: '#3B2800' }}>
            Nouveau groupe
          </h3>
          <input
            placeholder="Nom du groupe (ex: logistics.viewer)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-[14px]"
            style={{ borderColor: 'rgba(59,40,0,0.15)', backgroundColor: '#FDFAF5', color: '#3B2800' }}
            required
          />
          <input
            placeholder="Description (optionnelle)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-[14px]"
            style={{ borderColor: 'rgba(59,40,0,0.15)', backgroundColor: '#FDFAF5', color: '#3B2800' }}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-3 rounded-xl font-bold text-[14px] hover:brightness-95 active:scale-95 transition-all disabled:opacity-50"
              style={{ backgroundColor: '#FFDD00', color: '#3B2800' }}
            >
              {creating ? 'Création...' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-5 py-3 rounded-xl font-medium text-[14px] hover:bg-[#FEEAD3] transition-colors"
              style={{ color: '#3B2800' }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white rounded-2xl border animate-pulse"
              style={{ borderColor: 'rgba(59,40,0,0.08)' }}
            />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-[16px] font-semibold" style={{ color: '#3B2800' }}>
            Aucun groupe
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <GroupCard
              key={group.name}
              group={group}
              onDelete={() => handleDelete(group.name)}
              onAddMember={(email) => handleAddMember(group.name, email)}
              onRemoveMember={(email) => handleRemoveMember(group.name, email)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function GroupCard({
  group,
  onDelete,
  onAddMember,
  onRemoveMember,
}: {
  group: Group
  onDelete: () => void
  onAddMember: (email: string) => void
  onRemoveMember: (email: string) => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    onAddMember(email.trim())
    setEmail('')
    setShowAdd(false)
  }

  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(59,40,0,0.08)' }}>
      <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: 'rgba(59,40,0,0.08)' }}>
        <div>
          <div className="text-[16px] font-bold font-heading" style={{ color: '#3B2800' }}>
            {group.name}
          </div>
          {group.description && (
            <div className="text-[13px] mt-0.5" style={{ color: '#8C6A40' }}>
              {group.description}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-[#FEEAD3] transition-colors text-[12px] font-medium"
            style={{ color: '#3B2800' }}
          >
            <UserPlus size={14} />
            Ajouter un membre
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-[#FEF0EA] transition-colors"
          >
            <Trash2 size={15} style={{ color: '#F08159' }} />
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="px-6 py-3 border-b flex gap-2" style={{ borderColor: 'rgba(59,40,0,0.08)' }}>
          <input
            type="email"
            placeholder="email@isb-group.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border outline-none transition-all text-[13px]"
            style={{ borderColor: 'rgba(59,40,0,0.15)', backgroundColor: '#FDFAF5', color: '#3B2800' }}
            required
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl font-bold text-[12px] hover:brightness-95 transition-all"
            style={{ backgroundColor: '#FFDD00', color: '#3B2800' }}
          >
            Ajouter
          </button>
        </form>
      )}

      {group.members.length === 0 ? (
        <div className="px-6 py-6 text-center">
          <p className="text-[13px]" style={{ color: '#8C6A40' }}>
            Aucun membre dans ce groupe
          </p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'rgba(59,40,0,0.08)' }}>
          {group.members.map((member) => (
            <div
              key={member}
              className="px-6 py-3 flex items-center justify-between hover:bg-[#FDFAF5] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#FEEAD3' }}
                >
                  <span className="text-[11px] font-bold" style={{ color: '#8C6A40' }}>
                    {member[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-[14px]" style={{ color: '#3B2800' }}>
                  {member}
                </span>
              </div>
              <button
                onClick={() => onRemoveMember(member)}
                className="flex items-center justify-center w-8 h-8 rounded-xl hover:bg-[#FEF0EA] transition-colors"
              >
                <Trash2 size={13} style={{ color: '#F08159' }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
