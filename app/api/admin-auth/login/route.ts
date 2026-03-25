import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
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

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY

  if (!serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          'Admin login is not configured. Add ADMIN_LOGIN_EMAIL and ADMIN_LOGIN_PASSWORD, or set SUPABASE_SERVICE_ROLE_KEY for the fixed SQL admin table.',
      },
      { status: 500 }
    )
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  const { data, error } = await supabase
    .from('admin_credentials')
    .select('email,password_hash')
    .eq('email', parsed.data.email.trim().toLowerCase())
    .maybeSingle()

  if (error) {
    return NextResponse.json(
      {
        error: `Admin SQL login is not ready yet. Supabase returned: ${error.message}`,
      },
      { status: 500 }
    )
  }

  const incomingPasswordHash = createHash('sha256')
    .update(parsed.data.password)
    .digest('hex')

  if (!data || data.password_hash !== incomingPasswordHash) {
    return NextResponse.json(
      { error: 'Incorrect admin email or password.' },
      { status: 401 }
    )
  }

  const cookieStore = await cookies()
  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken(data.email),
    getAdminSessionCookieOptions()
  )

  return NextResponse.json({ ok: true })
}
