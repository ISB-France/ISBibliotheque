import { createContext, useContext, useState, type ReactNode } from 'react'

export interface ColorTheme {
  id: string
  label: string
  icon: string
  hue: number
  dark: boolean
}

const THEMES: ColorTheme[] = [
  // ── Thèmes clairs ──
  { id: 'isb', label: 'ISB', icon: '🟤', hue: 36, dark: false },
  { id: 'blue', label: 'Bleu', icon: '🔵', hue: 220, dark: false },
  { id: 'green', label: 'Vert', icon: '🟢', hue: 142, dark: false },
  { id: 'purple', label: 'Violet', icon: '🟣', hue: 270, dark: false },
  { id: 'red', label: 'Rouge', icon: '🔴', hue: 0, dark: false },
  { id: 'teal', label: 'Teal', icon: '🩵', hue: 180, dark: false },
  { id: 'pink', label: 'Rose', icon: '🩷', hue: 330, dark: false },
  // ── Thèmes foncés ──
  { id: 'slate', label: 'Ardoise', icon: '🌑', hue: 220, dark: true },
  { id: 'midnight', label: 'Minuit', icon: '🌃', hue: 240, dark: true },
  { id: 'charcoal', label: 'Charbon', icon: '⚫', hue: 30, dark: true },
  { id: 'forest', label: 'Forêt', icon: '🌲', hue: 140, dark: true },
  { id: 'plum', label: 'Prune', icon: '🍇', hue: 280, dark: true },
  { id: 'navy', label: 'Marine', icon: '⚓', hue: 220, dark: true },
  { id: 'wine', label: 'Vin', icon: '🍷', hue: 350, dark: true },
]

const THEME_KEY = 'isb-color-theme'

function getStoredThemeId(): string {
  if (typeof window === 'undefined') return 'isb'
  return localStorage.getItem(THEME_KEY) ?? 'isb'
}

function applyTheme(hue: number, dark: boolean) {
  const root = document.documentElement
  const bgLight = dark ? 8 : 97
  const fgLight = dark ? 90 : 12
  const cardLight = dark ? 12 : 100
  const secLight = dark ? 16 : 93
  const mutLight = dark ? 16 : 88
  const mutFgLight = dark ? 60 : 48
  const accLight = dark ? 20 : 88
  const borderLight = dark ? 24 : 88
  const satPrimary = dark ? 60 : 100
  const satBg = dark ? 40 : 100
  const satSec = dark ? 40 : 100
  const satAcc = dark ? 30 : 16
  const satMut = dark ? 20 : 16
  const satMutFg = dark ? 30 : 18
  const satBorder = dark ? 30 : 100
  const priHue = dark ? hue : hue
  const priSat = dark ? 60 : 100
  const priLight = dark ? 70 : 12
  const priFgHue = dark ? hue : 46
  const priFgSat = dark ? 80 : 100
  const priFgLight = dark ? 20 : 50

  root.style.setProperty('--primary', `${priHue} ${priSat}% ${priLight}%`)
  root.style.setProperty('--primary-foreground', `${priFgHue} ${priFgSat}% ${priFgLight}%`)
  root.style.setProperty('--background', `${hue} ${satBg}% ${bgLight}%`)
  root.style.setProperty('--foreground', `${hue} ${satPrimary}% ${fgLight}%`)
  root.style.setProperty('--card', `0 0% ${cardLight}%`)
  root.style.setProperty('--card-foreground', `${hue} ${satPrimary}% ${fgLight}%`)
  root.style.setProperty('--popover', `0 0% ${cardLight}%`)
  root.style.setProperty('--popover-foreground', `${hue} ${satPrimary}% ${fgLight}%`)
  root.style.setProperty('--secondary', `${hue} ${satSec}% ${secLight}%`)
  root.style.setProperty('--secondary-foreground', `${hue} ${satPrimary}% ${fgLight}%`)
  root.style.setProperty('--muted', `${hue} ${satAcc}% ${mutLight}%`)
  root.style.setProperty('--muted-foreground', `${hue} ${satMutFg}% ${mutFgLight}%`)
  root.style.setProperty('--accent', `${hue} ${satAcc}% ${accLight}%`)
  root.style.setProperty('--accent-foreground', `${hue} ${satPrimary}% ${fgLight}%`)
  root.style.setProperty('--destructive', `0 84% 60%`)
  root.style.setProperty('--destructive-foreground', `0 0% 100%`)
  root.style.setProperty('--border', `${hue} ${satBorder}% ${borderLight}%`)
  root.style.setProperty('--input', `${hue} ${satBorder}% ${borderLight}%`)
  root.style.setProperty('--ring', `${priHue} ${priSat}% ${priLight}%`)

  root.classList.toggle('dark', dark)
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
    applyTheme(t.hue, t.dark)
    return t
  })

  function setTheme(id: string) {
    const t = THEMES.find((t) => t.id === id)
    if (t) {
      applyTheme(t.hue, t.dark)
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
