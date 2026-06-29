import { LockKeyhole, ArrowLeft } from 'lucide-react'
import { ISBLogo } from './ISBLogo'

interface NotAuthorizedScreenProps {
  userName?: string
  onBack?: () => void
}

export function NotAuthorizedScreen({
  userName = 'Utilisateur',
  onBack,
}: NotAuthorizedScreenProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
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
            <LockKeyhole size={36} style={{ color: 'hsl(var(--destructive))' }} strokeWidth={1.5} />
          </div>
          <div className="text-center max-w-md">
            <h1
              className="text-[22px] font-bold font-heading"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              Accès non autorisé
            </h1>
            <p
              className="text-[14px] mt-2 leading-relaxed"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              <span style={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}>{userName}</span>,
              vous ne disposez pas des droits n&eacute;cessaires pour acc&eacute;der &agrave; cette
              section du portail.
            </p>
            <p className="text-[13px] mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Contactez votre administrateur ISB si vous pensez qu{"'"}il s{"'"}agit d{"'"}une
              erreur.
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-[#FEEAD3] active:scale-95 transition-all font-heading font-semibold text-[14px]"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              Retour au portail
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
