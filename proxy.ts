import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

import { routing } from './i18n/routing';
import { updateSession } from '@/utils/supabase/middleware';

const intlProxy = createMiddleware(routing);

function isAdminRoute(pathname: string) {
  const segments = pathname.split('/');
  const locale = segments[1];
  const section = segments[2];

  return routing.locales.includes(locale as (typeof routing.locales)[number]) && section === 'admin';
}

export default async function proxy(request: NextRequest) {
  const intlResponse = intlProxy(request);

  if (!isAdminRoute(request.nextUrl.pathname)) {
    return intlResponse;
  }

  const supabaseResponse = await updateSession(request);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, {
      ...cookie,
    });
  });

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
