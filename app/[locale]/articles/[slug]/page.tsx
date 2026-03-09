import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

export default async function ArticleDetailPage(props: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await props.params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!article) notFound();

  const title = locale === 'ar' ? article.title_ar : article.title_en;
  const content = locale === 'ar' ? article.content_ar : article.content_en;
  const excerpt = locale === 'ar' ? article.excerpt_ar : article.excerpt_en;
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">
        <Link href="/articles" className="inline-flex items-center gap-2 text-zinc-400 hover:text-green-500 mb-12 transition-colors">
          <ArrowLeft size={16} className={locale === 'ar' ? 'rotate-180' : ''} />
          <span>{locale === 'ar' ? 'العودة للمقالات' : 'Back to Articles'}</span>
        </Link>

        {/* Article Header */}
        <header className="mb-16 space-y-6">
          <div className="flex items-center gap-3 text-sm">
            {article.category && (
              <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full text-xs font-medium">
                {article.category}
              </span>
            )}
            {publishedDate && <span className="text-zinc-500">{publishedDate}</span>}
            {article.read_time_minutes && (
              <>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">{article.read_time_minutes} {locale === 'ar' ? 'دقائق قراءة' : 'min read'}</span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 tracking-tight leading-tight" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {title}
          </h1>

          {excerpt && (
            <p className="text-xl text-zinc-400 font-light leading-relaxed border-l-2 border-green-500 pl-5" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              {excerpt}
            </p>
          )}
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-invert prose-green max-w-none text-zinc-300 leading-relaxed space-y-6"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          {content ? (
            content.split('\n').map((para: string, idx: number) => 
              para.trim() ? <p key={idx} className="text-zinc-300 text-lg font-light leading-relaxed">{para}</p> : null
            )
          ) : (
            <p className="text-zinc-500 italic">{locale === 'ar' ? 'لا يوجد محتوى بعد.' : 'No content yet.'}</p>
          )}
        </div>
      </div>
    </main>
  );
}
