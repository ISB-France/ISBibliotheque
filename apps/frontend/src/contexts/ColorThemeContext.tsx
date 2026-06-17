import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react'

export interface ColorTheme {
  id: string
  label: string
  icon: string
  hue: number
}

const THEMES: ColorTheme[] = [
  { id: 'isb', label: 'ISB', icon: '🟤', hue: 36 },
  { id: 'blue', label: 'Bleu', icon: '🔵', hue: 220 },
  { id: 'green', label: 'Vert', icon: '🟢', hue: 142 },
  { id: 'purple', label: 'Violet', icon: '🟣', hue: 270 },
  { id: 'red', label: 'Rouge', icon: '🔴', hue: 0 },
  { id: 'teal', label: 'Teal', icon: '🩵', hue: 180 },
  { id: 'pink', label: 'Rose', icon: '🩷', hue: 330 },
]

const THEME_KEY = 'isb-color-theme'

function getStoredThemeId(): string {
  if (typeof window === 'undefined') return 'isb'
  return localStorage.getItem(THEME_KEY) ?? 'isb'
}

function applyTheme(hue: number) {
  const root = document.documentElement
  root.style.setProperty('--theme-hue', String(hue))

  const bgLight = 97
  const fgLight = 12
  const cardLight = 100
  const secLight = 93
  const mutLight = 88
  const mutFgLight = 48
  const accLight = 88
  const borderLight = 88
  const satPrimary = 100
  const satBg = 100
  const satSec = 100
  const satAcc = 16
  const satMut = 16
  const satMutFg = 18
  const satBorder = 100
  const priFgHue = 46
  const priFgSat = 100
  const priFgLight = 50

  const vars: Record<string, string> = {
    '--background': `${hue} ${satBg}% ${bgLight}%`,
    '--foreground': `${hue} ${satPrimary}% ${fgLight}%`,
    '--card': `0 0% ${cardLight}%`,
    '--card-foreground': `${hue} ${satPrimary}% ${fgLight}%`,
    '--popover': `0 0% ${cardLight}%`,
    '--popover-foreground': `${hue} ${satPrimary}% ${fgLight}%`,
    '--primary': `${hue} ${satPrimary}% ${fgLight}%`,
    '--primary-foreground': `${priFgHue} ${priFgSat}% ${priFgLight}%`,
    '--secondary': `${hue} ${satSec}% ${secLight}%`,
    '--secondary-foreground': `${hue} ${satPrimary}% ${fgLight}%`,
    '--muted': `${hue} ${satAcc}% ${mutLight}%`,
    '--muted-foreground': `${hue} ${satMutFg}% ${mutFgLight}%`,
    '--accent': `${hue} ${satAcc}% ${accLight}%`,
    '--accent-foreground': `${hue} ${satPrimary}% ${fgLight}%`,
    '--border': `${hue} ${satBorder}% ${borderLight}%`,
    '--input': `${hue} ${satBorder}% ${borderLight}%`,
    '--ring': `${hue} ${satPrimary}% ${fgLight}%`,
  }

  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
}

export interface ColorThemeContextValue {
  theme: ColorTheme
  themes: ColorTheme[]
  setTheme: (id: string) => void
}

const ColorThemeContext = createContext<ColorThemeContextValue | null>(null)

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ColorTheme>(() => {
    const id = getStoredThemeId()
    return THEMES.find((t) => t.id === id) ?? THEMES[0]
  })

  useEffect(() => {
    applyTheme(theme.hue)
  }, [theme])

  const setTheme = useCallback((id: string) => {
    const t = THEMES.find((t) => t.id === id)
    if (t) {
      setThemeState(t)
      localStorage.setItem(THEME_KEY, id)
    }
  }, [])

  return (
    <ColorThemeContext.Provider value={{ theme, themes: THEMES, setTheme }}>
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme(): ColorThemeContextValue {
  const ctx = useContext(ColorThemeContext)
  if (!ctx) throw new Error('useColorTheme must be used within ColorThemeProvider')
  return ctx
}
