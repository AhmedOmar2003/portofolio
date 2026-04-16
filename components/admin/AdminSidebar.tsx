'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Layers,
  LogOut,
  Mail,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  User
} from 'lucide-react'

import BrandMark from '@/components/ui/BrandMark'

export default function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const isArabic = locale === 'ar'

  const navItems = [
    {
      name: isArabic ? 'نظرة عامة' : 'Overview',
      hint: isArabic ? 'حالة البورتفوليو' : 'Portfolio status',
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
    },
    {
      name: isArabic ? 'الهيرو والهوية' : 'Hero & Brand',
      hint: isArabic ? 'العنوان، اللوجو، الروابط' : 'Hero, logo, social',
      href: `/${locale}/admin/settings`,
      icon: Sparkles,
    },
    {
      name: isArabic ? 'عني والمهارات' : 'About & Skills',
      hint: isArabic ? 'نبذة، أدوات، خبرات' : 'Bio, tools, experience',
      href: `/${locale}/admin/about`,
      icon: User,
    },
    {
      name: isArabic ? 'المشاريع' : 'Projects',
      hint: isArabic ? 'دراسات الحالة' : 'Case studies',
      href: `/${locale}/admin/projects`,
      icon: Briefcase,
    },
    {
      name: isArabic ? 'الخدمات' : 'Services',
      hint: isArabic ? 'بطاقات الخدمات' : 'Expertise cards',
      href: `/${locale}/admin/services`,
      icon: Layers,
    },
    {
      name: isArabic ? 'المقالات' : 'Articles',
      hint: isArabic ? 'كتابات ورؤى' : 'Writing and insights',
      href: `/${locale}/admin/articles`,
      icon: FileText,
    },
    {
      name: isArabic ? 'التواصل' : 'Contact',
      hint: isArabic ? 'الوسائل وأزرار التواصل' : 'Methods and CTA paths',
      href: `/${locale}/admin/contact`,
      icon: MessageSquare,
    },
    {
      name: isArabic ? 'الرسائل' : 'Inbox',
      hint: isArabic ? 'رسائل الزوار' : 'Messages',
      href: `/${locale}/admin/messages`,
      icon: Mail,
    },
    {
      name: isArabic ? 'SEO والأداء' : 'SEO & Perf',
      hint: isArabic ? 'البحث والتحليلات' : 'Search and tracking',
      href: `/${locale}/admin/seo`,
      icon: Search,
    },
  ]

  const handleLogout = async () => {
    await fetch('/api/admin-auth/logout', {
      method: 'POST',
    })
    router.push(`/${locale}/admin/login`)
    router.refresh()
  }

  return (
    <aside className="w-full border-b border-white/8 bg-[rgba(4,7,15,0.86)] md:sticky md:top-0 md:h-screen md:w-[320px] md:border-b-0 md:border-r">
      <div className="flex h-full flex-col px-5 py-5">
        <div className="mb-6 rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5">
          <BrandMark />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {isArabic ? 'إدارة المحتوى' : 'Portfolio CMS'}
          </p>
          <h1 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
            {isArabic ? 'لوحة تحكم أحمد عصام' : 'Ahmed Essam Admin'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {isArabic
              ? 'إدارة البورتفوليو بشكل منظم: محتوى واضح، شكل احترافي، وتحديثات سهلة.'
              : 'Manage the portfolio like a product: clear structure, polished content, and scalable updates.'}
          </p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto" aria-label="Admin navigation">
          {navItems.map((item) => {
            const isActive = item.href === `/${locale}/admin` ? pathname === item.href : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-start gap-3 rounded-[1.25rem] border px-4 py-3 transition ${
                  isActive
                    ? 'border-[#8df6c8]/20 bg-[linear-gradient(135deg,rgba(141,246,200,0.14),rgba(106,215,255,0.08))]'
                    : 'border-transparent bg-transparent hover:border-white/8 hover:bg-white/[0.04]'
                }`}
              >
                <span className={`mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${isActive ? 'border-[#8df6c8]/20 bg-[#8df6c8]/10 text-[#8df6c8]' : 'border-white/8 bg-white/[0.03] text-slate-400 group-hover:text-white'}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className={`block text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-200'}`}>{item.name}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{item.hint}</span>
                </span>
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-[1.15rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-rose-400/20 hover:bg-rose-400/10 hover:text-rose-200"
        >
          <LogOut className="h-4 w-4" />
          {isArabic ? 'تسجيل الخروج' : 'Logout'}
        </button>
      </div>
    </aside>
  )
}
