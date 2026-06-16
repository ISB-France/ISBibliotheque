import { useNavigate } from 'react-router'
import { ArrowLeft, ExternalLink, Mail, FileText, MessageCircle } from 'lucide-react'
import { ISBLogo } from '@/components/ISBLogo'

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
              ISB Group
            </div>
            <div className="text-[11px] leading-tight mt-0.5" style={{ color: '#8C6A40' }}>
              Portail applicatif
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#FEEAD3] transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft size={18} style={{ color: '#3B2800' }} />
          </button>
          <div>
            <h1 className="text-[28px] font-extrabold font-heading leading-tight" style={{ color: '#3B2800' }}>
              Aide & support
            </h1>
            <p className="text-[15px] mt-1.5" style={{ color: '#8C6A40' }}>
              Ressources pour vous accompagner
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(59,40,0,0.08)' }}>
          <div className="p-4 flex flex-col gap-2">
            {SUPPORT_ITEMS.map(({ icon: Icon, label, description, action }) => (
              <a
                key={label}
                href={action}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all hover:bg-[#FEEAD3]"
                style={{ borderColor: 'rgba(59,40,0,0.08)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FEEAD3' }}>
                  <Icon size={18} style={{ color: '#3B2800' }} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold" style={{ color: '#3B2800' }}>
                    {label}
                  </div>
                  <div className="text-[12px]" style={{ color: '#8C6A40' }}>
                    {description}
                  </div>
                </div>
                <ExternalLink size={15} style={{ color: '#8C6A40' }} />
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
