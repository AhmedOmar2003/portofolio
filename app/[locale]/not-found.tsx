'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <p
          className="text-[10rem] font-black leading-none tracking-tighter text-white/5 select-none"
          aria-hidden="true"
        >
          404
        </p>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <span className="eyebrow">
            {isArabic ? 'الصفحة غير موجودة' : 'Page Not Found'}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {isArabic ? 'هذه الصفحة غير موجودة' : "This page doesn't exist."}
          </h1>
          <p className="max-w-sm text-base text-slate-400 leading-relaxed">
            {isArabic
              ? 'ربما تم نقل المحتوى أو حذفه. تحقق من الرابط أو ارجع للصفحة الرئيسية.'
              : 'The content may have moved or been removed. Check the URL or head back home.'}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary px-8">
          {isArabic ? 'الرئيسية' : 'Go Home'}
        </Link>
        <Link href="/projects" className="btn btn-secondary px-8">
          {isArabic ? 'المشاريع' : 'View Projects'}
        </Link>
      </div>
    </main>
  );
}
