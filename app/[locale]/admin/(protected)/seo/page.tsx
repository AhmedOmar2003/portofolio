import { createAdminClient } from '@/utils/supabase/admin'
import { BarChart3, Eye, FileText, Globe, Layers, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type PageViewRow = {
  path: string
  slug: string | null
  visitor_id: string
  created_at: string
  device_type: string | null
  browser_name: string | null
  browser_version: string | null
  os_name: string | null
  os_version: string | null
  country: string | null
  country_code: string | null
  region: string | null
  city: string | null
  timezone: string | null
  latitude: number | null
  longitude: number | null
  distance_km: number | null
}

type BreakdownItem = {
  label: string
  value: number
  detail?: string | null
}

type BreakdownCardProps = {
  title: string
  icon: LucideIcon
  items: BreakdownItem[]
  emptyMessage: string
  isArabic: boolean
}

function getCountryDisplay(row: PageViewRow, isArabic: boolean) {
  const code = row.country_code?.trim().toUpperCase()
  if (code) {
    try {
      const displayNames = new Intl.DisplayNames([isArabic ? 'ar' : 'en'], { type: 'region' })
      return displayNames.of(code) ?? row.country ?? code
    } catch {
      return row.country ?? code
    }
  }

  return row.country ?? null
}

function getDeviceDisplay(deviceType: string | null, isArabic: boolean) {
  if (!deviceType) return null
  if (!isArabic) return deviceType

  switch (deviceType.toLowerCase()) {
    case 'desktop':
      return 'سطح المكتب'
    case 'mobile':
      return 'موبايل'
    case 'tablet':
      return 'تابلت'
    default:
      return deviceType
  }
}

function getOsDisplay(osName: string | null, isArabic: boolean) {
  if (!osName) return null
  if (!isArabic) return osName

  switch (osName.toLowerCase()) {
    case 'windows':
      return 'ويندوز'
    case 'android':
      return 'أندرويد'
    case 'ios':
      return 'iOS'
    case 'macos':
      return 'ماك'
    case 'linux':
      return 'لينكس'
    default:
      return osName
  }
}

function buildBreakdown(
  rows: PageViewRow[],
  getKey: (row: PageViewRow) => string | null,
  getLabel: (row: PageViewRow) => string | null,
  getDetail?: (row: PageViewRow) => string | null,
  limit = 5,
) {
  const counts = new Map<string, BreakdownItem>()

  for (const row of rows) {
    const key = getKey(row)
    const label = getLabel(row)
    if (!key || !label) continue

    const existing = counts.get(key)
    if (existing) {
      existing.value += 1
      if (!existing.detail && getDetail) {
        const detail = getDetail(row)
        if (detail) existing.detail = detail
      }
      continue
    }

    counts.set(key, {
      label,
      value: 1,
      detail: getDetail?.(row) ?? null,
    })
  }

  return [...counts.values()].sort((a, b) => b.value - a.value).slice(0, limit)
}

function BreakdownCard({ title, icon: Icon, items, emptyMessage, isArabic }: BreakdownCardProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1)

  return (
    <section className="admin-card px-6 py-6">
      <div className="mb-5 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#8df6c8]" />
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => {
            const pct = Math.round((item.value / maxValue) * 100)

            return (
              <div key={`${item.label}-${index}`} className="flex items-center gap-3">
                <span className="w-5 text-xs font-semibold text-slate-600">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className={`truncate text-sm text-white ${isArabic ? 'text-right' : 'text-left'}`}>{item.label}</p>
                    <span className="text-xs font-medium text-slate-400">{item.value}</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-[#8df6c8]/50" style={{ width: `${Math.max(pct, 2)}%` }} />
                  </div>
                  {item.detail ? (
                    <p className="mt-1 text-[11px] text-slate-600">{item.detail}</p>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      )}
    </section>
  )
}

function formatDistance(value: number | null, isArabic: boolean) {
  if (value === null || Number.isNaN(value)) {
    return '—'
  }

  const formatted = new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US', {
    maximumFractionDigits: 1,
  }).format(value)

  return `${formatted} ${isArabic ? 'كم' : 'km'}`
}

function formatDateTime(value: string, isArabic: boolean) {
  return new Date(value).toLocaleString(isArabic ? 'ar-EG' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default async function AdminAnalyticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isArabic = locale === 'ar'
  const supabase = createAdminClient()

  const [
    { data: pageViewsRaw, error: pageViewsError, count: pageViewsCount },
    { data: projects },
    { data: services },
  ] = await Promise.all([
    supabase
      .from('page_views')
      .select(
        'path, slug, visitor_id, created_at, device_type, browser_name, browser_version, os_name, os_version, country, country_code, region, city, timezone, latitude, longitude, distance_km',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(0, 4999),
    supabase.from('projects').select('id, name_en, name_ar, slug'),
    supabase.from('services').select('id, title_en, title_ar, view_order'),
  ])

  const pageViews = (pageViewsRaw ?? []) as PageViewRow[]

  const totalViews = pageViewsCount ?? pageViews.length
  const uniqueVisitors = new Set(pageViews.map((view) => view.visitor_id)).size

  const distanceValues = pageViews
    .map((view) => view.distance_km)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
  const averageDistance =
    distanceValues.length > 0
      ? distanceValues.reduce((sum, value) => sum + value, 0) / distanceValues.length
      : null

  const pathCounts: Record<string, number> = {}
  pageViews.forEach((view) => {
    pathCounts[view.path] = (pathCounts[view.path] ?? 0) + 1
  })
  const topPages = Object.entries(pathCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([path, views]) => ({ path, views }))

  const slugCounts: Record<string, number> = {}
  pageViews.forEach((view) => {
    if (view.slug) slugCounts[view.slug] = (slugCounts[view.slug] ?? 0) + 1
  })

  const projectsWithViews = (projects ?? [])
    .map((project) => ({
      id: project.id,
      name: isArabic ? (project.name_ar || project.name_en) : project.name_en,
      slug: project.slug,
      views: slugCounts[project.slug] ?? 0,
    }))
    .sort((a, b) => b.views - a.views)

  const serviceList = (services ?? []).map((service) => ({
    id: service.id,
    name: isArabic ? (service.title_ar || service.title_en) : service.title_en,
  }))

  const topCountries = buildBreakdown(
    pageViews,
    (row) => {
      const countryCode = row.country_code?.trim()
      if (countryCode) return countryCode.toUpperCase()
      return row.country?.trim() || null
    },
    (row) => getCountryDisplay(row, isArabic),
    (row) => row.region?.trim() || null,
  )

  const topCities = buildBreakdown(
    pageViews,
    (row) => {
      const city = row.city?.trim()
      if (!city) return null
      const countryCode = row.country_code?.trim()
      const countryLabel = countryCode ? countryCode.toUpperCase() : (row.country?.trim() ?? '')
      return [city, row.region?.trim(), countryLabel]
        .filter(Boolean)
        .join('|')
    },
    (row) => row.city?.trim() || null,
    (row) => [row.region?.trim(), getCountryDisplay(row, isArabic)].filter(Boolean).join(', ') || null,
  )

  const topDevices = buildBreakdown(
    pageViews,
    (row) => row.device_type?.trim().toLowerCase() || null,
    (row) => getDeviceDisplay(row.device_type, isArabic),
  )

  const topBrowsers = buildBreakdown(
    pageViews,
    (row) => row.browser_name?.trim().toLowerCase() || null,
    (row) => row.browser_name?.trim() || null,
    (row) => row.browser_version?.trim() ? `v${row.browser_version.trim()}` : null,
  )

  const topSystems = buildBreakdown(
    pageViews,
    (row) => row.os_name?.trim().toLowerCase() || null,
    (row) => getOsDisplay(row.os_name, isArabic),
    (row) => row.os_version?.trim() ? `v${row.os_version.trim()}` : null,
  )

  const recentVisitors = pageViews.slice(0, 8)

  const last7 = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    return date.toISOString().split('T')[0]
  })
  const viewsByDay: Record<string, number> = {}
  last7.forEach((day) => {
    viewsByDay[day] = 0
  })
  pageViews.forEach((view) => {
    const day = new Date(view.created_at).toISOString().split('T')[0]
    if (day in viewsByDay) viewsByDay[day] += 1
  })
  const maxDay = Math.max(...Object.values(viewsByDay), 1)

  const summaryCards = [
    { label: isArabic ? 'إجمالي الزيارات' : 'Total Views', value: totalViews, icon: Eye },
    { label: isArabic ? 'زوار فريدون' : 'Unique Visitors', value: uniqueVisitors, icon: Globe },
    {
      label: isArabic ? 'الدولة الأعلى' : 'Top Country',
      value: topCountries[0]?.label ?? (isArabic ? 'غير متاح' : 'N/A'),
      icon: Globe,
    },
    {
      label: isArabic ? 'متوسط البعد التقريبي' : 'Avg. Distance',
      value: formatDistance(averageDistance, isArabic),
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="admin-kicker">{isArabic ? 'التحليلات' : 'Analytics'}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
          {isArabic ? 'إحصائيات الموقع' : 'Site Insights'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isArabic
            ? 'بيانات حقيقية من زوار موقعك — الجغرافيا، الأجهزة، المتصفحات، والصفحات الأكثر زيارة.'
            : 'Real visitor data — geolocation, devices, browsers, and the most-visited pages.'}
        </p>
        {pageViewsError ? (
          <p className="mt-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {isArabic
              ? `تعذر جلب بيانات التحليلات: ${pageViewsError.message}`
              : `Unable to load analytics data: ${pageViewsError.message}`}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summaryCards.map((stat) => {
          const valueIsString = typeof stat.value === 'string'

          return (
            <div key={stat.label} className="admin-card px-5 py-5">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#8df6c8]">
                <stat.icon className="h-4 w-4" />
              </div>
              <p
                className={`mt-4 font-semibold tracking-[-0.04em] text-white ${
                  valueIsString ? 'text-2xl' : 'text-3xl'
                }`}
              >
                {typeof stat.value === 'number'
                  ? new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US').format(stat.value)
                  : stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="admin-card px-6 py-6">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#8df6c8]" />
            <h2 className="text-base font-semibold text-white">
              {isArabic ? 'الزيارات – آخر 7 أيام' : 'Views – Last 7 Days'}
            </h2>
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

        <section className="admin-card px-6 py-6">
          <div className="mb-5 flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#8df6c8]" />
            <h2 className="text-base font-semibold text-white">{isArabic ? 'أكثر الصفحات زيارة' : 'Top Pages'}</h2>
          </div>
          {topPages.length > 0 ? (
            <div className="space-y-3">
              {topPages.map(({ path, views }, index) => {
                const pct = Math.round((views / topPages[0].views) * 100)

                return (
                  <div key={path} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-semibold text-slate-600">{index + 1}</span>
                    <div className="min-w-0 flex-1">
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
      </div>

      <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
        <BreakdownCard
          title={isArabic ? 'الدول الأكثر زيارة' : 'Top Countries'}
          icon={Globe}
          items={topCountries}
          emptyMessage={isArabic ? 'لا توجد بيانات دولة بعد.' : 'No country data yet.'}
          isArabic={isArabic}
        />

        <BreakdownCard
          title={isArabic ? 'المدن الأكثر زيارة' : 'Top Cities'}
          icon={Globe}
          items={topCities}
          emptyMessage={isArabic ? 'لا توجد بيانات مدينة بعد.' : 'No city data yet.'}
          isArabic={isArabic}
        />

        <BreakdownCard
          title={isArabic ? 'الأجهزة' : 'Devices'}
          icon={Eye}
          items={topDevices}
          emptyMessage={isArabic ? 'لا توجد بيانات أجهزة بعد.' : 'No device data yet.'}
          isArabic={isArabic}
        />

        <BreakdownCard
          title={isArabic ? 'المتصفحات' : 'Browsers'}
          icon={TrendingUp}
          items={topBrowsers}
          emptyMessage={isArabic ? 'لا توجد بيانات متصفح بعد.' : 'No browser data yet.'}
          isArabic={isArabic}
        />

        <BreakdownCard
          title={isArabic ? 'أنظمة التشغيل' : 'Operating Systems'}
          icon={Layers}
          items={topSystems}
          emptyMessage={isArabic ? 'لا توجد بيانات نظام تشغيل بعد.' : 'No operating system data yet.'}
          isArabic={isArabic}
        />

        <section className="admin-card px-6 py-6 2xl:col-span-3">
          <div className="mb-5 flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#8df6c8]" />
            <h2 className="text-base font-semibold text-white">
              {isArabic ? 'الزوار الأخيرة' : 'Recent Visitors'}
            </h2>
          </div>

          {recentVisitors.length > 0 ? (
            <div className="space-y-3">
              {recentVisitors.map((visitor) => {
                const countryLabel = getCountryDisplay(visitor, isArabic) ?? (isArabic ? 'غير معروف' : 'Unknown')
                const cityLabel = visitor.city?.trim()
                  ? [visitor.city.trim(), visitor.region?.trim(), countryLabel].filter(Boolean).join(' · ')
                  : [visitor.region?.trim(), countryLabel].filter(Boolean).join(' · ')
                const deviceLabel = getDeviceDisplay(visitor.device_type, isArabic) ?? (isArabic ? 'جهاز غير معروف' : 'Unknown device')
                const browserLabel = visitor.browser_name
                  ? `${visitor.browser_name}${visitor.browser_version ? ` ${visitor.browser_version}` : ''}`
                  : isArabic
                    ? 'متصفح غير معروف'
                    : 'Unknown browser'
                const osLabel = getOsDisplay(visitor.os_name, isArabic) ?? (isArabic ? 'نظام غير معروف' : 'Unknown OS')

                return (
                  <div
                    key={`${visitor.visitor_id}-${visitor.created_at}`}
                    className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm font-semibold text-white ${isArabic ? 'text-right' : 'text-left'}`}>
                          {cityLabel}
                        </p>
                        <p className={`mt-1 text-xs text-slate-500 ${isArabic ? 'text-right' : 'text-left'}`}>
                          {deviceLabel} · {browserLabel} · {osLabel}
                        </p>
                      </div>
                      <div className={`text-xs text-slate-500 ${isArabic ? 'text-right' : 'text-left'}`}>
                        <p>{formatDistance(visitor.distance_km, isArabic)}</p>
                        <p className="mt-1">{formatDateTime(visitor.created_at, isArabic)}</p>
                      </div>
                    </div>
                    <p className={`mt-2 truncate text-xs text-slate-600 ${isArabic ? 'text-right' : 'text-left'}`}>
                      {visitor.path}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              {isArabic ? 'لا توجد زيارات جديدة بعد.' : 'No recent visitors yet.'}
            </p>
          )}
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="admin-card px-6 py-6">
          <div className="mb-5 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#8df6c8]" />
            <h2 className="text-base font-semibold text-white">
              {isArabic ? 'أكثر المشاريع مشاهدة' : 'Most-Viewed Projects'}
            </h2>
          </div>
          {projectsWithViews.length > 0 ? (
            <div className="space-y-3">
              {projectsWithViews.slice(0, 6).map((project, index) => {
                const maxViews = projectsWithViews[0].views
                const pct = maxViews > 0 ? Math.round((project.views / maxViews) * 100) : 0

                return (
                  <div key={project.id} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-semibold text-slate-600">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white">{project.name}</p>
                      <div className="mt-1 h-1 rounded-full bg-white/8">
                        <div className="h-full rounded-full bg-[#8df6c8]/50" style={{ width: `${Math.max(pct, 2)}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-300">{project.views}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">{isArabic ? 'لا توجد مشاريع.' : 'No projects yet.'}</p>
          )}
        </section>

        <section className="admin-card px-6 py-6">
          <div className="mb-5 flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#8df6c8]" />
            <h2 className="text-base font-semibold text-white">
              {isArabic ? 'الخدمات المتاحة' : 'Available Services'}
            </h2>
          </div>
          <p className="mb-4 text-xs text-slate-500">
            {isArabic
              ? 'سيتم تتبع طلبات الخدمة من خلال رسائل التواصل. الخدمات معروضة حسب الترتيب.'
              : 'Service requests come in via contact form/WhatsApp. Listed by display order.'}
          </p>
          {serviceList.length > 0 ? (
            <div className="space-y-2">
              {serviceList.map((service, index) => (
                <div
                  key={service.id}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-2.5"
                >
                  <span className="text-xs font-semibold text-[#8df6c8]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm text-white">{service.name}</p>
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
