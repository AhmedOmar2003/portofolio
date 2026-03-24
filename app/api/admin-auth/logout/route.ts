import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
} from '@/utils/admin-auth'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, '', {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  })

  return NextResponse.json({ ok: true })
}
