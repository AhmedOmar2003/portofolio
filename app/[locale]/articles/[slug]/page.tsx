import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

import { Link } from '@/i18n/routing';
import { getLocaleDateFormat, isArabicLocale, localizedValue } from '@/utils/locale-content';
import { createClient } from '@/utils/supabase/server';

function splitParagraphs(content?: string | null) {
  return (content || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function ArticleDetailPage(props: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await props.params;
  const supabase = await createClient();

  const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();

  if (!article) {
    notFound();
  }

  const title = localizedValue(article as Record<string, unknown>, 'title', locale);
  const content = localizedValue(article as Record<string, unknown>, 'content', locale);
  const excerpt = localizedValue(article as Record<string, unknown>, 'excerpt', locale);
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(getLocaleDateFormat(locale), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const paragraphs = splitParagraphs(content);

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1180px]">
        <Link
          href="/articles"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {isArabicLocale(locale) ? 'رجوع للمقالات' : 'Back to articles'}
        </Link>

        <article className="section-shell overflow-hidden px-6 py-8 md:px-10 md:py-10">
          <header className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {article.category ? (
                <span className="rounded-full border border-[#8df6c8]/20 bg-[#8df6c8]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8df6c8]">
                  {article.category}
                </span>
              ) : null}
              {publishedDate ? <span className="text-slate-500">{publishedDate}</span> : null}
              {article.read_time_minutes ? (
                <span className="text-slate-500">
                  {article.read_time_minutes} {isArabicLocale(locale) ? 'دقائق قراءة' : 'min read'}
                </span>
              ) : null}
            </div>

            <h1 className="text-balance text-[2.5rem] font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-[4.2rem] lg:leading-[1.02]">
              {title}
            </h1>

            {excerpt ? <p className="text-base leading-7 text-slate-300 sm:text-xl sm:leading-8">{excerpt}</p> : null}
          </header>

          {article.cover_image_url ? (
            <div className="mx-auto mt-10 max-w-5xl">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-white/10">
                <Image
                  src={article.cover_image_url}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 86vw, 960px"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}

          <div className="mx-auto mt-10 max-w-3xl space-y-5 text-base leading-8 text-slate-300 sm:mt-12 sm:text-lg sm:leading-9">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)
            ) : (
              <p className="italic text-slate-500">{isArabicLocale(locale) ? 'لا يوجد محتوى بعد.' : 'No content yet.'}</p>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
