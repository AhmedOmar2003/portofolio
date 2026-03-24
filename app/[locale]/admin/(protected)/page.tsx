import Link from 'next/link'
import { ArrowRight, Briefcase, Eye, FileText, Mail, Settings, Sparkles, Users } from 'lucide-react'

import { createClient } from '@/utils/supabase/server'

export default async function AdminOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  const [
    { count: projectsCount },
    { count: unreadMessagesCount },
    { count: servicesCount },
    { count: articlesCount },
    { count: totalViews },
    { data: recentMessages },
    { data: uniqueVisitors },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(4),
    supabase.from('page_views').select('visitor_id'),
  ])

  const uniqueVisitorsCount = new Set(uniqueVisitors?.map((entry) => entry.visitor_id) || []).size

  const stats = [
    { label: 'Total Views', value: totalViews || 0, icon: Eye },
    { label: 'Unique Visitors', value: uniqueVisitorsCount, icon: Users },
    { label: 'Projects', value: projectsCount || 0, icon: Briefcase },
    { label: 'Unread Messages', value: unreadMessagesCount || 0, icon: Mail },
  ]

  const controlAreas = [
    { title: 'Hero & Brand', description: 'Update the first impression, hero copy, logo, and links.', href: `/${locale}/admin/settings`, icon: Sparkles },
    { title: 'About & Skills', description: 'Control biography, skills, tools, and experience timeline.', href: `/${locale}/admin/about`, icon: Users },
    { title: 'Projects', description: 'Manage featured work, case studies, links, and media.', href: `/${locale}/admin/projects`, icon: Briefcase },
    { title: 'Articles', description: 'Publish insights, essays, and thought leadership content.', href: `/${locale}/admin/articles`, icon: FileText },
    { title: 'Services', description: 'Keep expertise cards and offer structure aligned with the site.', href: `/${locale}/admin/services`, icon: Settings },
    { title: 'Contact', description: 'Edit methods, social links, and inbound contact paths.', href: `/${locale}/admin/contact`, icon: Mail },
  ]

  return (
    <div className="space-y-8">
      <section className="admin-card px-6 py-8 md:px-8">
        <p className="admin-kicker">Overview</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">Portfolio control center</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
          Monitor traffic, manage featured content, and keep every part of the portfolio consistent with the public experience.
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
              <p className="admin-kicker">Content Areas</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Manage every part of the portfolio</h2>
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
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-card px-6 py-7">
          <p className="admin-kicker">Recent Messages</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Inbox snapshot</h2>

          <div className="mt-6 space-y-4">
            {recentMessages && recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <div key={message.id} className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{message.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(message.created_at).toLocaleDateString('en-US')}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${message.status === 'new' ? 'bg-emerald-400/10 text-emerald-200' : 'bg-white/8 text-slate-400'}`}>
                      {message.status || 'new'}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{message.message}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-slate-500">
                No recent messages yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
