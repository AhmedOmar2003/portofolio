'use client';

import { useEffect } from 'react';
import NextLink from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center px-6">
      <div className="admin-card max-w-md w-full px-8 py-10">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-red-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Unexpected Error</h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Something went wrong in the admin panel. This error has been logged.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="btn btn-primary px-6 text-sm"
          >
            Try Again
          </button>
          <NextLink href="/en/admin" className="btn btn-secondary px-6 text-sm">
            Back to Dashboard
          </NextLink>
        </div>
      </div>
    </div>
  );
}
