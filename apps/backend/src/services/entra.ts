import {
  discovery,
  buildAuthorizationUrl,
  authorizationCodeGrant,
  buildEndSessionUrl,
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
  randomState,
  ClientSecretBasic,
  None,
  type Configuration,
} from 'openid-client'
import { config } from '../config/index.js'
import { createToken } from '../utils/jwt.js'
import { getRolesForEmail } from './groups.js'
import { logger } from '../utils/logger.js'
import type { AuthResult } from './auth.js'

interface Session {
  codeVerifier: string
  state: string
}

let _oidcConfig: Configuration | null = null
const sessions = new Map<string, Session>()

async function getConfig(): Promise<Configuration | null> {
  if (_oidcConfig) return _oidcConfig
  if (!config.oidcIssuer || !config.oidcClientId) return null

  try {
    const clientAuth = config.oidcClientSecret ? ClientSecretBasic(config.oidcClientSecret) : None()

    _oidcConfig = await discovery(
      new URL(config.oidcIssuer),
      config.oidcClientId,
      { redirect_uris: [config.oidcRedirectUri] },
      clientAuth,
    )
    return _oidcConfig
  } catch (err) {
    logger.error({ err }, 'Échec découverte OIDC')
    return null
  }
}

export async function getAuthorizationUrl(): Promise<string | null> {
  const oidcConfig = await getConfig()
  if (!oidcConfig) return null

  const codeVerifier = randomPKCECodeVerifier()
  const state = randomState()
  const codeChallenge = await calculatePKCECodeChallenge(codeVerifier)

  sessions.set(state, { codeVerifier, state })

  const url = buildAuthorizationUrl(oidcConfig, {
    redirect_uri: config.oidcRedirectUri,
    scope: 'openid profile email',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  })
  return String(url)
}

export async function handleCallback(params: Record<string, string>): Promise<AuthResult | null> {
  const oidcConfig = await getConfig()
  if (!oidcConfig) return null

  const state = params.state
  if (!state || !sessions.has(state)) {
    logger.warn({ state }, 'État OIDC inconnu ou manquant')
    return null
  }

  const session = sessions.get(state)!
  sessions.delete(state)

  try {
    const currentUrl = new URL(config.oidcRedirectUri)
    for (const [key, value] of Object.entries(params)) {
      currentUrl.searchParams.set(key, value)
    }

    const tokens = await authorizationCodeGrant(oidcConfig, currentUrl, {
      pkceCodeVerifier: session.codeVerifier,
      expectedState: session.state,
    })

    const claims = (tokens as unknown as { claims(): Record<string, unknown> }).claims()
    if (!claims) {
      logger.warn('Pas de ID token dans la réponse OIDC')
      return null
    }

    const email = (claims.email as string) ?? `${claims.sub as string}@isb-group.fr`
    const name = (claims.name as string) ?? email.split('@')[0]
    const entraRoles: string[] = (claims.roles as string[]) ?? []

    const isAdmin = email.toLowerCase() === config.authAdminEmail.toLowerCase()
    const roles = isAdmin ? ['admin'] : entraRoles.length > 0 ? entraRoles : getRolesForEmail(email)

    if (!isAdmin && roles.length === 0) return null

    const token = createToken({
      sub: claims.sub as string,
      email,
      name,
      roles,
      isAdmin,
    })
    return { token, email, name, roles, isAdmin }
  } catch (err) {
    logger.error({ err }, 'Échec callback OIDC')
    return null
  }
}

export async function getLogoutUrl(): Promise<string | null> {
  const oidcConfig = await getConfig()
  if (!oidcConfig) return null

  const url = buildEndSessionUrl(oidcConfig, {
    post_logout_redirect_uri: config.appUrl,
  })
  return String(url)
}
