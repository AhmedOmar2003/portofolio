import { createHmac, timingSafeEqual } from 'crypto'

import { cookies } from 'next/headers'

export const ADMIN_SESSION_COOKIE = 'ae_admin_session'

const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 14

type AdminSessionPayload = {
  email: string
  expiresAt: number
}

function getAdminSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    null
  )
}

function signPayload(encodedPayload: string) {
  const secret = getAdminSessionSecret()

  if (!secret) {
    return null
  }

  return createHmac('sha256', secret).update(encodedPayload).digest('base64url')
}

export function createAdminSessionToken(email: string) {
  const payload: AdminSessionPayload = {
    email,
    expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE * 1000,
  }

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = signPayload(encodedPayload)

  if (!signature) {
    throw new Error(
      'Admin session signing secret is missing. Add ADMIN_SESSION_SECRET or SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  return `${encodedPayload}.${signature}`
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token) {
    return null
  }

  const [encodedPayload, signature] = token.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = signPayload(encodedPayload)

  if (!expectedSignature) {
    return null
  }

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    ) as AdminSessionPayload

    if (!payload.email || !payload.expiresAt || payload.expiresAt <= Date.now()) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  return verifyAdminSessionToken(token)
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  }
}

function safeEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function verifyEnvAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_LOGIN_EMAIL
  const adminPassword = process.env.ADMIN_LOGIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return null
  }

  return safeEquals(email.trim().toLowerCase(), adminEmail.trim().toLowerCase()) &&
    safeEquals(password, adminPassword)
}
