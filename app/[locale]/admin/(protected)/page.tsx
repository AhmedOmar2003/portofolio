import Link from 'next/link'
import { ArrowRight, Briefcase, Eye, FileText, Mail, Settings, Sparkles, Users } from 'lucide-react'

import { createClient } from '@/utils/supabase/server'

export default async function AdminOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isArabic = locale === 'ar'
  const dateLocale = isArabic ? 'ar-EG' : 'en-US'
  const supabase = await createClient()

  const copy = isArabic
    ? {
        stats: {
          totalViews: 'إجمالي الزيارات',
          uniqueVisitors: 'زوار فريدين',
          projects: 'المشاريع',
          unreadMessages: 'رسائل جديدة',
        },
        areas: {
          hero: 'الهيرو والهوية',
          about: 'عني والمهارات',
          projects: 'المشاريع',
          articles: 'المقالات',
          services: 'الخدمات',
          contact: 'التواصل',
        },
        areaDescriptions: {
          hero: 'حدّث الانطباع الأول: العنوان، اللوجو، والروابط.',
          about: 'تحكم في النبذة، المهارات، الأدوات، والخبرة.',
          projects: 'إدارة المشاريع المميزة ودراسات الحالة والميديا.',
          articles: 'انشر مقالاتك وأفكارك المهنية بشكل منظم.',
          services: 'نظّم بطاقات الخدمات بما يتماشى مع الموقع.',
          contact: 'عدّل وسائل التواصل ومسارات التواصل معاك.',
        },
        overviewKicker: 'نظرة عامة',
        overviewTitle: 'لوحة إدارة البورتفوليو',
        overviewSubtitle:
          'تابع أداء الموقع، ونظّم المحتوى المميز، وحافظ على تجربة متسقة بين الموقع العام ولوحة الإدارة.',
        contentKicker: 'أقسام المحتوى',
        contentTitle: 'إدارة كل جزء في البورتفوليو',
        open: 'افتح',
        inboxKicker: 'آخر الرسائل',
        inboxTitle: 'ملخص صندوق الوارد',
        noMessages: 'لسه مفيش رسائل جديدة.',
        statusNew: 'جديد',
      }
    : {
        stats: {
          totalViews: 'Total Views',
          uniqueVisitors: 'Unique Visitors',
          projects: 'Projects',
          unreadMessages: 'Unread Messages',
        },
        areas: {
          hero: 'Hero & Brand',
          about: 'About & Skills',
          projects: 'Projects',
          articles: 'Articles',
          services: 'Services',
          contact: 'Contact',
        },
        areaDescriptions: {
          hero: 'Update the first impression, hero copy, logo, and links.',
          about: 'Control biography, skills, tools, and experience timeline.',
          projects: 'Manage featured work, case studies, links, and media.',
          articles: 'Publish insights, essays, and thought leadership content.',
          services: 'Keep expertise cards and offer structure aligned with the site.',
          contact: 'Edit methods, social links, and inbound contact paths.',
        },
        overviewKicker: 'Overview',
        overviewTitle: 'Portfolio control center',
        overviewSubtitle:
          'Monitor traffic, manage featured content, and keep every part of the portfolio consistent with the public experience.',
        contentKicker: 'Content Areas',
        contentTitle: 'Manage every part of the portfolio',
        open: 'Open',
        inboxKicker: 'Recent Messages',
        inboxTitle: 'Inbox snapshot',
        noMessages: 'No recent messages yet.',
        statusNew: 'new',
      }

  const [
    { count: projectsCount },
    { count: unreadMessagesCount },
    { count: totalViews },
    { data: recentMessages },
    { data: uniqueVisitors },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(4),
    supabase.from('page_views').select('visitor_id'),
  ])

  const uniqueVisitorsCount = new Set(uniqueVisitors?.map((entry) => entry.visitor_id) || []).size

  const stats = [
    { label: copy.stats.totalViews, value: totalViews || 0, icon: Eye },
    { label: copy.stats.uniqueVisitors, value: uniqueVisitorsCount, icon: Users },
    { label: copy.stats.projects, value: projectsCount || 0, icon: Briefcase },
    { label: copy.stats.unreadMessages, value: unreadMessagesCount || 0, icon: Mail },
  ]

  const controlAreas = [
    { title: copy.areas.hero, description: copy.areaDescriptions.hero, href: `/${locale}/admin/settings`, icon: Sparkles },
    { title: copy.areas.about, description: copy.areaDescriptions.about, href: `/${locale}/admin/about`, icon: Users },
    { title: copy.areas.projects, description: copy.areaDescriptions.projects, href: `/${locale}/admin/projects`, icon: Briefcase },
    { title: copy.areas.articles, description: copy.areaDescriptions.articles, href: `/${locale}/admin/articles`, icon: FileText },
    { title: copy.areas.services, description: copy.areaDescriptions.services, href: `/${locale}/admin/services`, icon: Settings },
    { title: copy.areas.contact, description: copy.areaDescriptions.contact, href: `/${locale}/admin/contact`, icon: Mail },
  ]

  return (
    <div className="space-y-8">
      <section className="admin-card px-6 py-8 md:px-8">
        <p className="admin-kicker">{copy.overviewKicker}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">{copy.overviewTitle}</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
          {copy.overviewSubtitle}
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card px-5 py-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#8df6c8]">
                <stat.icon className="h-5 w-5" />
              </span>
              <span className="text-3xl font-semibold tracking-[-0.04em] text-white">{stat.value}</span>
            </div>
            <p className="mt-4 text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <div className="admin-card px-6 py-7 md:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="admin-kicker">{copy.contentKicker}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{copy.contentTitle}</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {controlAreas.map((area) => (
              <Link
                key={area.title}
                href={area.href}
                className="group rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-5 transition hover:border-[#8df6c8]/20 hover:bg-white/[0.05]"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/10 text-[#8df6c8]">
                  <area.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">{area.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{area.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8df6c8]">
                  {copy.open}
                  <ArrowRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isArabic ? 'rtl-flip group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                    }`}
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-card px-6 py-7">
          <p className="admin-kicker">{copy.inboxKicker}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{copy.inboxTitle}</h2>

          <div className="mt-6 space-y-4">
            {recentMessages && recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <div key={message.id} className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{message.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(message.created_at).toLocaleDateString(dateLocale)}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${message.status === 'new' ? 'bg-emerald-400/10 text-emerald-200' : 'bg-white/8 text-slate-400'}`}>
                      {message.status === 'new' && isArabic ? copy.statusNew : message.status || copy.statusNew}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{message.message}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-slate-500">
                {copy.noMessages}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
