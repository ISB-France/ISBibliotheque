import { BrowserRouter, Routes, Route } from 'react-router'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { ColorThemeProvider } from '@/contexts/ColorThemeContext'
import { Footer } from '@/components/Footer'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Admin from '@/pages/Admin'
import Preferences from '@/pages/Preferences'
import Profile from '@/pages/Profile'
import Help from '@/pages/Help'

export default function App() {
  return (
    <BrowserRouter>
      <ColorThemeProvider>
        <AuthProvider>
          <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'hsl(var(--background))' }}
          >
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/preferences" element={<Preferences />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/help" element={<Help />} />
              </Routes>
            </div>
            <Footer />
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
              },
            }}
          />
        </AuthProvider>
      </ColorThemeProvider>
    </BrowserRouter>
  )
}
