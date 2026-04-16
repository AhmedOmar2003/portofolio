import Link from 'next/link'
import { ArrowRight, Briefcase, Eye, FileText, Mail, MessageSquare, Layers, Settings, User, Users } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function AdminOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isArabic = locale === 'ar'
  const dateLocale = isArabic ? 'ar-EG' : 'en-US'
  const supabase = await createClient()

  const [
    { count: projectsCount },
    { count: unreadMessagesCount },
    { count: totalViews },
    { data: recentMessages },
    { data: uniqueVisitorsData },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('id, name, email, message, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('page_views').select('visitor_id'),
  ])

  const uniqueVisitorsCount = new Set(uniqueVisitorsData?.map((e) => e.visitor_id) ?? []).size

  const stats = [
    { label: isArabic ? 'إجمالي الزيارات'   : 'Total Views',       value: totalViews ?? 0,       icon: Eye,   accent: false },
    { label: isArabic ? 'زوار فريدون'        : 'Unique Visitors',   value: uniqueVisitorsCount,    icon: Users, accent: false },
    { label: isArabic ? 'المشاريع'           : 'Projects',          value: projectsCount ?? 0,     icon: Briefcase, accent: false },
    { label: isArabic ? 'رسائل جديدة'        : 'New Messages',      value: unreadMessagesCount ?? 0, icon: Mail, accent: (unreadMessagesCount ?? 0) > 0 },
  ]

  const navLinks = [
    { title: isArabic ? 'الهيرو والهوية'  : 'Hero & Brand',   href: `/${locale}/admin/settings`,  icon: Settings,      hint: isArabic ? 'العنوان، اللوجو، الروابط' : 'Headline, logo, social links' },
    { title: isArabic ? 'عني'             : 'About',           href: `/${locale}/admin/about`,     icon: User,          hint: isArabic ? 'رحلتي ومبادئي وما أقدمه' : 'Journey, principles, offer' },
    { title: isArabic ? 'المشاريع'        : 'Projects',        href: `/${locale}/admin/projects`,  icon: Briefcase,     hint: isArabic ? 'دراسات الحالة والصور' : 'Case studies & gallery' },
    { title: isArabic ? 'الخدمات'         : 'Services',        href: `/${locale}/admin/services`,  icon: Layers,        hint: isArabic ? 'بطاقات الخدمات وصورها' : 'Service cards & images' },
    { title: isArabic ? 'المقالات'        : 'Articles',        href: `/${locale}/admin/articles`,  icon: FileText,      hint: isArabic ? 'كتابات ورؤى' : 'Writing and insights' },
    { title: isArabic ? 'التواصل'         : 'Contact',         href: `/${locale}/admin/contact`,   icon: MessageSquare, hint: isArabic ? 'وسائل التواصل' : 'Contact methods' },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="admin-kicker">{isArabic ? 'نظرة عامة' : 'Overview'}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
          {isArabic ? 'لوحة تحكم البورتفوليو' : 'Portfolio Dashboard'}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`admin-card flex flex-col justify-between px-5 py-5 ${stat.accent ? 'border-emerald-400/20 bg-emerald-400/[0.04]' : ''}`}
            >
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${stat.accent ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-white/10 bg-white/[0.04] text-[#8df6c8]'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-4">
                <p className={`text-3xl font-semibold tracking-[-0.04em] ${stat.accent ? 'text-emerald-300' : 'text-white'}`}>
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">

        {/* Content navigation */}
        <section className="admin-card px-6 py-6">
          <h2 className="mb-5 text-base font-semibold text-white">{isArabic ? 'إدارة المحتوى' : 'Content Management'}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3.5 transition hover:border-white/14 hover:bg-white/[0.05]"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#8df6c8]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{link.title}</p>
                    <p className="truncate text-xs text-slate-500">{link.hint}</p>
                  </div>
                  <ArrowRight className={`ml-auto h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-[#8df6c8] ${isArabic ? 'rtl-flip' : ''}`} />
                </Link>
              )
            })}
          </div>

          {/* Analytics shortcut */}
          <Link
            href={`/${locale}/admin/seo`}
            className="group mt-4 flex items-center justify-between rounded-2xl border border-[#8df6c8]/10 bg-[#8df6c8]/[0.03] px-4 py-3.5 transition hover:border-[#8df6c8]/20 hover:bg-[#8df6c8]/[0.06]"
          >
            <div>
              <p className="text-sm font-semibold text-[#8df6c8]">{isArabic ? 'التحليلات والإحصائيات' : 'Analytics & Insights'}</p>
              <p className="text-xs text-slate-500">{isArabic ? 'أكثر المشاريع والخدمات والصفحات مشاهدة' : 'Top projects, services & page visits'}</p>
            </div>
            <ArrowRight className={`h-4 w-4 shrink-0 text-[#8df6c8] transition ${isArabic ? 'rtl-flip' : 'group-hover:translate-x-1'}`} />
          </Link>
        </section>

        {/* Inbox */}
        <section className="admin-card px-6 py-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">{isArabic ? 'آخر الرسائل' : 'Recent Messages'}</h2>
            <Link href={`/${locale}/admin/messages`} className="text-xs text-[#8df6c8] hover:underline">
              {isArabic ? 'الكل' : 'View all'}
            </Link>
          </div>

          {recentMessages && recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{msg.name}</p>
                    {msg.status === 'new' && (
                      <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        {isArabic ? 'جديد' : 'new'}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{msg.message}</p>
                  <p className="mt-2 text-[10px] text-slate-600">
                    {new Date(msg.created_at).toLocaleDateString(dateLocale)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-slate-500">
              {isArabic ? 'لا توجد رسائل بعد.' : 'No messages yet.'}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
