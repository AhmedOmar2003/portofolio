import { createClient } from '@/utils/supabase/server'
import { BarChart3, Eye, FileText, Globe, Layers, TrendingUp } from 'lucide-react'

export default async function AdminAnalyticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isArabic = locale === 'ar'
  const supabase = await createClient()

  const [
    { data: pageViewsRaw },
    { data: projects },
    { data: services },
  ] = await Promise.all([
    supabase.from('page_views').select('path, slug, visitor_id, created_at'),
    supabase.from('projects').select('id, name_en, name_ar, slug'),
    supabase.from('services').select('id, title_en, title_ar, view_order'),
  ])

  // ── Total / Unique visitors ──────────────────────────────────────────────
  const totalViews = pageViewsRaw?.length ?? 0
  const uniqueVisitors = new Set(pageViewsRaw?.map((v) => v.visitor_id) ?? []).size

  // ── Views by page path ───────────────────────────────────────────────────
  const pathCounts: Record<string, number> = {}
  pageViewsRaw?.forEach((v) => {
    const p = v.path
    pathCounts[p] = (pathCounts[p] ?? 0) + 1
  })
  const topPages = Object.entries(pathCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([path, views]) => ({ path, views }))

  // ── Views by slug (for projects) ─────────────────────────────────────────
  const slugCounts: Record<string, number> = {}
  pageViewsRaw?.forEach((v) => {
    if (v.slug) slugCounts[v.slug] = (slugCounts[v.slug] ?? 0) + 1
  })

  const projectsWithViews = (projects ?? [])
    .map((p) => ({
      id: p.id,
      name: isArabic ? (p.name_ar || p.name_en) : p.name_en,
      slug: p.slug,
      views: slugCounts[p.slug] ?? 0,
    }))
    .sort((a, b) => b.views - a.views)

  // ── Services (sorted by view_order as our "engagement" proxy since no views tracked yet) ─
  const serviceList = (services ?? []).map((s) => ({
    id: s.id,
    name: isArabic ? (s.title_ar || s.title_en) : s.title_en,
  }))

  // ── Trend: views per day last 7 days ─────────────────────────────────────
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
  const viewsByDay: Record<string, number> = {}
  last7.forEach((d) => { viewsByDay[d] = 0 })
  pageViewsRaw?.forEach((v) => {
    const day = new Date(v.created_at).toISOString().split('T')[0]
    if (day in viewsByDay) viewsByDay[day]++
  })
  const maxDay = Math.max(...Object.values(viewsByDay), 1)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="admin-kicker">{isArabic ? 'التحليلات' : 'Analytics'}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
          {isArabic ? 'إحصائيات الموقع' : 'Site Insights'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isArabic
            ? 'بيانات حقيقية من زوار موقعك — الصفحات الأكثر زيارة، والمشاريع المشاهدة.'
            : 'Real traffic data — top pages, most-viewed projects and visitor trends.'}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[
          { label: isArabic ? 'إجمالي الزيارات' : 'Total Views',     value: totalViews,      icon: Eye },
          { label: isArabic ? 'زوار فريدون'      : 'Unique Visitors', value: uniqueVisitors,  icon: Globe },
          { label: isArabic ? 'صفحات مطلوبة'    : 'Unique Pages',    value: topPages.length, icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className="admin-card px-5 py-5">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#8df6c8]`}>
              <s.icon className="h-4 w-4" />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{s.value}</p>
            <p className="mt-1 text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">

        {/* Daily trend bar chart */}
        <section className="admin-card px-6 py-6">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#8df6c8]" />
            <h2 className="text-base font-semibold text-white">{isArabic ? 'الزيارات – آخر 7 أيام' : 'Views – Last 7 Days'}</h2>
          </div>
          <div className="flex h-36 items-end gap-2">
            {last7.map((day) => {
              const count = viewsByDay[day]
              const height = Math.max(4, Math.round((count / maxDay) * 136))
              const label = new Date(day).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { weekday: 'short' })
              return (
                <div key={day} className="group flex flex-1 flex-col items-center gap-1">
                  <div
                    className="relative w-full rounded-t-lg bg-[#8df6c8]/20 transition-all group-hover:bg-[#8df6c8]/40"
                    style={{ height: `${height}px` }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white opacity-0 group-hover:opacity-100">
                      {count}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-600">{label}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Top pages */}
        <section className="admin-card px-6 py-6">
          <div className="mb-5 flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#8df6c8]" />
            <h2 className="text-base font-semibold text-white">{isArabic ? 'أكثر الصفحات زيارة' : 'Top Pages'}</h2>
          </div>
          {topPages.length > 0 ? (
            <div className="space-y-3">
              {topPages.map(({ path, views }, i) => {
                const pct = Math.round((views / topPages[0].views) * 100)
                return (
                  <div key={path} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-semibold text-slate-600">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-white">{path}</p>
                      <div className="mt-1 h-1 rounded-full bg-white/8">
                        <div className="h-full rounded-full bg-[#8df6c8]/50" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-300">{views}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">{isArabic ? 'لا توجد بيانات زيارات.' : 'No visit data yet.'}</p>
          )}
        </section>

        {/* Most viewed projects */}
        <section className="admin-card px-6 py-6">
          <div className="mb-5 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#8df6c8]" />
            <h2 className="text-base font-semibold text-white">{isArabic ? 'أكثر المشاريع مشاهدة' : 'Most-Viewed Projects'}</h2>
          </div>
          {projectsWithViews.length > 0 ? (
            <div className="space-y-3">
              {projectsWithViews.slice(0, 6).map((p, i) => {
                const maxV = projectsWithViews[0].views
                const pct = maxV > 0 ? Math.round((p.views / maxV) * 100) : 0
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-semibold text-slate-600">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-white">{p.name}</p>
                      <div className="mt-1 h-1 rounded-full bg-white/8">
                        <div className="h-full rounded-full bg-[#8df6c8]/50" style={{ width: `${Math.max(pct, 2)}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-300">{p.views}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">{isArabic ? 'لا توجد مشاريع.' : 'No projects yet.'}</p>
          )}
        </section>

        {/* Services list */}
        <section className="admin-card px-6 py-6">
          <div className="mb-5 flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#8df6c8]" />
            <h2 className="text-base font-semibold text-white">{isArabic ? 'الخدمات المتاحة' : 'Available Services'}</h2>
          </div>
          <p className="mb-4 text-xs text-slate-500">
            {isArabic
              ? 'سيتم تتبع طلبات الخدمة من خلال رسائل التواصل. الخدمات معروضة حسب الترتيب.'
              : 'Service requests come in via contact form/WhatsApp. Listed by display order.'}
          </p>
          {serviceList.length > 0 ? (
            <div className="space-y-2">
              {serviceList.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-2.5">
                  <span className="text-xs font-semibold text-[#8df6c8]">0{i + 1}</span>
                  <p className="text-sm text-white">{s.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">{isArabic ? 'لا توجد خدمات.' : 'No services yet.'}</p>
          )}
        </section>

      </div>
    </div>
  )
}
