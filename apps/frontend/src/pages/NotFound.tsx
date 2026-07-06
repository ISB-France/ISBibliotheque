import { useNavigate } from 'react-router'
import { Compass } from 'lucide-react'
import { ErrorScreen } from '@/components/ErrorScreen'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <ErrorScreen
      code="404"
      icon={Compass}
      title="Page introuvable"
      message="La page que vous recherchez n'existe pas ou a été déplacée."
      retryLabel="Retour à l'accueil"
      onRetry={() => navigate('/')}
    />
  )
}
