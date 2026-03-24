import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  verifyEnvAdminCredentials,
} from '@/utils/admin-auth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: Request) {
  if (!process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      {
        error:
          'Admin session secret is missing. Add ADMIN_SESSION_SECRET to the environment before signing in.',
      },
      { status: 500 }
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Enter a valid admin email and password.' },
      { status: 400 }
    )
  }

  const envLoginResult = verifyEnvAdminCredentials(
    parsed.data.email,
    parsed.data.password
  )

  if (envLoginResult === true) {
    const cookieStore = await cookies()
    cookieStore.set(
      ADMIN_SESSION_COOKIE,
      createAdminSessionToken(parsed.data.email),
      getAdminSessionCookieOptions()
    )

    return NextResponse.json({ ok: true })
  }

  if (envLoginResult === false) {
    return NextResponse.json(
      { error: 'Incorrect admin email or password.' },
      { status: 401 }
    )
  }

  return NextResponse.json(
    {
      error:
        'Admin login credentials are not loaded. Add ADMIN_LOGIN_EMAIL and ADMIN_LOGIN_PASSWORD to the project .env.local, then restart the Next.js server.',
    },
    { status: 500 }
  )
}
