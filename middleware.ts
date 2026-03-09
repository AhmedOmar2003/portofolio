import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { updateSession } from '@/utils/supabase/middleware'
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 1. Update Supabase Session
  const supabaseResponse = await updateSession(request)
  
  // 2. Run i18n routing middleware on the updated request
  const intlResponse = intlMiddleware(request)

  // 3. Merge cookies from Supabase response into Intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, {
       ...cookie,
    })
  })

  return intlResponse
}

export const config = {
  // Match only internationalized pathnames, avoid static files and api
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
