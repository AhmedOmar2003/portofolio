'use client';

import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/routing';

type LocaleSwitcherProps = {
  compact?: boolean;
};

export default function LocaleSwitcher({ compact = false }: LocaleSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const targetLocale = locale === 'ar' ? 'en' : 'ar';
  const targetLabel = locale === 'ar' ? 'EN' : 'AR';

  return (
    <Link
      href={pathname}
      locale={targetLocale}
      aria-label={t('toggleLanguage')}
      title={t('toggleLanguage')}
      className={`inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08] ${
        compact ? 'h-10 w-10' : 'gap-2 px-3 py-2 text-sm font-medium'
      }`}
    >
      <Languages className="h-4 w-4" />
      {!compact ? <span>{targetLabel}</span> : null}
    </Link>
  );
}
