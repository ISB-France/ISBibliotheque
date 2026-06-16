import { AlertTriangle, RefreshCw } from 'lucide-react'
import { ISBLogo } from './ISBLogo'

interface ErrorScreenProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorScreen({
  title = 'Une erreur est survenue',
  message = "Le portail applicatif n'a pas pu charger la liste des applications. Veuillez réessayer.",
  onRetry,
}: ErrorScreenProps) {
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
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <ISBLogo size={36} />
            <div>
              <div
                className="text-[16px] font-bold leading-tight font-heading"
                style={{ color: '#3B2800' }}
              >
                ISB Group
              </div>
              <div className="text-[11px] leading-tight mt-0.5" style={{ color: '#8C6A40' }}>
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
            <h1 className="text-[22px] font-bold font-heading" style={{ color: '#3B2800' }}>
              {title}
            </h1>
            <p className="text-[14px] mt-2 leading-relaxed" style={{ color: '#8C6A40' }}>
              {message}
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-3 rounded-xl hover:brightness-95 active:scale-95 transition-all shadow-sm font-heading font-bold text-[14px]"
              style={{ backgroundColor: '#FFDD00', color: '#3B2800' }}
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
