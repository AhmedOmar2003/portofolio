'use server';

import crypto from 'crypto';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const VISITOR_COOKIE = 'ae_visitor_id';
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function logPageView(pathname: string) {
  // Extract a slug if viewing an article or project (e.g. /en/projects/my-slug -> my-slug)
  const segments = pathname.split('/').filter(Boolean);
  let slug = null;
  if (segments.length >= 3 && (segments[1] === 'projects' || segments[1] === 'articles')) {
    slug = segments[2];
  }

  // Create or reuse a privacy-friendly anonymous visitor id.
  // This keeps the same visitor counted once across multiple visits from the same browser.
  const cookieStore = await cookies();
  const existingVisitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  const visitorId = existingVisitorId || crypto.randomUUID();

  if (!existingVisitorId) {
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: VISITOR_COOKIE_MAX_AGE,
    });
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('page_views')
    .insert([
      { path: pathname, slug, visitor_id: visitorId }
    ]);

  if (error) {
    console.error('Failed to log page view:', error);
  }
}
