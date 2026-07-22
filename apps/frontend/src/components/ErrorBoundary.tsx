import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorScreen } from './ErrorScreen'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorScreen
          code="Erreur"
          title="Erreur inattendue"
          message="Une erreur est survenue lors de l'affichage de cette page. Rechargez la page, puis réessayez."
          retryLabel="Recharger la page"
          onRetry={() => window.location.reload()}
        />
      )
    }
    return this.props.children
  }
}
