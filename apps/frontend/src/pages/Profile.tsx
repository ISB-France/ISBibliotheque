import { useNavigate } from 'react-router'
import { ArrowLeft, Mail, Shield, User as UserIcon } from 'lucide-react'
import { ISBLogo } from '@/components/ISBLogo'
import { useAuth } from '@/hooks/useAuth'

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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#FEEAD3] transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft size={18} style={{ color: '#3B2800' }} />
          </button>
          <div>
            <h1 className="text-[28px] font-extrabold font-heading leading-tight" style={{ color: '#3B2800' }}>
              Mon profil
            </h1>
            <p className="text-[15px] mt-1.5" style={{ color: '#8C6A40' }}>
              Informations de votre compte
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(59,40,0,0.08)' }}>
          <div className="p-6 flex items-center gap-5 border-b" style={{ borderColor: 'rgba(59,40,0,0.08)' }}>
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#3B2800' }}
            >
              <span className="text-[20px] font-bold" style={{ color: '#FFDD00' }}>
                {initials}
              </span>
            </div>
            <div>
              <div className="text-[18px] font-bold font-heading" style={{ color: '#3B2800' }}>
                {user?.name}
              </div>
              <div className="text-[13px] mt-0.5" style={{ color: '#8C6A40' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-4 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FEEAD3' }}>
                <Mail size={18} style={{ color: '#8C6A40' }} />
              </div>
              <div>
                <div className="text-[12px] font-medium" style={{ color: '#8C6A40' }}>
                  Adresse email
                </div>
                <div className="text-[14px] font-semibold" style={{ color: '#3B2800' }}>
                  {user?.email}
                </div>
              </div>
            </div>

            {user?.isAdmin && (
              <div className="flex items-center gap-4 px-4 py-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FEEAD3' }}>
                  <Shield size={18} style={{ color: '#8C6A40' }} />
                </div>
                <div>
                  <div className="text-[12px] font-medium" style={{ color: '#8C6A40' }}>
                    Rôle
                  </div>
                  <div className="text-[14px] font-semibold" style={{ color: '#3B2800' }}>
                    Administrateur
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FEEAD3' }}>
                <UserIcon size={18} style={{ color: '#8C6A40' }} />
              </div>
              <div>
                <div className="text-[12px] font-medium" style={{ color: '#8C6A40' }}>
                  Méthode de connexion
                </div>
                <div className="text-[14px] font-semibold" style={{ color: '#3B2800' }}>
                  Email & mot de passe
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
