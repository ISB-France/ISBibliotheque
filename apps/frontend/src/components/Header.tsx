import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { Search, Bell, ChevronDown, User, Settings, HelpCircle, LogOut, Shield } from 'lucide-react'
import { ISBLogo } from './ISBLogo'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

function isImageUrl(str: string): boolean {
  return str.startsWith('/uploads/') || str.startsWith('http')
}

interface HeaderProps {
  search?: string
  onSearchChange?: (value: string) => void
}

export function Header({ search, onSearchChange }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarIcon, setAvatarIcon] = useState('')
  const isAdmin = user?.isAdmin ?? false
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??'
  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!user) return
    api.auth
      .profile()
      .then((p) => {
        if (isImageUrl(p.icon)) setAvatarUrl(p.icon)
        else if (p.icon) setAvatarIcon(p.icon)
      })
      .catch(() => {})
  }, [user])

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        backgroundColor: 'rgba(253,250,245,0.96)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(59,40,0,0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 shrink-0 cursor-pointer"
        >
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
        </button>

        <div className="h-6 w-px shrink-0" style={{ backgroundColor: 'rgba(59,40,0,0.1)' }} />

        {isHome && onSearchChange && (
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-isb-muted"
            />
            <Input
              type="text"
              placeholder="Rechercher une application…"
              value={search ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-isb-sand-light border-0 text-[13px]"
              aria-label="Rechercher une application"
            />
          </div>
        )}

        <div className="flex-1" />

        {isAdmin && (
          <Button
            variant={location.pathname === '/admin' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate('/admin')}
          >
            <Shield size={15} />
            Administration
          </Button>
        )}

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell size={18} />
        </Button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-accent transition-colors"
            aria-haspopup="true"
            aria-expanded={userMenuOpen}
          >
            <Avatar className="w-7 h-7 rounded-lg">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-[12px] font-bold rounded-lg">
                  {avatarIcon || initials}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-[13px] font-medium text-isb-brown">
              {user?.name ?? 'Utilisateur'}
            </span>
            <ChevronDown
              size={14}
              className="text-isb-muted transition-transform duration-200"
              style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)' }}
            />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-card rounded-2xl border shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b">
                  <div className="text-[13px] font-semibold text-isb-brown">{user?.name}</div>
                  <div className="text-[12px] text-isb-muted">{user?.email}</div>
                </div>
                {[
                  { icon: User, label: 'Mon profil', onClick: () => navigate('/profile') },
                  { icon: Settings, label: 'Préférences', onClick: () => navigate('/preferences') },
                  { icon: HelpCircle, label: 'Aide & support', onClick: () => navigate('/help') },
                ].map(({ icon: Icon, label, onClick }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    onClick={onClick}
                    className="w-full justify-start gap-3 px-4 py-2.5 h-auto rounded-none text-[13px]"
                  >
                    <Icon size={15} className="text-isb-muted" />
                    {label}
                  </Button>
                ))}
                <Separator />
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="w-full justify-start gap-3 px-4 py-2.5 h-auto rounded-none text-[13px] text-isb-coral hover:text-isb-coral"
                >
                  <LogOut size={15} />
                  Se déconnecter
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
