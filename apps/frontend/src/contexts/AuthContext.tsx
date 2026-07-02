import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import { api, type AuthUser } from '@/lib/api'

export interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  error: string | null
  loginMicrosoft: () => void
  logout: () => Promise<void>
  retry: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const me = await api.auth.me()
      setUser(me)
    } catch (err) {
      if (err instanceof Error && err.message !== 'Unauthorized') {
        setError(err.message)
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  const loginMicrosoft = useCallback(() => {
    window.location.href = '/api/auth/login'
  }, [])

  const logout = useCallback(async () => {
    const result = await api.auth.logout()
    setUser(null)
    localStorage.removeItem('isb-color-theme')
    const root = document.documentElement
    root.style.setProperty('--primary', `36 100% 12%`)
    root.style.setProperty('--primary-foreground', `46 100% 50%`)
    root.style.setProperty('--background', `36 100% 97%`)
    root.style.setProperty('--foreground', `36 100% 12%`)
    root.style.setProperty('--card', `0 0% 100%`)
    root.style.setProperty('--card-foreground', `36 100% 12%`)
    root.style.setProperty('--popover', `0 0% 100%`)
    root.style.setProperty('--popover-foreground', `36 100% 12%`)
    root.style.setProperty('--secondary', `36 100% 93%`)
    root.style.setProperty('--secondary-foreground', `36 100% 12%`)
    root.style.setProperty('--muted', `36 16% 88%`)
    root.style.setProperty('--muted-foreground', `36 18% 48%`)
    root.style.setProperty('--accent', `36 16% 88%`)
    root.style.setProperty('--accent-foreground', `36 100% 12%`)
    root.style.setProperty('--destructive', `0 84% 60%`)
    root.style.setProperty('--destructive-foreground', `0 0% 100%`)
    root.style.setProperty('--border', `36 100% 88%`)
    root.style.setProperty('--input', `36 100% 88%`)
    root.style.setProperty('--ring', `36 100% 12%`)
    root.classList.remove('dark')
    if (result?.logoutUrl) {
      window.location.href = result.logoutUrl
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, loginMicrosoft, logout, retry: fetchMe }}>
      {children}
    </AuthContext.Provider>
  )
}
