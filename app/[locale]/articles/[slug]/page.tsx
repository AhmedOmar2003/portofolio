import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

import { Link } from '@/i18n/routing';
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

  const title = locale === 'ar' ? article.title_ar : article.title_en;
  const content = locale === 'ar' ? article.content_ar : article.content_en;
  const excerpt = locale === 'ar' ? article.excerpt_ar : article.excerpt_en;
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
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
          <ArrowLeft className={`h-4 w-4 ${locale === 'ar' ? 'rotate-180' : ''}`} aria-hidden="true" />
          {locale === 'ar' ? 'العودة إلى المقالات' : 'Back to articles'}
        </Link>

        <article className="section-shell overflow-hidden px-6 py-8 md:px-10 md:py-10">
          <header className="mx-auto max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {article.category ? (
                <span className="rounded-full border border-[#8df6c8]/20 bg-[#8df6c8]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8df6c8]">
                  {article.category}
                </span>
              ) : null}
              {publishedDate ? <span className="text-slate-500">{publishedDate}</span> : null}
              {article.read_time_minutes ? (
                <span className="text-slate-500">
                  {article.read_time_minutes} {locale === 'ar' ? 'دقائق قراءة' : 'min read'}
                </span>
              ) : null}
            </div>

            <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-[4.2rem] lg:leading-[1.02]">
              {title}
            </h1>

            {excerpt ? <p className="text-lg leading-8 text-slate-300 sm:text-xl">{excerpt}</p> : null}
          </header>

          {article.cover_image_url ? (
            <div className="mx-auto mt-10 max-w-5xl">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-white/10">
                <Image src={article.cover_image_url} alt={title} fill className="object-cover" />
              </div>
            </div>
          ) : null}

          <div className="mx-auto mt-12 max-w-3xl space-y-5 text-lg leading-9 text-slate-300">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)
            ) : (
              <p className="italic text-slate-500">{locale === 'ar' ? 'لا يوجد محتوى بعد.' : 'No content yet.'}</p>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
