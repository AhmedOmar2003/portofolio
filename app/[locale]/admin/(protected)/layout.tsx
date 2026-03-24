import { redirect } from 'next/navigation'

import AdminSidebar from '@/components/admin/AdminSidebar'
import { createClient } from '@/utils/supabase/server'

export default async function ProtectedAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect(`/${locale}/admin/login`)
  }

  return (
    <div className="admin-shell min-h-screen md:flex">
      <AdminSidebar locale={locale} />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-white/8 bg-[rgba(5,8,18,0.78)] px-6 py-4 backdrop-blur-2xl md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Internal Tool</p>
              <h2 className="mt-1 text-lg font-semibold text-white">Portfolio Management Dashboard</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">
              {data.user.email}
            </div>
          </div>
        </header>

        <main className="px-6 py-8 md:px-8">{children}</main>
      </div>
    </div>
  )
}
