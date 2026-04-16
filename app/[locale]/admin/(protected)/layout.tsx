import { redirect } from 'next/navigation'

import AdminSidebar from '@/components/admin/AdminSidebar'
import { getAdminSession } from '@/utils/admin-auth'

export default async function ProtectedAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getAdminSession()

  if (!session) {
    redirect(`/${locale}/admin/login`)
  }

  return (
    <div className="admin-shell min-h-screen md:flex">
      <AdminSidebar locale={locale} />
      <div className="min-w-0 flex-1">
        <main className="px-6 py-8 md:px-8">{children}</main>
      </div>
    </div>
  )
}
