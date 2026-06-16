import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import { randomBytes } from 'node:crypto'

const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'))

function getCommitHash(): string {
  try {
    return execSync('git rev-parse --short HEAD', {
      encoding: 'utf-8',
      timeout: 3000,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return 'unknown'
  }
}

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  name: pkg.name,
  version: pkg.version,
  commit: getCommitHash(),
  logLevel: process.env.LOG_LEVEL ?? 'info',

  jwtSecret: process.env.JWT_SECRET ?? randomBytes(32).toString('hex'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '24h',

  authAdminEmail: process.env.AUTH_ADMIN_EMAIL ?? 'admin@isb-group.fr',
  authAdminPassword: process.env.AUTH_ADMIN_PASSWORD ?? 'admin',
  authAdminName: process.env.AUTH_ADMIN_NAME ?? 'Admin SI',

  corsOrigin:
    process.env.CORS_ORIGIN ??
    (process.env.NODE_ENV === 'production' ? 'https://portail.isb-group.fr' : '*'),

  appUrl: process.env.APP_URL ?? 'http://localhost:5173',

  oidcIssuer: process.env.OIDC_ISSUER ?? '',
  oidcClientId: process.env.OIDC_CLIENT_ID ?? '',
  oidcClientSecret: process.env.OIDC_CLIENT_SECRET ?? '',
  oidcRedirectUri:
    process.env.OIDC_REDIRECT_URI ??
    `http://localhost:${process.env.PORT ?? 4000}/api/auth/callback`,
}
