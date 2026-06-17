import { useNavigate } from 'react-router'
import { ArrowLeft, ExternalLink, Mail, FileText, MessageCircle } from 'lucide-react'
import { ISBLogo } from '@/components/ISBLogo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const SUPPORT_ITEMS = [
  {
    icon: Mail,
    label: 'Contacter le support',
    description: 'Envoyez un email à notre équipe technique',
    action: 'mailto:support@isb-group.fr',
  },
  {
    icon: FileText,
    label: 'Documentation',
    description: 'Consultez les guides et la documentation technique',
    action: '#',
  },
  {
    icon: MessageCircle,
    label: 'Signalement',
    description: 'Signalez un problème ou proposez une amélioration',
    action: '#',
  },
]

export default function Help() {
  const navigate = useNavigate()

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
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <ISBLogo size={36} />
          <div className="text-left">
            <div className="text-[16px] font-bold leading-tight font-heading" style={{ color: '#3B2800' }}>
              ISBibliotheque
            </div>
            <div className="text-[11px] leading-tight mt-0.5" style={{ color: '#8C6A40' }}>
              Bibliotheque d&apos;application
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Retour">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-[28px] font-extrabold font-heading leading-tight text-isb-brown">
              Aide & support
            </h1>
            <p className="text-[15px] mt-1.5 text-isb-muted">
              Ressources pour vous accompagner
            </p>
          </div>
        </div>

        <Card>
          <div className="p-4 flex flex-col gap-2">
            {SUPPORT_ITEMS.map(({ icon: Icon, label, description, action }) => (
              <a
                key={label}
                href={action}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all hover:bg-accent"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-secondary">
                  <Icon size={18} className="text-isb-brown" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold text-isb-brown">
                    {label}
                  </div>
                  <div className="text-[12px] text-isb-muted">
                    {description}
                  </div>
                </div>
                <ExternalLink size={15} className="text-isb-muted" />
              </a>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}
