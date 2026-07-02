import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Mail, Shield, User as UserIcon, Save, X, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { ISBLogo } from '@/components/ISBLogo'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { api, type UserProfile } from '@/lib/api'

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

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showIcons, setShowIcons] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    if (!user) return
    api.auth
      .profile()
      .then((p) => {
        setProfile(p)
        setName(p.name)
        setIcon(p.icon)
      })
      .catch(() => {
        toast.error('Erreur chargement profil')
      })
      .finally(() => {
        setLoadingProfile(false)
      })
  }, [user])

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    try {
      const result = await api.auth.updateProfile({ name: name.trim(), icon })
      setProfile(result.profile)
      setEditing(false)
      setShowIcons(false)
      toast.success('Profil mis à jour')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setEditing(false)
    setShowIcons(false)
    if (profile) {
      setName(profile.name)
      setIcon(profile.icon)
    }
  }

  async function handleAvatarUpload(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image trop volumineuse (max 2 Mo)')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const res = await fetch('/api/auth/profile/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error?.message ?? 'Échec upload')
      }
      const data = await res.json()
      setIcon(data.url)
      setProfile((prev) => (prev ? { ...prev, icon: data.url } : prev))
      toast.success('Avatar mis à jour')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur upload')
    } finally {
      setUploading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    handleAvatarUpload(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??'

  return (
    <div style={{ backgroundColor: 'hsl(var(--background))' }}>
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'rgba(253,250,245,0.96)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(59,40,0,0.08)',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <ISBLogo size={36} />
          <div className="text-left">
            <div
              className="text-[16px] font-bold leading-tight font-heading"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              ISBibliotheque
            </div>
            <div
              className="text-[11px] leading-tight mt-0.5"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              Bibliotheque d&apos;application
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Retour">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-[28px] font-extrabold font-heading leading-tight text-isb-brown">
              Mon profil
            </h1>
            <p className="text-[15px] mt-1.5 text-isb-muted">Informations de votre compte</p>
          </div>
        </div>

        <Card>
          <div className="p-6 flex items-center gap-5 border-b">
            <div className="relative group">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[24px] bg-primary text-primary-foreground font-bold overflow-hidden">
                {icon && isImageUrl(icon) ? (
                  <img src={icon} alt="" className="w-full h-full object-cover" onError={() => { if (icon !== initials) setIcon(''); }} />
                ) : (
                  icon || initials
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform disabled:opacity-50"
                title="Changer la photo"
              >
                {uploading ? (
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={12} />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-[18px] font-bold font-heading"
                  autoFocus
                />
              ) : (
                <div className="text-[18px] font-bold font-heading text-isb-brown truncate">
                  {profile?.name ?? '...'}
                </div>
              )}
              <div className="text-[13px] mt-0.5 text-isb-muted">{user?.email}</div>
            </div>

            {!editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                disabled={loadingProfile}
              >
                Modifier
              </Button>
            )}
          </div>

          {editing && (
            <div className="px-6 py-4 border-b flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowIcons(!showIcons)}
              >
                {isImageUrl(icon) ? '🖼️ Image' : icon ? `Icône : ${icon}` : 'Choisir une icône'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Camera size={14} />
                {uploading ? 'Upload...' : 'Photo'}
              </Button>
            </div>
          )}

          {editing && showIcons && (
            <div className="px-6 py-4 border-b">
              <p className="text-[12px] font-medium text-isb-muted mb-3">Choisir une icône</p>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setIcon(emoji)
                      setShowIcons(false)
                    }}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-[18px] transition-all hover:bg-accent ${
                      icon === emoji ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-4 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-secondary">
                <Mail size={18} className="text-isb-muted" />
              </div>
              <div>
                <div className="text-[12px] font-medium text-isb-muted">Adresse email</div>
                <div className="text-[14px] font-semibold text-isb-brown">{user?.email}</div>
              </div>
            </div>

            {user?.isAdmin && (
              <div className="flex items-center gap-4 px-4 py-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-secondary">
                  <Shield size={18} className="text-isb-muted" />
                </div>
                <div>
                  <div className="text-[12px] font-medium text-isb-muted">Rôle</div>
                  <div className="text-[14px] font-semibold text-isb-brown">Administrateur</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-secondary">
                <UserIcon size={18} className="text-isb-muted" />
              </div>
              <div>
                <div className="text-[12px] font-medium text-isb-muted">Méthode de connexion</div>
                <div className="text-[14px] font-semibold text-isb-brown">Microsoft Entra ID</div>
              </div>
            </div>
          </div>

          {editing && (
            <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={handleCancel}>
                <X size={15} />
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving || !name.trim()}>
                <Save size={15} />
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
