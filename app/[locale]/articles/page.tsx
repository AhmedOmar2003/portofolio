import SectionHeading from '@/components/ui/SectionHeading';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { Link } from '@/i18n/routing';

export default async function ArticlesPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Navigation' });
  const supabase = await createClient();

  const { data: articlesData, error: articlesError } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (articlesError) {
    console.error('[Articles Page] Supabase error:', articlesError);
  }

  const articlesList = (articlesData || []).map(a => ({
    slug: a.slug,
    title: locale === 'ar' ? a.title_ar : a.title_en,
    excerpt: locale === 'ar' ? a.excerpt_ar : a.excerpt_en,
    category: a.category || '',
    date: (a.published_at || a.created_at) ? new Date(a.published_at || a.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
    readTime: `${a.read_time_minutes || 5} ${locale === 'ar' ? 'دقائق قراءة' : 'min read'}`,
  }));

  const finalArticles = articlesList.length > 0 ? articlesList : [
    { slug: '#', title: "The Role of Empathy in Designing Scalable SaaS Products", date: "Oct 12, 2025", category: "Product Thinking", readTime: "5 min read", excerpt: '' },
    { slug: '#', title: "Why Your Design System is Failing (And How to Fix It)", date: "Sep 28, 2025", category: "Design Systems", readTime: "8 min read", excerpt: '' },
    { slug: '#', title: "Designing for Cognitive Load: A Practical Guide", date: "Aug 15, 2025", category: "UX Research", readTime: "6 min read", excerpt: '' },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <SectionHeading title={t('articles')} subtitle="Insights, thoughts, and best practices on product design, user experience, and building scalable systems." />
        
        <div className="mt-16 flex flex-col gap-6">
          {finalArticles.map((article, idx) => (
            <Link key={idx} href={article.slug !== '#' ? `/articles/${article.slug}` : '#'}>
              <article className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:bg-zinc-800/50 transition-colors group cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-green-500 font-medium">{article.category}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-500">{article.date}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-zinc-50 group-hover:text-green-500 transition-colors" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-zinc-400 font-light leading-relaxed line-clamp-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>{article.excerpt}</p>
                  )}
                </div>
                <div className="shrink-0 flex items-center justify-between md:flex-col md:items-end md:justify-center gap-4">
                  <span className="text-sm text-zinc-500">{article.readTime}</span>
                  <span className="w-10 h-10 rounded-full border border-zinc-800 group-hover:border-green-500 group-hover:bg-green-500/10 flex items-center justify-center text-zinc-400 group-hover:text-green-500 transition-colors">
                    →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

