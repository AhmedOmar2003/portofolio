'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Edit2, Loader2, Plus, Star, Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'

import { createClient } from '@/utils/supabase/client'
import { isArabicLocale } from '@/utils/locale-content'
import { getServiceTypeLabel, normalizeServiceType, type ServiceType } from '@/utils/service-type'

type ServiceItem = {
  id: string
  title_en: string | null
  title_ar?: string | null
  icon_image_url: string | null
  service_type: ServiceType
  view_order: number
  is_featured: boolean
}

export default function ServicesListPage() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()
  const params = useParams<{ locale: string }>()
  const locale = params?.locale || 'en'

  useEffect(() => {
    void fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const withTypeQuery = await supabase
        .from('services')
        .select('id, title_en, title_ar, icon_image_url, service_type, view_order, is_featured')
        .order('view_order', { ascending: true })

      const fallbackQuery = withTypeQuery.error
        ? await supabase
            .from('services')
            .select('id, title_en, title_ar, icon_image_url, view_order, is_featured')
            .order('view_order', { ascending: true })
        : null

      const rows = (withTypeQuery.error ? fallbackQuery?.data || [] : withTypeQuery.data || []) as Array<Record<string, unknown>>

      setServices(
        (rows || []).map((service) => ({
          id: String(service.id || ''),
          title_en: typeof service.title_en === 'string' ? service.title_en : null,
          title_ar: typeof service.title_ar === 'string' ? service.title_ar : null,
          icon_image_url: typeof service.icon_image_url === 'string' ? service.icon_image_url : null,
          view_order: typeof service.view_order === 'number' ? service.view_order : 0,
          is_featured: Boolean(service.is_featured),
          service_type: normalizeServiceType((service as { service_type?: unknown }).service_type),
        }))
      )
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    setDeletingId(id)
    try {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
      setServices((prev) => prev.filter((service) => service.id !== id))
    } catch (error) {
      console.error('Error deleting service:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) return
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...services]
    ;[updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]]
    const currentOrder = updated[index].view_order
    updated[index].view_order = updated[swapIndex].view_order
    updated[swapIndex].view_order = currentOrder
    setServices(updated)

    await Promise.all([
      supabase.from('services').update({ view_order: updated[index].view_order }).eq('id', updated[index].id),
      supabase.from('services').update({ view_order: updated[swapIndex].view_order }).eq('id', updated[swapIndex].id),
    ])
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8df6c8]" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="admin-kicker">Services</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">Expertise library</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">Keep the public expertise section concise, relevant, and ordered by strategic importance.</p>
        </div>
        <Link href="./services/new" className="btn btn-primary w-fit text-sm">
          <Plus className="h-4 w-4" />
          Add service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="admin-card px-6 py-12 text-center text-sm text-slate-500">No services yet.</div>
      ) : (
        <div className="space-y-4">
          {services.map((service, index) => {
            const localizedTitle = isArabicLocale(locale)
              ? service.title_ar || service.title_en
              : service.title_en || service.title_ar
            const safeTitle = localizedTitle || ''

            return (
              <article key={service.id} className="admin-card px-5 py-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button type="button" onClick={() => void moveOrder(index, 'up')} disabled={index === 0} className="rounded-lg border border-white/8 bg-white/[0.03] p-1.5 text-slate-300 transition hover:text-white disabled:opacity-30">
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => void moveOrder(index, 'down')} disabled={index === services.length - 1} className="rounded-lg border border-white/8 bg-white/[0.03] p-1.5 text-slate-300 transition hover:text-white disabled:opacity-30">
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                      {service.icon_image_url ? (
                        <Image
                          src={service.icon_image_url}
                          alt={safeTitle}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-500">No icon</span>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-white">{safeTitle}</h2>
                      <span className="inline-flex items-center rounded-full border border-sky-300/50 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-100">
                        {getServiceTypeLabel(service.service_type, locale)}
                      </span>
                      {service.is_featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#8df6c8]/20 bg-[#8df6c8]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8df6c8]">
                          <Star className="h-3 w-3" />
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Display order: {service.view_order}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link href={`./services/${service.id}`} className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-slate-200 transition hover:border-white/14 hover:text-white">
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Link>
                    <button type="button" onClick={() => void handleDelete(service.id)} disabled={deletingId === service.id} className="inline-flex items-center gap-2 rounded-xl border border-rose-400/10 bg-rose-400/5 px-3 py-2 text-sm text-rose-200 transition hover:border-rose-400/20 hover:bg-rose-400/10 disabled:opacity-60">
                      {deletingId === service.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
