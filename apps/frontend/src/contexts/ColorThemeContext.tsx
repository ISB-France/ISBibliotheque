import { createContext, useContext, useState, type ReactNode } from 'react'

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
  root.style.setProperty('--primary', `${hue} 100% 12%`)
  root.style.setProperty('--primary-foreground', `46 100% 50%`)
  root.style.setProperty('--background', `${hue} 100% 97%`)
  root.style.setProperty('--foreground', `${hue} 100% 12%`)
  root.style.setProperty('--secondary', `${hue} 100% 93%`)
  root.style.setProperty('--secondary-foreground', `${hue} 100% 12%`)
  root.style.setProperty('--muted', `${hue} 16% 88%`)
  root.style.setProperty('--muted-foreground', `${hue} 18% 48%`)
  root.style.setProperty('--accent', `${hue} 16% 88%`)
  root.style.setProperty('--accent-foreground', `${hue} 100% 12%`)
  root.style.setProperty('--border', `${hue} 100% 88%`)
  root.style.setProperty('--input', `${hue} 100% 88%`)
  root.style.setProperty('--ring', `${hue} 100% 12%`)
  root.style.setProperty('--card-foreground', `${hue} 100% 12%`)
  root.style.setProperty('--popover-foreground', `${hue} 100% 12%`)
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
    const t = THEMES.find((t) => t.id === id) ?? THEMES[0]
    applyTheme(t.hue)
    return t
  })

  function setTheme(id: string) {
    const t = THEMES.find((t) => t.id === id)
    if (t) {
      applyTheme(t.hue)
      setThemeState(t)
      localStorage.setItem(THEME_KEY, id)
    }
  }

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
