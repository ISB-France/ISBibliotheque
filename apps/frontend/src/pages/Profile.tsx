import { useNavigate } from 'react-router'
import { ArrowLeft, Mail, Shield, User as UserIcon } from 'lucide-react'
import { ISBLogo } from '@/components/ISBLogo'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()

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
      </main>
    </div>
  )
}
