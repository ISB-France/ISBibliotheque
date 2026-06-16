import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { Search, Bell, ChevronDown, User, Settings, HelpCircle, LogOut, Shield } from 'lucide-react'
import { ISBLogo } from './ISBLogo'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  search?: string
  onSearchChange?: (value: string) => void
}

export function Header({ search, onSearchChange }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
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
              style={{ color: '#3B2800' }}
            >
              ISB Group
            </div>
            <div className="text-[11px] leading-tight mt-0.5" style={{ color: '#8C6A40' }}>
              Portail applicatif
            </div>
          </div>
        </button>

        <div className="h-6 w-px shrink-0" style={{ backgroundColor: 'rgba(59,40,0,0.1)' }} />

        {isHome && onSearchChange && (
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: '#8C6A40' }}
            />
            <input
              type="text"
              placeholder="Rechercher une application…"
              value={search ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border outline-none transition-all text-[13px]"
              style={{
                backgroundColor: '#FEEAD3',
                borderColor: search ? '#FFDD00' : 'transparent',
                color: '#3B2800',
              }}
              aria-label="Rechercher une application"
            />
          </div>
        )}

        <div className="flex-1" />

        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-[13px] font-medium ${
              location.pathname === '/admin' ? 'bg-isb-brown text-isb-yellow' : 'hover:bg-[#FEEAD3]'
            }`}
            style={
              location.pathname === '/admin'
                ? { backgroundColor: '#3B2800', color: '#FFDD00' }
                : { color: '#3B2800' }
            }
          >
            <Shield size={15} />
            Administration
          </button>
        )}

        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-[#FEEAD3] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} style={{ color: '#3B2800' }} />
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FEEAD3] transition-colors"
            aria-haspopup="true"
            aria-expanded={userMenuOpen}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#3B2800' }}
            >
              <span className="text-[12px] font-bold" style={{ color: '#FFDD00' }}>
                {initials}
              </span>
            </div>
            <span className="text-[13px] font-medium" style={{ color: '#3B2800' }}>
              {user?.name ?? 'Utilisateur'}
            </span>
            <ChevronDown
              size={14}
              style={{
                color: '#8C6A40',
                transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl border shadow-lg py-2 z-50"
                style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(59,40,0,0.08)' }}
              >
                <div className="px-4 py-2 border-b" style={{ borderColor: 'rgba(59,40,0,0.08)' }}>
                  <div className="text-[13px] font-semibold" style={{ color: '#3B2800' }}>
                    {user?.name}
                  </div>
                  <div className="text-[12px]" style={{ color: '#8C6A40' }}>
                    {user?.email}
                  </div>
                </div>
                {[
                  { icon: User, label: 'Mon profil' },
                  { icon: Settings, label: 'Préférences', onClick: () => navigate('/preferences') },
                  { icon: HelpCircle, label: 'Aide & support' },
                ].map(({ icon: Icon, label, onClick }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FEEAD3] transition-colors text-left"
                  >
                    <Icon size={15} style={{ color: '#8C6A40' }} />
                    <span className="text-[13px]" style={{ color: '#3B2800' }}>
                      {label}
                    </span>
                  </button>
                ))}
                <div className="border-t my-1" style={{ borderColor: 'rgba(59,40,0,0.08)' }} />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FEF0EA] transition-colors text-left"
                >
                  <LogOut size={15} style={{ color: '#F08159' }} />
                  <span className="text-[13px]" style={{ color: '#F08159' }}>
                    Se déconnecter
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
