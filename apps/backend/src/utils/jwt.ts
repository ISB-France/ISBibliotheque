import { createHmac, timingSafeEqual } from 'node:crypto'
import { config } from '../config/index.js'

interface JwtPayload {
  sub: string
  email: string
  name: string
  roles: string[]
  isAdmin: boolean
  exp: number
  iat: number
}

function base64url(data: string): string {
  return Buffer.from(data).toString('base64url').replace(/=+$/, '')
}

function base64urlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf-8')
}

function sign(header: string, payload: string): string {
  const hmac = createHmac('sha256', config.jwtSecret)
  hmac.update(`${header}.${payload}`)
  return hmac.digest('base64url')
}

export function createToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const now = Math.floor(Date.now() / 1000)
  const expMap: Record<string, number> = { h: 3600, m: 60, s: 1, d: 86400 }
  const unit = config.jwtExpiresIn.slice(-1)
  const value = parseInt(config.jwtExpiresIn, 10)
  const expiresInSec = value * (expMap[unit] ?? 3600)

  const full: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSec,
  }

  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify(full))
  const signature = sign(header, body)
  return `${header}.${body}.${signature}`
}

export interface VerifyResult {
  ok: true
  payload: JwtPayload
}

export function verifyToken(token: string): VerifyResult | { ok: false; reason: string } {
  const parts = token.split('.')
  if (parts.length !== 3) return { ok: false, reason: 'Format invalide' }

  const [headerB64, bodyB64, signatureB64] = parts

  const expectedSig = sign(headerB64, bodyB64)
  const actualSig = signatureB64

  try {
    if (!timingSafeEqual(Buffer.from(expectedSig), Buffer.from(actualSig))) {
      return { ok: false, reason: 'Signature invalide' }
    }
  } catch {
    return { ok: false, reason: 'Signature invalide' }
  }

  let payload: JwtPayload
  try {
    payload = JSON.parse(base64urlDecode(bodyB64))
  } catch {
    return { ok: false, reason: 'Payload invalide' }
  }

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return { ok: false, reason: 'Token expiré' }
  }

  return { ok: true, payload }
}
