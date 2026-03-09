'use server';

import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';
import { headers } from 'next/headers';

export async function logPageView(pathname: string) {
  // Extract a slug if viewing an article or project (e.g. /en/projects/my-slug -> my-slug)
  const segments = pathname.split('/').filter(Boolean);
  let slug = null;
  if (segments.length >= 3 && (segments[1] === 'projects' || segments[1] === 'articles')) {
    slug = segments[2];
  }

  // Create a privacy-friendly visitor hash (IP + User Agent + Daily Salt)
  // This allows us to track "Unique Visitors" per day without storing PII or using cookies
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown-ip';
  const userAgent = headersList.get('user-agent') || 'unknown-ua';
  const dateSalt = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const visitorHash = crypto
    .createHash('sha256')
    .update(`${ip}-${userAgent}-${dateSalt}`)
    .digest('hex')
    .substring(0, 16); // Take first 16 chars for brevity

  const supabase = await createClient();

  const { error } = await supabase
    .from('page_views')
    .insert([
      { path: pathname, slug, visitor_id: visitorHash }
    ]);

  if (error) {
    console.error('Failed to log page view:', error);
  }
}
