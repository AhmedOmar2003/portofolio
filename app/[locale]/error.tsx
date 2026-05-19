'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="section-shell max-w-lg w-full px-8 py-12">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-400"
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

        <span className="eyebrow mb-4 inline-flex">
          {isArabic ? 'حدث خطأ' : 'Something went wrong'}
        </span>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
          {isArabic ? 'عذراً، حدث خطأ غير متوقع' : 'Unexpected error occurred'}
        </h1>

        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          {isArabic
            ? 'حدث خطأ أثناء تحميل هذه الصفحة. يمكنك المحاولة مرة أخرى أو العودة للرئيسية.'
            : 'An error occurred while loading this page. You can try again or head back home.'}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={reset} className="btn btn-primary px-8">
            {isArabic ? 'حاول مجدداً' : 'Try Again'}
          </button>
          <a href={`/${locale}`} className="btn btn-secondary px-8">
            {isArabic ? 'الرئيسية' : 'Go Home'}
          </a>
        </div>
      </div>
    </main>
  );
}
