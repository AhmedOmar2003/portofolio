import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/ui/SectionHeading';
import { getLocaleDateFormat, isArabicLocale, localizedValue } from '@/utils/locale-content';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

function formatDate(dateValue: string | null | undefined, locale: string) {
  if (!dateValue) return '';
  return new Date(dateValue).toLocaleDateString(getLocaleDateFormat(locale), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = isArabicLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ArticlesPage' });
  const supabase = await createClient();

  const { data: articlesData } = await supabase
    .from('articles')
    .select('id, slug, title_en, title_ar, excerpt_en, excerpt_ar, category, published_at, created_at, read_time_minutes')
    .order('created_at', { ascending: false });

  const articlesList = (articlesData || []).map((a) => ({
    slug: a.slug,
    title: localizedValue(a as Record<string, unknown>, 'title', locale) || a.title_en,
    excerpt: localizedValue(a as Record<string, unknown>, 'excerpt', locale) || a.excerpt_en || '',
    category: a.category || t('categoryFallback'),
    date: formatDate(a.published_at || a.created_at, locale),
    readTime: isArabic
      ? `${a.read_time_minutes || 5} دقائق`
      : `${a.read_time_minutes || 5} min`,
  }));

  const finalArticles = articlesList.length > 0 ? articlesList : [
    { slug: '#', title: t('sampleTitle1'), excerpt: t('sampleExcerpt1'), category: t('sampleCategory1'), date: 'Oct 12, 2025', readTime: isArabic ? '٥ دقائق' : '5 min' },
    { slug: '#', title: t('sampleTitle2'), excerpt: t('sampleExcerpt2'), category: t('sampleCategory2'), date: 'Sep 28, 2025', readTime: isArabic ? '٨ دقائق' : '8 min' },
  ];

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px] space-y-20">

        {/* Header */}
        <SectionHeading overline={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        {/* Articles list — typographic rows */}
        <div className="divide-y divide-white/8">
          {finalArticles.map((article, index) => {
            const href = article.slug !== '#' ? `/articles/${article.slug}` : '/articles';
            return (
              <Link key={`${article.slug}-${index}`} href={href} className="group block py-8 first:pt-0 last:pb-0">
                <article>
                  <div className={`mb-4 flex flex-wrap items-center gap-3 ${isArabic ? 'w-full flex-row-reverse justify-end text-right' : ''}`}>
                    <span className="rounded-full border border-[#8df6c8]/20 bg-[#8df6c8]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#8df6c8]">
                      {article.category}
                    </span>
                    {article.date && <span className="text-sm text-slate-500">{article.date}</span>}
                    <span className="text-sm text-slate-600">{article.readTime}</span>
                  </div>

                  <div className="flex items-start justify-between gap-6">
                    <div className={`min-w-0 flex-1 ${isArabic ? 'order-1 text-right' : 'order-1'}`}>
                      <h2 className={`text-2xl font-semibold text-white transition-colors group-hover:text-[#8df6c8] sm:text-3xl ${isArabic ? 'leading-tight text-right' : 'tracking-[-0.04em]'}`}>
                        {article.title}
                      </h2>
                      {article.excerpt && (
                        <p className={`mt-3 max-w-3xl text-base text-slate-400 ${isArabic ? 'leading-8 text-right' : 'leading-7'}`}>
                          {article.excerpt}
                        </p>
                      )}
                    </div>

                    <ArrowUpRight
                      className={`mt-2 h-6 w-6 shrink-0 text-slate-600 transition-all duration-300 group-hover:text-[#8df6c8] ${isArabic ? 'order-2 rtl-flip group-hover:-translate-x-1' : 'order-2 group-hover:translate-x-1 group-hover:-translate-y-1'}`}
                      aria-hidden="true"
                    />
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
