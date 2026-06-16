import { BrowserRouter, Routes, Route } from 'react-router'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Admin from '@/pages/Admin'
import Preferences from '@/pages/Preferences'
import Profile from '@/pages/Profile'
import Help from '@/pages/Help'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              backgroundColor: '#3B2800',
              color: '#FFDD00',
              border: 'none',
              borderRadius: '1rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
