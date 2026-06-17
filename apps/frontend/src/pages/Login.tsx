import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ISBLogo } from '@/components/ISBLogo'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Login() {
  const { loginMicrosoft, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (searchParams.get('error') === 'auth_failed') {
      toast.error('Authentification Microsoft échouée')
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate])

  if (!authLoading && user) {
    navigate('/', { replace: true })
    return null
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setSubmitting(true)
    try {
      await api.auth.loginAdmin(email, password)
      toast.success('Connecté')
      window.location.href = '/'
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Échec de la connexion')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="flex items-center justify-center p-4 relative overflow-hidden flex-1"
      style={{ backgroundColor: 'hsl(var(--background))' }}
    >
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
        style={{ backgroundColor: 'hsl(var(--primary))' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10"
        style={{ backgroundColor: 'hsl(var(--muted-foreground))' }}
        aria-hidden="true"
      />

      <div className="w-full max-w-sm relative">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-5">
            <ISBLogo size={56} />
          </div>
          <h1 className="text-[26px] font-extrabold font-heading tracking-tight" style={{ color: 'hsl(var(--foreground))' }}>
            ISBibliotheque
          </h1>
          <p className="text-[14px] mt-1.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Bibliotheque d&apos;application ISB Group
          </p>
        </div>

        <div
          className="bg-white rounded-2xl shadow-sm border p-7"
          style={{ borderColor: 'rgba(59,40,0,0.08)' }}
        >
          <p className="text-[13px] text-center mb-6 leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Connectez-vous avec votre compte <span className="font-semibold" style={{ color: 'hsl(var(--foreground))' }}>ISB Group</span> pour accéder au catalogue d&apos;applications.
          </p>

          <button
            type="button"
            onClick={loginMicrosoft}
            disabled={authLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border-2 font-medium text-[14px] transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'rgba(59,40,0,0.15)',
              color: 'hsl(var(--foreground))',
            }}
          >
            {authLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 21 21" aria-hidden="true" className="shrink-0">
                <rect x="1" y="1" width="8.5" height="8.5" fill="#F25022" rx="1.5" />
                <rect x="11.5" y="1" width="8.5" height="8.5" fill="#7FBA00" rx="1.5" />
                <rect x="1" y="11.5" width="8.5" height="8.5" fill="#00A4EF" rx="1.5" />
                <rect x="11.5" y="11.5" width="8.5" height="8.5" fill="#FFB900" rx="1.5" />
              </svg>
            )}
            {authLoading ? 'Connexion en cours…' : 'Se connecter avec Microsoft'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t" style={{ borderColor: 'rgba(59,40,0,0.1)' }} />
            </div>
            <div className="relative flex justify-center text-xs uppercase text-isb-muted">
              <span className="bg-white px-2">Ou par email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="text-[14px]"
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-[14px]"
            />
            <Button type="submit" disabled={submitting} className="w-full mt-1">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              Se connecter
            </Button>
          </form>
        </div>

        <p className="text-[11px] text-center mt-8" style={{ color: 'rgba(140,106,64,0.5)' }}>
          Authentification sécurisée via Microsoft Entra ID
        </p>
      </div>
    </div>
  )
}
