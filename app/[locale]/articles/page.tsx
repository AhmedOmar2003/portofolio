import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/ui/SectionHeading';
import { getLocaleDateFormat, isArabicLocale, localizedValue } from '@/utils/locale-content';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

function formatDate(dateValue: string | null | undefined, locale: string) {
  if (!dateValue) {
    return '';
  }

  return new Date(dateValue).toLocaleDateString(getLocaleDateFormat(locale), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ArticlesPage' });
  const supabase = await createClient();

  const { data: articlesData, error: articlesError } = await supabase.from('articles').select('*').order('created_at', { ascending: false });

  if (articlesError) {
    console.error('[Articles Page] Supabase error:', articlesError);
  }

  const articlesList = (articlesData || []).map((article) => ({
    slug: article.slug,
    title: localizedValue(article as Record<string, unknown>, 'title', locale),
    excerpt: localizedValue(article as Record<string, unknown>, 'excerpt', locale),
    category: article.category || t('categoryFallback'),
    date: formatDate(article.published_at || article.created_at, locale),
    readTime: isArabicLocale(locale)
      ? `${article.read_time_minutes || 5} دقائق قراءة`
      : `${article.read_time_minutes || 5} min read`,
  }));

  const finalArticles =
    articlesList.length > 0
      ? articlesList
      : [
          {
            slug: '#',
            title: t('sampleTitle1'),
            excerpt: t('sampleExcerpt1'),
            category: t('sampleCategory1'),
            date: 'Oct 12, 2025',
            readTime: isArabicLocale(locale) ? '٥ دقائق قراءة' : '5 min read',
          },
          {
            slug: '#',
            title: t('sampleTitle2'),
            excerpt: t('sampleExcerpt2'),
            category: t('sampleCategory2'),
            date: 'Sep 28, 2025',
            readTime: isArabicLocale(locale) ? '٨ دقائق قراءة' : '8 min read',
          },
        ];

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px]">
        <section className="section-shell px-6 py-8 md:px-10 md:py-10">
          <SectionHeading overline={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        </section>

        <section className="py-12">
          <div className="grid gap-6 lg:grid-cols-2">
            {finalArticles.map((article, index) => {
              const href = article.slug !== '#' ? `/articles/${article.slug}` : '/articles';

              return (
                <Link key={`${article.title}-${index}`} href={href} className="group block h-full">
                  <article className="section-shell flex h-full flex-col justify-between px-6 py-8 transition duration-300 group-hover:-translate-y-1 group-hover:border-white/14">
                    <div>
                      <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full border border-[#8df6c8]/20 bg-[#8df6c8]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8df6c8]">
                          {article.category}
                        </span>
                        <span className="text-slate-500">{article.date}</span>
                        <span className="text-slate-500">{article.readTime}</span>
                      </div>

                      <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[2rem]">{article.title}</h2>
                      <p className="mt-4 text-base leading-8 text-slate-300">{article.excerpt}</p>
                    </div>

                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#8df6c8]">
                      {t('cta')}
                      <ArrowUpRight
                        className={`h-4 w-4 transition duration-300 group-hover:-translate-y-0.5 ${
                          isArabicLocale(locale) ? 'rtl-flip' : 'group-hover:translate-x-0.5'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
