import { createClient } from '@/utils/supabase/server'

import Link from 'next/link'
import { ArrowRight, Briefcase, FileText, Layers, Eye } from 'lucide-react'

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  // Fetch basic stats
  const [{ count: projectsCount }, { count: articlesCount }, { count: servicesCount }] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true })
  ])

  const stats = [
    { label: 'Total Projects', value: projectsCount || 0, icon: Briefcase, href: 'projects' },
    { label: 'Published Articles', value: articlesCount || 0, icon: FileText, href: 'articles' },
    { label: 'Active Services', value: servicesCount || 0, icon: Layers, href: 'services' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-white/60">Here&apos;s what&apos;s happening with your portfolio today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between group hover:border-brand-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/10 rounded-xl text-white">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-4xl font-bold font-serif text-white">{stat.value}</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-white/80 font-medium">{stat.label}</span>
              <Link href={`./admin/${stat.href}`} className="text-brand-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Manage <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
         <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="./admin/projects/new" className="flex items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors gap-2">
              <Briefcase className="w-5 h-5"/> New Project
            </Link>
            <Link href="./admin/articles/new" className="flex items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors gap-2">
              <FileText className="w-5 h-5"/> New Article
            </Link>
            <Link href="/" target="_blank" className="flex items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors gap-2">
              <Eye className="w-5 h-5"/> View Live Site
            </Link>
         </div>
      </div>
    </div>
  )
}
