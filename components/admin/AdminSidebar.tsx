'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Layers, 
  FileText, 
  MessageSquare, 
  Settings,
  LogOut
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navItems = [
    { name: 'Overview', href: `/${locale}/admin`, icon: LayoutDashboard },
    { name: 'About', href: `/${locale}/admin/about`, icon: User },
    { name: 'Projects', href: `/${locale}/admin/projects`, icon: Briefcase },
    { name: 'Services', href: `/${locale}/admin/services`, icon: Layers },
    { name: 'Articles', href: `/${locale}/admin/articles`, icon: FileText },
    { name: 'Contact Methods', href: `/${locale}/admin/contact`, icon: MessageSquare },
    { name: 'Settings', href: `/${locale}/admin/settings`, icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push(`/${locale}/admin/login`)
    router.refresh()
  }

  return (
    <aside className="w-full md:w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold font-serif italic text-white">Nasq Admin</h1>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          // Exact match for overview, startsWith for others to highlight correctly
          const isActive = item.href === `/${locale}/admin` 
            ? pathname === item.href
            : pathname.startsWith(item.href)

          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-brand-primary/10 text-brand-primary' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="absolute left-0 w-1 h-8 bg-brand-primary rounded-r-full" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
