import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

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
    <div className="min-h-screen bg-brand-dark flex flex-col md:flex-row">
      <AdminSidebar locale={locale} />
      <div className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-white/10 bg-brand-dark/50 backdrop-blur-md sticky top-0 z-10 flex items-center px-8">
          <h2 className="text-white font-medium">Dashboard Overview</h2>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm text-white/60">{data.user.email}</div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
