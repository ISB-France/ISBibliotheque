import { useState } from 'react'
import { useNavigate } from 'react-router'
import { LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { ISBLogo } from '@/components/ISBLogo'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Login() {
  const { login, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!authLoading && user) {
    navigate('/', { replace: true })
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setSubmitting(true)
    try {
      await login(email, password)
      toast.success('Connecté')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Échec de la connexion')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#FDFAF5' }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <ISBLogo size={48} />
          <h1 className="text-[24px] font-extrabold font-heading mt-4" style={{ color: '#3B2800' }}>
            ISB Group
          </h1>
          <p className="text-[14px] mt-1" style={{ color: '#8C6A40' }}>
            Portail applicatif interne
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col gap-4"
          style={{ borderColor: 'rgba(59,40,0,0.08)' }}
        >
          <div>
            <label className="text-[13px] font-semibold block mb-1.5 text-isb-brown">
              Adresse email
            </label>
            <Input
              type="email"
              placeholder="marie.laurent@isb-group.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-isb-bg"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold block mb-1.5 text-isb-brown">
              Mot de passe
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-isb-bg"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 font-heading font-bold"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn size={16} strokeWidth={2.5} />
            )}
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  )
}
