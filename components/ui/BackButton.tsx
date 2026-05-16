'use client';

import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BackButtonProps {
  href: string;
  labelKey?: string;
  namespace?: string;
}

export default function BackButton({ 
  href, 
  labelKey = 'backToProjects',
  namespace = 'Navigation'
}: BackButtonProps) {
  const t = useTranslations(namespace);
  
  return (
    <Link 
      href={href} 
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
    >
      <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
      {t(labelKey)}
    </Link>
  );
}
