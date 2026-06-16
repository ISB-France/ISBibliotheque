import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Monitor, Moon, Sun } from 'lucide-react'
import { ISBLogo } from '@/components/ISBLogo'

const THEME_KEY = 'isb-theme'

function getStoredTheme(): 'system' | 'light' | 'dark' {
  if (typeof window === 'undefined') return 'system'
  return (localStorage.getItem(THEME_KEY) as 'system' | 'light' | 'dark') ?? 'system'
}

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(mode: 'system' | 'light' | 'dark') {
  const isDark = mode === 'dark' || (mode === 'system' && getSystemDark())
  document.documentElement.classList.toggle('dark', isDark)
}

const THEMES = [
  { value: 'system' as const, icon: Monitor, label: 'Système' },
  { value: 'light' as const, icon: Sun, label: 'Clair' },
  { value: 'dark' as const, icon: Moon, label: 'Sombre' },
]

export default function Preferences() {
  const navigate = useNavigate()
  const [theme, setThemeState] = useState(getStoredTheme())

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_KEY, theme)

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme('system')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

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
              Préférences
            </h1>
            <p className="text-[15px] mt-1.5" style={{ color: '#8C6A40' }}>
              Personnalisez votre expérience du portail
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border" style={{ borderColor: 'rgba(59,40,0,0.08)' }}>
          <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(59,40,0,0.08)' }}>
            <h2 className="text-[16px] font-bold font-heading" style={{ color: '#3B2800' }}>
              Thème
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: '#8C6A40' }}>
              Choisissez l&rsquo;apparence du portail
            </p>
          </div>

          <div className="p-4 flex flex-col gap-2">
            {THEMES.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setThemeState(value)}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all text-left"
                style={{
                  borderColor: theme === value ? '#FFDD00' : 'rgba(59,40,0,0.08)',
                  backgroundColor: theme === value ? '#FFFBEB' : '#FFFFFF',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: theme === value ? '#FFDD00' : '#FEEAD3',
                  }}
                >
                  <Icon size={18} style={{ color: theme === value ? '#3B2800' : '#8C6A40' }} />
                </div>
                <div>
                  <div className="text-[14px] font-semibold" style={{ color: '#3B2800' }}>
                    {label}
                  </div>
                  <div className="text-[12px]" style={{ color: '#8C6A40' }}>
                    {value === 'system'
                      ? 'Suivre la préférence de votre appareil'
                      : value === 'light'
                        ? 'Thème clair'
                        : 'Thème sombre'}
                  </div>
                </div>
                {theme === value && (
                  <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFDD00' }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3B2800' }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}