import { useCallback, useEffect, useState, useRef } from 'react'
import { Plus, Trash2, UserPlus, RefreshCw, Pencil, Save, X, Search } from 'lucide-react'
import { toast } from 'sonner'
import { api, type UserProfile } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ConfirmDialog'

function isImageUrl(str: string): boolean {
  return str.startsWith('/uploads/') || str.startsWith('http')
}

const EMOJIS = [
  '👤',
  '👨',
  '👩',
  '🧑',
  '👨‍💻',
  '👩‍💻',
  '😀',
  '😎',
  '🤓',
  '🦊',
  '🐱',
  '🐶',
  '🌟',
  '🔥',
  '💡',
  '🎯',
  '🚀',
  '🌈',
  '🎨',
  '🎵',
  '📚',
  '⚡',
  '🌺',
  '🍀',
]

interface Group {
  name: string
  description: string
  members: string[]
}

export function GroupManager() {
  const [groups, setGroups] = useState<Group[]>([])
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newMembers, setNewMembers] = useState<Set<string>>(new Set())
  const [creating, setCreating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [groupsData, profilesData] = await Promise.all([
        api.admin.listGroups(),
        api.admin.listProfiles(),
      ])
      setGroups(groupsData)
      setProfiles(profilesData)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function toggleNewMember(email: string) {
    setNewMembers((prev) => {
      const next = new Set(prev)
      if (next.has(email)) next.delete(email)
      else next.add(email)
      return next
    })
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      await api.admin.createGroup({
        name: newName.trim(),
        description: newDesc.trim(),
        members: Array.from(newMembers),
      })
      toast.success(`Groupe "${newName}" créé`)
      setShowCreate(false)
      setNewName('')
      setNewDesc('')
      setNewMembers(new Set())
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(name: string) {
    try {
      await api.admin.deleteGroup(name)
      toast.success(`Groupe "${name}" supprimé`)
      setConfirmDelete(null)
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    }
  }

  async function handleAddMember(groupName: string, email: string, name?: string) {
    try {
      await api.admin.addGroupMember(groupName, email, name)
      toast.success(`${email} ajouté à ${groupName}`)
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    }
  }

  async function handleRemoveMember(groupName: string, email: string) {
    try {
      await api.admin.removeGroupMember(groupName, email)
      toast.success(`${email} retiré de ${groupName}`)
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    }
  }

  function getProfileForEmail(email: string): UserProfile | undefined {
    return profiles.find((p) => p.email === email)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-[15px] text-isb-muted">
          Gérez les groupes d&apos;utilisateurs et leurs accès
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData}>
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
            <h3 className="text-[16px] font-bold font-heading text-isb-brown">Nouveau groupe</h3>
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
            <div>
              <label className="text-[13px] font-semibold block mb-1.5 text-isb-brown">
                Membres
              </label>
              {profiles.length === 0 ? (
                <p className="text-[13px] text-isb-muted">Aucun profil disponible</p>
              ) : (
                <div
                  className="flex flex-col gap-1 max-h-40 overflow-y-auto p-3 rounded-xl border"
                  style={{ borderColor: 'hsl(var(--border))' }}
                >
                  {profiles.map((p) => (
                    <label
                      key={p.email}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors text-[14px]"
                    >
                      <input
                        type="checkbox"
                        checked={newMembers.has(p.email)}
                        onChange={() => toggleNewMember(p.email)}
                        className="accent-primary"
                      />
                      <span className="text-isb-brown font-medium">
                        {p.name || p.email.split('@')[0]}
                      </span>
                      <span className="text-[12px] text-isb-muted">{p.email}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
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
            <div key={i} className="h-24 bg-card rounded-2xl border animate-pulse" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-[16px] font-semibold text-isb-brown">Aucun groupe</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <GroupCard
              key={group.name}
              group={group}
              profiles={profiles}
              onDelete={() => setConfirmDelete(group.name)}
              onAddMember={(email, name) => handleAddMember(group.name, email, name)}
              onRemoveMember={(email) => handleRemoveMember(group.name, email)}
              getProfileForEmail={getProfileForEmail}
              onProfileUpdated={fetchData}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Supprimer le groupe"
        message={`Supprimer le groupe "${confirmDelete}" ? Cette action est irreversible.`}
        confirmLabel="Supprimer"
        onConfirm={() => handleDelete(confirmDelete!)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}

function GroupCard({
  group,
  profiles,
  onDelete,
  onAddMember,
  onRemoveMember,
  getProfileForEmail,
  onProfileUpdated,
}: {
  group: Group
  profiles: UserProfile[]
  onDelete: () => void
  onAddMember: (email: string, name?: string) => void
  onRemoveMember: (email: string) => void
  getProfileForEmail: (email: string) => UserProfile | undefined
  onProfileUpdated: () => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(group.name)
  const [editDesc, setEditDesc] = useState(group.description)
  const [savingGroup, setSavingGroup] = useState(false)
  const [confirmRemoveMember, setConfirmRemoveMember] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const availableProfiles = profiles.filter(
    (p) => !group.members.includes(p.email),
  )

  const filteredProfiles = search
    ? availableProfiles.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.email.toLowerCase().includes(search.toLowerCase()),
      )
    : availableProfiles

  function handleSelect(email: string) {
    onAddMember(email)
    setSearch('')
    setShowAdd(false)
    setShowDropdown(false)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setShowDropdown(true)
  }

  async function handleSaveGroup() {
    if (!editName.trim()) return
    setSavingGroup(true)
    try {
      await api.admin.updateGroup(group.name, {
        name: editName.trim() !== group.name ? editName.trim() : undefined,
        description: editDesc.trim() !== group.description ? editDesc.trim() : undefined,
      })
      toast.success(`Groupe mis à jour`)
      setEditing(false)
      onProfileUpdated()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSavingGroup(false)
    }
  }

  function handleCancelEdit() {
    setEditName(group.name)
    setEditDesc(group.description)
    setEditing(false)
  }

  return (
    <Card>
      <div className="px-6 py-4 flex items-center justify-between border-b">
        {editing ? (
          <div className="flex-1 flex flex-col gap-2 mr-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nom du groupe"
              className="text-[14px] font-bold font-heading"
            />
            <Input
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Description (optionnelle)"
              className="text-[13px]"
            />
          </div>
        ) : (
          <div>
            <div className="text-[16px] font-bold font-heading text-isb-brown">{group.name}</div>
            {group.description && (
              <div className="text-[13px] mt-0.5 text-isb-muted">{group.description}</div>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 shrink-0">
          {editing ? (
            <>
              <Button size="sm" onClick={handleSaveGroup} disabled={savingGroup}>
                <Save size={14} />
                {savingGroup ? '...' : 'Enregistrer'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                <X size={14} />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
                <UserPlus size={14} />
                Ajouter un membre
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
                <Pencil size={14} className="text-isb-muted" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 size={15} className="text-destructive" />
              </Button>
            </>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="px-6 py-3 border-b">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[13px] font-medium text-isb-brown">Ajouter un membre existant</span>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={() => { setShowAdd(false); setSearch(''); }}>
              <X size={14} />
            </Button>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-isb-muted" />
            <Input
              ref={inputRef}
              placeholder="Rechercher un utilisateur…"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="pl-8 text-[14px]"
              autoFocus
            />
            {showDropdown && filteredProfiles.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-popover border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredProfiles.map((p) => (
                  <button
                    key={p.email}
                    type="button"
                    onMouseDown={() => handleSelect(p.email)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[13px] hover:bg-accent transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center bg-secondary text-[12px] shrink-0">
                      {(() => {
                        const mIcon = p.icon
                        return mIcon && isImageUrl(mIcon) ? (
                          <img src={mIcon} alt="" className="w-full h-full object-cover rounded-md" />
                        ) : (
                          mIcon || p.name[0].toUpperCase()
                        )
                      })()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-isb-brown truncate">{p.name}</div>
                      <div className="text-[11px] text-isb-muted truncate">{p.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {showDropdown && search && filteredProfiles.length === 0 && (
              <p className="absolute left-0 right-0 top-full mt-1 z-50 bg-popover border rounded-xl p-3 text-[13px] text-isb-muted text-center">
                Aucun utilisateur trouvé
              </p>
            )}
          </div>
        </div>
      )}

      {group.members.length === 0 ? (
        <div className="px-6 py-6 text-center">
          <p className="text-[13px] text-isb-muted">Aucun membre dans ce groupe</p>
        </div>
      ) : (
        <div className="divide-y">
          {group.members.map((member) => (
            <div
              key={member}
              className="px-6 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-secondary text-[14px] overflow-hidden">
                  {(() => {
                    const mIcon = getProfileForEmail(member)?.icon
                    return mIcon && isImageUrl(mIcon) ? (
                      <img src={mIcon} alt="" className="w-full h-full object-cover" />
                    ) : (
                      mIcon || member[0].toUpperCase()
                    )
                  })()}
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-medium text-isb-brown truncate">
                    {getProfileForEmail(member)?.name || member.split('@')[0]}
                  </div>
                  <div className="text-[11px] text-isb-muted truncate">{member}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setConfirmRemoveMember(member)}
                >
                  <Trash2 size={13} className="text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmRemoveMember}
        title="Retirer un membre"
        message={`Retirer "${confirmRemoveMember}" de "${group.name}" ?`}
        confirmLabel="Retirer"
        onConfirm={() => {
          onRemoveMember(confirmRemoveMember!)
          setConfirmRemoveMember(null)
        }}
        onCancel={() => setConfirmRemoveMember(null)}
      />
    </Card>
  )
}


