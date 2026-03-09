'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import clsx from 'clsx';

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className={clsx(
        "relative inline-flex h-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 px-3 text-sm font-medium transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-950",
        isPending && "opacity-50 cursor-not-allowed"
      )}
      aria-label="Toggle language"
    >
      <span className={clsx("transition-colors", locale === 'en' ? 'text-green-500' : 'text-zinc-400')}>
        EN
      </span>
      <span className="mx-1.5 text-zinc-600">|</span>
      <span className={clsx("transition-colors font-arabic", locale === 'ar' ? 'text-green-500' : 'text-zinc-400')}>
        AR
      </span>
    </button>
  );
}
