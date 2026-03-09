import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowRight, Briefcase, Users, Mail, Eye, Activity } from 'lucide-react'

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  // Fetch all stats concurrently for speed
  const [
    { count: projectsCount }, 
    { count: unreadMessagesCount },
    { data: recentMessages },
    { count: totalViews },
    { data: uniqueVisitors }
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('page_views').select('visitor_id') // We will process this in JS since Supabase exact distinct counts are trickier natively
  ])

  // Process unique visitors
  const uniqueVisitorSet = new Set(uniqueVisitors?.map(v => v.visitor_id) || [])
  const uniqueVisitorsCount = uniqueVisitorSet.size

  const stats = [
    { label: 'Total Views', value: totalViews || 0, icon: Eye, href: '#', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Unique Visitors', value: uniqueVisitorsCount, icon: Users, href: '#', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Unread Messages', value: unreadMessagesCount || 0, icon: Mail, href: '/messages', color: 'text-green-400', bg: 'bg-green-500/10', isAlert: (unreadMessagesCount || 0) > 0 },
    { label: 'Total Projects', value: projectsCount || 0, icon: Briefcase, href: '/projects', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-white/60">Monitor your portfolio traffic, engagement, and messages.</p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`relative bg-white/5 border ${stat.isAlert ? 'border-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.1)]' : 'border-white/10'} rounded-2xl p-6 flex flex-col justify-between group hover:border-white/20 transition-all`}>
            {stat.isAlert && <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span></span>}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-4xl font-bold font-serif text-white">{stat.value}</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-white/80 font-medium">{stat.label}</span>
              {stat.href !== '#' && (
                <Link href={`./admin${stat.href}`} className="text-white/40 hover:text-white text-sm font-medium flex items-center transition-colors">
                  View <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trend / Analytics Placeholder */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-xl font-bold text-white flex items-center gap-2"><Activity className="text-blue-400 w-5 h-5"/> Traffic Overview (Last 7 Days)</h2>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto mix-blend-screen opacity-70">
            {/* Simple CSS Bar Chart Simulation */}
            {[40, 65, 30, 85, 55, 90, 45].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                 <div className="w-full bg-blue-500/20 rounded-t-sm group-hover:bg-blue-400/40 transition-colors relative" style={{ height: `${height}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{height * 3}</div>
                 </div>
                 <span className="text-xs text-white/40">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Mail className="text-green-400 w-5 h-5"/> Recent Messages</h2>
            <Link href="./admin/messages" className="text-xs text-brand-primary hover:underline">View All</Link>
          </div>
          
          <div className="flex-1 space-y-4">
            {recentMessages && recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div key={msg.id} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white text-sm truncate pr-2">{msg.name}</span>
                    <span className="text-[10px] text-white/40 whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-white/60 line-clamp-2">{msg.message}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/40">
                <Mail className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">No new messages</p>
              </div>
            )}
          </div>
        </div>
        
      </div>

    </div>
  )
}
