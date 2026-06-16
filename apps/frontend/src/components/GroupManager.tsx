import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2, UserPlus, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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
        <p className="text-[15px] text-isb-muted">
          Gérez les groupes d&apos;utilisateurs et leurs accès
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchGroups}>
            <RefreshCw size={15} />
            Actualiser
          </Button>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus size={16} />
            Nouveau groupe
          </Button>
        </div>
      </div>

      {showCreate && (
        <Card className="p-6 mb-6">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <h3 className="text-[16px] font-bold font-heading text-isb-brown">
              Nouveau groupe
            </h3>
            <Input
              placeholder="Nom du groupe (ex: logistics.viewer)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <Input
              placeholder="Description (optionnelle)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
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

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-card rounded-2xl border animate-pulse"
            />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-[16px] font-semibold text-isb-brown">
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
    <Card>
      <div className="px-6 py-4 flex items-center justify-between border-b">
        <div>
          <div className="text-[16px] font-bold font-heading text-isb-brown">
            {group.name}
          </div>
          {group.description && (
            <div className="text-[13px] mt-0.5 text-isb-muted">
              {group.description}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
            <UserPlus size={14} />
            Ajouter un membre
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 size={15} className="text-destructive" />
          </Button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="px-6 py-3 border-b flex gap-2">
          <Input
            type="email"
            placeholder="email@isb-group.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <Button type="submit" size="sm">Ajouter</Button>
        </form>
      )}

      {group.members.length === 0 ? (
        <div className="px-6 py-6 text-center">
          <p className="text-[13px] text-isb-muted">
            Aucun membre dans ce groupe
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {group.members.map((member) => (
            <div
              key={member}
              className="px-6 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-secondary">
                  <span className="text-[11px] font-bold text-isb-muted">
                    {member[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-[14px] text-isb-brown">
                  {member}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onRemoveMember(member)}>
                <Trash2 size={13} className="text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
