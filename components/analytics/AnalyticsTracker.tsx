'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logPageView } from '@/app/actions/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Basic block for admin routes — we don't want to track our own dashboard usage
    if (pathname.includes('/admin')) return;

    // Use a small delay to ensure page load is completed
    const timeout = setTimeout(() => {
      // Fire and forget, no await needed to avoid blocking main thread
      logPageView(pathname).catch(console.error);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null; // This component is invisible
}
