import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Mail, Shield, User as UserIcon, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { ISBLogo } from '@/components/ISBLogo'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { api } from '@/lib/api'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changing, setChanging] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFAF5' }}>
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
            <div className="text-[16px] font-bold leading-tight font-heading" style={{ color: '#3B2800' }}>
              ISB Group
            </div>
            <div className="text-[11px] leading-tight mt-0.5" style={{ color: '#8C6A40' }}>
              Portail applicatif
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
            <p className="text-[15px] mt-1.5 text-isb-muted">
              Informations de votre compte
            </p>
          </div>
        </div>

        <Card>
          <div className="p-6 flex items-center gap-5 border-b">
            <Avatar className="w-14 h-14 rounded-xl">
              <AvatarFallback className="bg-primary text-primary-foreground text-[20px] font-bold rounded-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-[18px] font-bold font-heading text-isb-brown">
                {user?.name}
              </div>
              <div className="text-[13px] mt-0.5 text-isb-muted">
                {user?.email}
              </div>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-4 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-secondary">
                <Mail size={18} className="text-isb-muted" />
              </div>
              <div>
                <div className="text-[12px] font-medium text-isb-muted">
                  Adresse email
                </div>
                <div className="text-[14px] font-semibold text-isb-brown">
                  {user?.email}
                </div>
              </div>
            </div>

            {user?.isAdmin && (
              <div className="flex items-center gap-4 px-4 py-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-secondary">
                  <Shield size={18} className="text-isb-muted" />
                </div>
                <div>
                  <div className="text-[12px] font-medium text-isb-muted">
                    Rôle
                  </div>
                  <div className="text-[14px] font-semibold text-isb-brown">
                    Administrateur
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-secondary">
                <UserIcon size={18} className="text-isb-muted" />
              </div>
              <div>
                <div className="text-[12px] font-medium text-isb-muted">
                  Méthode de connexion
                </div>
                <div className="text-[14px] font-semibold text-isb-brown">
                  Email & mot de passe
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mt-6">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold font-heading text-isb-brown">
                Mot de passe
              </h2>
              <p className="text-[13px] mt-0.5 text-isb-muted">
                Modifiez votre mot de passe de connexion
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowPasswordForm(!showPasswordForm)}>
              <Lock size={15} />
              Changer
            </Button>
          </div>

          {showPasswordForm && (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (newPassword !== confirmPassword) {
                  toast.error('Les nouveaux mots de passe ne correspondent pas')
                  return
                }
                setChanging(true)
                try {
                  await api.auth.changePassword(currentPassword, newPassword)
                  toast.success('Mot de passe modifié')
                  setShowPasswordForm(false)
                  setCurrentPassword('')
                  setNewPassword('')
                  setConfirmPassword('')
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : 'Erreur')
                } finally {
                  setChanging(false)
                }
              }}
              className="px-6 pb-6 flex flex-col gap-4"
            >
              <Input
                type="password"
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={4}
              />
              <Input
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={4}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={changing}>
                  {changing ? 'Modification...' : 'Enregistrer'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          )}
        </Card>
      </main>
    </div>
  )
}
