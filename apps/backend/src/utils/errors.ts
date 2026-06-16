export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Ressource') {
    super(404, `${resource} introuvable`)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown) {
    super(400, 'Données invalides', details)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Non autorisé') {
    super(401, message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Accès refusé') {
    super(403, message)
    this.name = 'ForbiddenError'
  }
}
