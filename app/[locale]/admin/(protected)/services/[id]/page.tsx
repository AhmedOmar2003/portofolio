'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

import MediaUpload from '@/components/admin/MediaUpload'
import { createClient } from '@/utils/supabase/client'

type MessageState = { type: 'success' | 'error'; text: string } | null

export default function ServiceEditorPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const resolvedParams = use(params)
  const { locale, id } = resolvedParams
  const isNew = id === 'new'
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<MessageState>(null)
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    detailed_content_en: '',
    detailed_content_ar: '',
    icon_image_url: '',
    is_featured: false,
    view_order: 0,
  })

  useEffect(() => {
    if (!isNew) {
      void fetchService()
    } else {
      void fetchMaxOrder()
    }
  }, [id, isNew])

  const fetchService = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').eq('id', id).single()
      if (error) throw error
      setFormData({
        title_en: data.title_en || '',
        title_ar: data.title_ar || '',
        description_en: data.description_en || '',
        description_ar: data.description_ar || '',
        detailed_content_en: data.detailed_content_en || '',
        detailed_content_ar: data.detailed_content_ar || '',
        icon_image_url: data.icon_image_url || '',
        is_featured: data.is_featured || false,
        view_order: data.view_order || 0,
      })
    } catch (error) {
      console.error('Error fetching service:', error)
      setMessage({ type: 'error', text: 'Failed to load the service.' })
    } finally {
      setLoading(false)
    }
  }

  const fetchMaxOrder = async () => {
    const { data } = await supabase.from('services').select('view_order').order('view_order', { ascending: false }).limit(1)
    setFormData((prev) => ({ ...prev, view_order: data?.[0]?.view_order ? data[0].view_order + 1 : 0 }))
    setLoading(false)
  }

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.title_en) {
      setMessage({ type: 'error', text: 'Service title is required.' })
      return
    }

    setSaving(true)
    setMessage(null)

    const payload = {
      title_en: formData.title_en,
      title_ar: formData.title_ar,
      description_en: formData.description_en,
      description_ar: formData.description_ar,
      detailed_content_en: formData.detailed_content_en,
      detailed_content_ar: formData.detailed_content_ar,
      icon_image_url: formData.icon_image_url,
      is_featured: formData.is_featured,
      view_order: formData.view_order,
    }

    try {
      if (isNew) {
        const { error } = await supabase.from('services').insert([payload])
        if (error) throw error
        setMessage({ type: 'success', text: 'Service created successfully.' })
        setTimeout(() => router.push(`/${locale}/admin/services`), 1200)
      } else {
        const { error } = await supabase.from('services').update(payload).eq('id', id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Service updated successfully.' })
      }
    } catch (error) {
      console.error('Error saving service:', error)
      setMessage({ type: 'error', text: 'Failed to save the service.' })
    } finally {
      setSaving(false)
    }
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
      <Link href={`/${locale}/admin/services`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to services
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="admin-kicker">Services</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">{isNew ? 'Create service' : 'Edit service'}</h1>
        </div>
        <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary w-fit text-sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save service'}
        </button>
      </div>

      {message ? (
        <div className={`rounded-[1.15rem] border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/20 bg-rose-400/10 text-rose-200'}`}>
          {message.text}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <section className="admin-card px-6 py-6">
          <h2 className="text-xl font-semibold text-white">Service details</h2>
          <div className="mt-6 grid gap-5">
            <div>
              <label className="admin-label">Title (English)</label>
              <input className="admin-input" value={formData.title_en} onChange={(e) => handleChange('title_en', e.target.value)} />
            </div>
            <div>
              <label className="admin-label">العنوان (العربية)</label>
              <input
                dir="rtl"
                className="admin-input text-right"
                value={formData.title_ar}
                onChange={(e) => handleChange('title_ar', e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Short description (English)</label>
              <textarea className="admin-textarea min-h-[140px]" value={formData.description_en} onChange={(e) => handleChange('description_en', e.target.value)} />
            </div>
            <div>
              <label className="admin-label">الوصف المختصر (العربية)</label>
              <textarea
                dir="rtl"
                className="admin-textarea min-h-[140px] text-right"
                value={formData.description_ar}
                onChange={(e) => handleChange('description_ar', e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Detailed content / deliverables (English)</label>
              <textarea className="admin-textarea min-h-[220px]" value={formData.detailed_content_en} onChange={(e) => handleChange('detailed_content_en', e.target.value)} placeholder="Use one line per deliverable or supporting point." />
            </div>
            <div>
              <label className="admin-label">المحتوى التفصيلي / المخرجات (العربية)</label>
              <textarea
                dir="rtl"
                className="admin-textarea min-h-[220px] text-right"
                value={formData.detailed_content_ar}
                onChange={(e) => handleChange('detailed_content_ar', e.target.value)}
                placeholder="اكتب كل نقطة في سطر مستقل."
              />
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Display settings</h2>
            <div className="mt-6 space-y-5">
              <div>
                <label className="admin-label">Display order</label>
                <input type="number" className="admin-input" value={formData.view_order} onChange={(e) => handleChange('view_order', Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-3">
                <input id="featured-service" type="checkbox" checked={formData.is_featured} onChange={(e) => handleChange('is_featured', e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-black/20 accent-[var(--color-green-accent)]" />
                <label htmlFor="featured-service" className="text-sm text-slate-300">Feature this service on the homepage</label>
              </div>
            </div>
          </section>

          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Service icon</h2>
            <div className="mt-6">
              <MediaUpload
                bucket="portfolio-media"
                folder="services"
                accept="image/*"
                currentUrl={formData.icon_image_url}
                onUploadSuccess={(url) => handleChange('icon_image_url', url)}
                onRemove={() => handleChange('icon_image_url', '')}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
