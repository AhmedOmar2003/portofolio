import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { cookies } from 'next/headers'

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
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

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  const { data, error } = await supabase.rpc('verify_admin_login', {
    login_email: parsed.data.email,
    login_password: parsed.data.password,
  })

  if (error) {
    return NextResponse.json(
      {
        error:
          'Admin login is not configured in Supabase yet. Run the SQL file for fixed admin access first.',
      },
      { status: 500 }
    )
  }

  if (!data) {
    return NextResponse.json(
      { error: 'Incorrect admin email or password.' },
      { status: 401 }
    )
  }

  const cookieStore = await cookies()
  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken(parsed.data.email),
    getAdminSessionCookieOptions()
  )

  return NextResponse.json({ ok: true })
}
