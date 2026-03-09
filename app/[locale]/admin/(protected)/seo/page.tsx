import { createClient } from '@/utils/supabase/server';
import { Search, Eye, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default async function AdminSEOPage() {
  const supabase = await createClient();

  // Fetch all necessary data
  const [
    { data: projects },
    { data: articles },
    { data: pageViews }
  ] = await Promise.all([
    supabase.from('projects').select('id, name_en, slug, description_en, is_featured'),
    supabase.from('articles').select('id, title_en, slug, excerpt_en'),
    supabase.from('page_views').select('slug')
  ]);

  // Aggregate views per slug manually since we didn't index visitor_id natively for distinct aggregation
  const viewsBySlug: Record<string, number> = {};
  pageViews?.forEach(pv => {
    if (pv.slug) {
      viewsBySlug[pv.slug] = (viewsBySlug[pv.slug] || 0) + 1;
    }
  });

  // Calculate SEO Health for Projects
  const projectStats = (projects || []).map(p => {
    const hasGoodDescription = p.description_en && p.description_en.length > 50 && p.description_en.length < 160;
    const hasCleanSlug = p.slug && /^[a-z0-9-]+$/.test(p.slug) && !p.slug.includes('project-');
    const missingMetadata = !p.description_en || !p.slug;
    
    return {
      id: p.id,
      title: p.name_en,
      type: 'Project',
      slug: p.slug,
      views: viewsBySlug[p.slug] || 0,
      seoScore: (hasGoodDescription ? 50 : 0) + (hasCleanSlug ? 50 : 0),
      issues: [
        !hasGoodDescription ? "Meta description Too short/long" : null,
        !hasCleanSlug ? "Slug is not URL-friendly" : null,
        missingMetadata ? "Missing critical metadata" : null,
      ].filter(Boolean) as string[]
    };
  });

  // Calculate SEO Health for Articles
  const articleStats = (articles || []).map(a => {
    const hasGoodExcerpt = a.excerpt_en && a.excerpt_en.length > 50 && a.excerpt_en.length < 160;
    const hasCleanSlug = a.slug && /^[a-z0-9-]+$/.test(a.slug);
    
    return {
      id: a.id,
      title: a.title_en,
      type: 'Article',
      slug: a.slug,
      views: viewsBySlug[a.slug] || 0,
      seoScore: (hasGoodExcerpt ? 50 : 0) + (hasCleanSlug ? 50 : 0),
      issues: [
        !hasGoodExcerpt ? "Excerpt not optimized for Search" : null,
        !hasCleanSlug ? "Slug is not URL-friendly" : null,
      ].filter(Boolean) as string[]
    };
  });

  const allContent = [...projectStats, ...articleStats].sort((a, b) => b.views - a.views); // Sort by highest traffic

  const totalContentViews = allContent.reduce((sum, item) => sum + item.views, 0);
  const avgSeoScore = allContent.length > 0 ? Math.round(allContent.reduce((sum, item) => sum + item.seoScore, 0) / allContent.length) : 0;
  const itemsNeedingFixes = allContent.filter(item => item.issues.length > 0).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Search className="w-8 h-8 text-brand-primary" /> SEO & Performance
        </h1>
        <p className="text-white/60">Analyze content traffic and discover opportunities to improve search ranking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 font-medium">Global SEO Score</span>
            <TrendingUp className="w-5 h-5 text-brand-primary" />
          </div>
          <span className="text-4xl font-bold text-white">{avgSeoScore}%</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 font-medium">Content Views</span>
            <Eye className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-4xl font-bold text-white">{totalContentViews}</span>
        </div>
        <div className="bg-white/5 border border-red-500/20 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-400 font-medium">Optimization Alerts</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <span className="text-4xl font-bold text-red-500">{itemsNeedingFixes}</span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-6">
        <h2 className="text-xl font-bold text-white mb-6">Content Health Audit</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-sm">
                <th className="pb-4 font-medium uppercase tracking-wider">Title / Slug</th>
                <th className="pb-4 font-medium uppercase tracking-wider">Type</th>
                <th className="pb-4 font-medium uppercase tracking-wider">Views</th>
                <th className="pb-4 font-medium uppercase tracking-wider">Score</th>
                <th className="pb-4 font-medium uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allContent.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="font-medium text-white mb-1">{item.title}</p>
                    <p className="text-xs text-white/40">/{item.type.toLowerCase()}s/{item.slug || 'missing-slug'}</p>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${item.type === 'Project' ? 'bg-orange-500/10 text-orange-400' : 'bg-purple-500/10 text-purple-400'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4 text-white font-mono">{item.views}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[100px] h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${item.seoScore >= 80 ? 'bg-green-500' : item.seoScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.seoScore}%` }} />
                      </div>
                      <span className="text-sm font-bold text-white/80">{item.seoScore}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    {item.issues.length === 0 ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Perfect
                      </span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {item.issues.map((issue, idx) => (
                          <span key={idx} className="flex items-center gap-1 text-yellow-500 text-xs">
                            <AlertTriangle className="w-3 h-3" /> {issue}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allContent.length === 0 && (
            <div className="py-12 text-center text-white/40">
              No content published yet to analyze.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
