import { AlertTriangle, RefreshCw, type LucideIcon } from 'lucide-react'
import { ISBLogo } from './ISBLogo'

interface ErrorScreenProps {
  code?: string
  icon?: LucideIcon
  title?: string
  message?: string
  retryLabel?: string
  onRetry?: () => void
}

export function ErrorScreen({
  code,
  icon: Icon = AlertTriangle,
  title = 'Une erreur est survenue',
  message = "Une erreur inattendue s'est produite. Veuillez réessayer.",
  retryLabel = 'Réessayer',
  onRetry,
}: ErrorScreenProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'hsl(var(--card) / 0.96)',
          backdropFilter: 'blur(12px)',
          borderColor: 'hsl(var(--border))',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <ISBLogo size={36} />
            <div>
              <div
                className="text-[16px] font-bold leading-tight font-heading"
                style={{ color: 'hsl(var(--foreground))' }}
              >
                ISBibliotheque
              </div>
              <div
                className="text-[11px] leading-tight mt-0.5"
                style={{ color: 'hsl(var(--muted-foreground))' }}
              >
                Bibliotheque d&apos;application
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'hsl(var(--accent))' }}
          >
            <Icon size={36} style={{ color: 'hsl(var(--destructive))' }} strokeWidth={1.5} />
          </div>

          {code && (
            <span
              className="text-[11px] font-bold font-heading uppercase tracking-wider px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'hsl(var(--secondary))',
                color: 'hsl(var(--secondary-foreground))',
              }}
            >
              {code}
            </span>
          )}

          <div className="text-center max-w-md">
            <h1
              className="text-[22px] font-bold font-heading"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              {title}
            </h1>
            <p
              className="text-[14px] mt-2 leading-relaxed"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              {message}
            </p>
          </div>

          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-3 rounded-xl hover:brightness-95 active:scale-95 transition-all shadow-sm font-heading font-bold text-[14px]"
              style={{
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
              }}
            >
              <RefreshCw size={16} strokeWidth={2.5} />
              {retryLabel}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
