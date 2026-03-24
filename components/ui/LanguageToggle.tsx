'use client';

import clsx from 'clsx';
import { Languages } from 'lucide-react';
import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations('Navigation');
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
      type="button"
      onClick={toggleLocale}
      disabled={isPending}
      aria-label={t('toggleLanguage')}
      className={clsx(
        'inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]',
        isPending && 'cursor-not-allowed opacity-60'
      )}
    >
      <Languages className="h-4 w-4 text-[#8df6c8]" aria-hidden="true" />
      <span className={clsx(locale === 'en' ? 'text-white' : 'text-slate-400')}>EN</span>
      <span className="text-slate-600">/</span>
      <span className={clsx(locale === 'ar' ? 'text-white' : 'text-slate-400')}>AR</span>
    </button>
  );
}
