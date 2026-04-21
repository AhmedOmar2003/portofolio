import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

import { Link } from '@/i18n/routing';
import { getLocaleDateFormat, isArabicLocale, localizedValue } from '@/utils/locale-content';
import { createClient } from '@/utils/supabase/server';
import { createStaticClient } from '@/utils/supabase/static';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data: articles } = await supabase
    .from('articles')
    .select('slug')
    .not('published_at', 'is', null);
  const locales = ['en', 'ar'];
  return (articles ?? []).flatMap(({ slug }) =>
    locales.map((locale) => ({ locale, slug }))
  );
}

function splitParagraphs(content?: string | null) {
  return (content || '').split('\n').map((s) => s.trim()).filter(Boolean);
}

export default async function ArticleDetailPage(props: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await props.params;
  const isArabic = isArabicLocale(locale);
  const supabase = await createClient();

  const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();
  if (!article) notFound();

  const title       = localizedValue(article as Record<string, unknown>, 'title', locale);
  const content     = localizedValue(article as Record<string, unknown>, 'content', locale);
  const excerpt     = localizedValue(article as Record<string, unknown>, 'excerpt', locale);
  const paragraphs  = splitParagraphs(content);
  const coverImageUrl = article.cover_image_url || article.image_url || article.image || '';

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(getLocaleDateFormat(locale), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[860px]">

        {/* Back link */}
        <Link
          href="/articles"
          className={`mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white ${isArabic ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-4 w-4 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
          {isArabic ? 'رجوع للمقالات' : 'Back to articles'}
        </Link>

        <article>
          {/* Header */}
          <header className={`mb-12 space-y-6 ${isArabic ? 'text-right' : ''}`}>
            <div
              dir={isArabic ? 'rtl' : 'ltr'}
              className={`w-full flex flex-wrap items-center gap-3 ${isArabic ? 'justify-end text-right' : ''}`}
            >
              {isArabic ? (
                <>
                  {article.read_time_minutes ? (
                    <span className="text-sm text-slate-600">
                      {article.read_time_minutes} دقائق قراءة
                    </span>
                  ) : null}
                  {publishedDate ? <span className="text-sm text-slate-500">{publishedDate}</span> : null}
                  {article.category ? (
                    <span className="rounded-full border border-[#8df6c8]/20 bg-[#8df6c8]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#8df6c8]">
                      {article.category}
                    </span>
                  ) : null}
                </>
              ) : (
                <>
                  {article.category ? (
                    <span className="rounded-full border border-[#8df6c8]/20 bg-[#8df6c8]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#8df6c8]">
                      {article.category}
                    </span>
                  ) : null}
                  {publishedDate ? <span className="text-sm text-slate-500">{publishedDate}</span> : null}
                  {article.read_time_minutes ? (
                    <span className="text-sm text-slate-600">
                      {article.read_time_minutes} min read
                    </span>
                  ) : null}
                </>
              )}
            </div>

            <h1 className={`text-balance text-4xl font-semibold text-white sm:text-5xl ${isArabic ? 'leading-tight' : 'tracking-[-0.05em] leading-tight'}`}>
              {title}
            </h1>

            {excerpt && (
              <p className={`text-xl text-slate-400 ${isArabic ? 'leading-9' : 'leading-8'}`}>
                {excerpt}
              </p>
            )}
          </header>

          {/* Cover image */}
          {coverImageUrl && (
            <div className="mb-14 overflow-hidden rounded-3xl border border-white/10">
              <div className="relative aspect-[16/9]">
                <Image
                  src={coverImageUrl}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 860px"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Body */}
          <div className={`space-y-6 text-lg text-slate-300 ${isArabic ? 'leading-9 text-right' : 'leading-9'}`}>
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="italic text-slate-500">
                {isArabic ? 'لا يوجد محتوى بعد.' : 'No content yet.'}
              </p>
            )}
          </div>
        </article>

      </div>
    </main>
  );
}
