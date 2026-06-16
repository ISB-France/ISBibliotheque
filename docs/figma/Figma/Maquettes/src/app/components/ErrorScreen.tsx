import { AlertTriangle, RefreshCw } from 'lucide-react'
import { ISBLogo } from './ISBLogo'

interface ErrorScreenProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorScreen({
  title = 'Une erreur est survenue',
  message = 'Le portail applicatif n&rsquo;a pas pu charger la liste des applications. Veuillez réessayer.',
  onRetry,
}: ErrorScreenProps) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#FDFAF5', fontFamily: "'DM Sans', sans-serif" }}
    >
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'rgba(253,250,245,0.96)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(59,40,0,0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <ISBLogo size={36} />
            <div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#3B2800',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  lineHeight: 1,
                }}
              >
                ISB Group
              </div>
              <div style={{ fontSize: '11px', color: '#8C6A40', lineHeight: 1, marginTop: '2px' }}>
                Portail applicatif
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: '#FEF0EA' }}
          >
            <AlertTriangle size={36} style={{ color: '#F08159' }} strokeWidth={1.5} />
          </div>

          <div className="text-center max-w-md">
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '22px',
                fontWeight: 700,
                color: '#3B2800',
              }}
            >
              {title}
            </h1>
            <p style={{ fontSize: '14px', color: '#8C6A40', marginTop: '8px', lineHeight: 1.6 }}>
              {message}
            </p>
          </div>

          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-3 rounded-xl hover:brightness-95 active:scale-95 transition-all shadow-sm"
              style={{
                backgroundColor: '#FFDD00',
                color: '#3B2800',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <RefreshCw size={16} strokeWidth={2.5} />
              Réessayer
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
