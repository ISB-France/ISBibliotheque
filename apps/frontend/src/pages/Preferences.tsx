import { useNavigate } from 'react-router'
import { ArrowLeft, Monitor, Moon, Sun, Palette } from 'lucide-react'
import { ISBLogo } from '@/components/ISBLogo'
import { useColorTheme } from '@/contexts/ColorThemeContext'

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
  const { theme: colorTheme, themes: colorThemes, setTheme: setColorTheme } = useColorTheme()
  const theme = getStoredTheme()

  function setThemeState(mode: 'system' | 'light' | 'dark') {
    applyTheme(mode)
    localStorage.setItem(THEME_KEY, mode)

    if (mode === 'dark') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme('dark')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'hsl(var(--background) / 0.96)',
          backdropFilter: 'blur(12px)',
          borderColor: 'hsl(var(--border))',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <ISBLogo size={36} />
          <div className="text-left">
            <div className="text-[16px] font-bold leading-tight font-heading" style={{ color: 'hsl(var(--foreground))' }}>
              ISBibliotheque
            </div>
            <div className="text-[11px] leading-tight mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Bibliotheque d&apos;application
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-accent transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft size={18} style={{ color: 'hsl(var(--foreground))' }} />
          </button>
          <div>
            <h1 className="text-[28px] font-extrabold font-heading leading-tight" style={{ color: 'hsl(var(--foreground))' }}>
              Préférences
            </h1>
            <p className="text-[15px] mt-1.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Personnalisez votre expérience du portail
            </p>
          </div>
        </div>

        {/* Thème clair/sombre */}
        <div className="bg-card rounded-2xl border mb-6" style={{ borderColor: 'hsl(var(--border))' }}>
          <div className="px-6 py-5 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
            <h2 className="text-[16px] font-bold font-heading" style={{ color: 'hsl(var(--foreground))' }}>
              Thème
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Choisissez l&apos;apparence du portail
            </p>
          </div>

          <div className="p-4 flex flex-col gap-2">
            {THEMES.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setThemeState(value)}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all text-left"
                style={{
                  borderColor: theme === value ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                  backgroundColor: theme === value ? 'hsl(var(--secondary))' : 'hsl(var(--card))',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: theme === value ? 'hsl(var(--primary))' : 'hsl(var(--accent))',
                  }}
                >
                  <Icon size={18} style={{ color: theme === value ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))' }} />
                </div>
                <div>
                  <div className="text-[14px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                    {label}
                  </div>
                  <div className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {value === 'system'
                      ? 'Suivre la préférence de votre appareil'
                      : value === 'light'
                        ? 'Thème clair'
                        : 'Thème sombre'}
                  </div>
                </div>
                {theme === value && (
                  <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--primary))' }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--primary-foreground))' }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Couleur d'accentuation */}
        <div className="bg-card rounded-2xl border" style={{ borderColor: 'hsl(var(--border))' }}>
          <div className="px-6 py-5 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="flex items-center gap-2">
              <Palette size={18} style={{ color: 'hsl(var(--muted-foreground))' }} />
              <h2 className="text-[16px] font-bold font-heading" style={{ color: 'hsl(var(--foreground))' }}>
                Couleur d&apos;accentuation
              </h2>
            </div>
            <p className="text-[13px] mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Personnalisez la couleur principale du portail
            </p>
          </div>

          <div className="p-4">
            <div className="flex flex-wrap gap-3">
              {colorThemes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setColorTheme(t.id)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all"
                  style={{
                    borderColor: colorTheme.id === t.id ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                    backgroundColor: colorTheme.id === t.id ? 'hsl(var(--secondary))' : 'transparent',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: `hsl(${t.hue} 100% 12%)`,
                    }}
                  >
                    {t.icon}
                  </div>
                  <span
                    className="text-[12px] font-medium"
                    style={{
                      color: colorTheme.id === t.id ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                    }}
                  >
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
