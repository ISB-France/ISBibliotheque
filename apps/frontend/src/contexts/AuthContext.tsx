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
