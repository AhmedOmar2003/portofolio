'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import MediaUpload from '@/components/admin/MediaUpload'
import { createClient } from '@/utils/supabase/client'
import { getServiceTypeLabel, normalizeServiceType, type ServiceType } from '@/utils/service-type'

type MessageState = { type: 'success' | 'error'; text: string } | null
type ServiceImageField = 'image_1_url' | 'image_2_url' | 'image_3_url'

function parseServiceLinks(value: unknown): string[] {
  if (typeof value !== 'string') return []
  const trimmed = value.trim()
  if (!trimmed) return []

  // Backward compatible: if someone stored JSON array manually.
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is string => typeof item === 'string')
          .map((item) => item.trim())
          .filter(Boolean)
      }
    } catch {
      // fall through to newline split
    }
  }

  return trimmed
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function serializeServiceLinks(links: string[]): string {
  return links.map((item) => item.trim()).filter(Boolean).join('\n')
}

function getVideoPreview(url: string) {
  const value = url.trim()
  if (!value) return null

  try {
    const parsed = new URL(value)
    const host = parsed.hostname.toLowerCase()

    if (host.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v')
      if (videoId) {
        return { kind: 'embed' as const, src: `https://www.youtube.com/embed/${videoId}` }
      }
    }

    if (host.includes('youtu.be')) {
      const videoId = parsed.pathname.replace('/', '')
      if (videoId) {
        return { kind: 'embed' as const, src: `https://www.youtube.com/embed/${videoId}` }
      }
    }

    if (host.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0]
      if (videoId) {
        return { kind: 'embed' as const, src: `https://player.vimeo.com/video/${videoId}` }
      }
    }
  } catch {
    return { kind: 'direct' as const, src: value }
  }

  return { kind: 'direct' as const, src: value }
}

export default function ServiceEditorPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const resolvedParams = use(params)
  const { locale, id } = resolvedParams
  const isArabic = locale === 'ar'
  const isNew = id === 'new'
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [mediaSyncing, setMediaSyncing] = useState(false)
  const [message, setMessage] = useState<MessageState>(null)
  const [serviceOrderRows, setServiceOrderRows] = useState<Array<{ id: string; viewOrder: number; type: ServiceType }>>([])
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    detailed_content_en: '',
    detailed_content_ar: '',
    image_1_url: '',
    image_2_url: '',
    image_3_url: '',
    service_links: [''],
    video_url: '',
    service_type: 'full_design_development' as ServiceType,
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

  useEffect(() => {
    void fetchServiceOrderRows()
  }, [])

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
        image_1_url: data.image_1_url || '',
        image_2_url: data.image_2_url || '',
        image_3_url: data.image_3_url || '',
        service_links: (() => {
          const parsed = parseServiceLinks(data.service_link_url)
          return parsed.length > 0 ? parsed : ['']
        })(),
        video_url: data.video_url || '',
        service_type: normalizeServiceType(data.service_type),
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

  const fetchServiceOrderRows = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('id, view_order, service_type')

    if (error) {
      console.warn('Could not load service order rows:', error.message)
      return
    }

    const rows = ((data || []) as Array<Record<string, unknown>>).map((row) => ({
      id: typeof row.id === 'string' ? row.id : '',
      viewOrder: typeof row.view_order === 'number' ? row.view_order : 0,
      type: normalizeServiceType((row as { service_type?: unknown }).service_type),
    }))

    setServiceOrderRows(rows)
  }

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleVideoUrlChange = (value: string) => {
    handleChange('video_url', value.trim())
  }

  const handleServiceLinkChange = (index: number, value: string) => {
    setFormData((prev) => {
      const nextLinks = [...prev.service_links]
      nextLinks[index] = value
      return { ...prev, service_links: nextLinks }
    })
  }

  const addServiceLinkField = () => {
    setFormData((prev) => ({ ...prev, service_links: [...prev.service_links, ''] }))
  }

  const removeServiceLinkField = (index: number) => {
    setFormData((prev) => {
      if (prev.service_links.length <= 1) {
        return { ...prev, service_links: [''] }
      }
      return { ...prev, service_links: prev.service_links.filter((_, i) => i !== index) }
    })
  }

  const handleRemoveServiceImage = async (field: ServiceImageField) => {
    const previous = formData[field]
    handleChange(field, '')

    if (isNew) return

    setMediaSyncing(true)
    try {
      const { error } = await supabase.from('services').update({ [field]: null }).eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Image removed and saved.' })
      setTimeout(() => setMessage(null), 1800)
    } catch (error) {
      console.error('Error removing service image:', error)
      handleChange(field, previous)
      setMessage({ type: 'error', text: 'Could not remove image. Please try again.' })
    } finally {
      setMediaSyncing(false)
    }
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
      image_1_url: formData.image_1_url.trim() || null,
      image_2_url: formData.image_2_url.trim() || null,
      image_3_url: formData.image_3_url.trim() || null,
      service_link_url: serializeServiceLinks(formData.service_links) || null,
      video_url: formData.video_url,
      service_type: formData.service_type,
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
      if (error instanceof Error && error.message.toLowerCase().includes('service_type')) {
        setMessage({
          type: 'error',
          text: 'Service type column is missing. Run services-type-migration.sql in Supabase then save again.',
        })
      } else {
        setMessage({ type: 'error', text: 'Failed to save the service.' })
      }
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

  const normalizedViewOrder = Number.isFinite(formData.view_order) ? formData.view_order : 0
  const candidateRows = serviceOrderRows.filter((row) => row.id !== id)
  const allOrderPreview = candidateRows.filter((row) => row.viewOrder < normalizedViewOrder).length + 1
  const programmingOrderPreview = formData.service_type === 'full_design_development'
    ? candidateRows.filter((row) => row.type === 'full_design_development' && row.viewOrder < normalizedViewOrder).length + 1
    : null
  const uxUiOrderPreview = formData.service_type === 'ux_ui_design'
    ? candidateRows.filter((row) => row.type === 'ux_ui_design' && row.viewOrder < normalizedViewOrder).length + 1
    : null

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      <Link href={`/${locale}/admin/services`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white">
        <ArrowLeft className={`h-4 w-4 ${isArabic ? 'rtl-flip' : ''}`} />
        {isArabic ? 'رجوع للخدمات' : 'Back to services'}
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
              <label className="admin-label">Service type</label>
              <select
                className="admin-input"
                value={formData.service_type}
                onChange={(e) => handleChange('service_type', e.target.value as ServiceType)}
              >
                <option value="full_design_development">{getServiceTypeLabel('full_design_development', locale)}</option>
                <option value="ux_ui_design">{getServiceTypeLabel('ux_ui_design', locale)}</option>
              </select>
              <p className="admin-helper mt-2">
                {isArabic ? 'اختار نوع الخدمة لتظهر في فلتر صفحة الخدمات.' : 'Choose the service type to appear in the Services page filter.'}
              </p>
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
            <div>
              <label className="admin-label">Service example links (optional)</label>
              <div className="space-y-3">
                {formData.service_links.map((link, index) => (
                  <div key={`service-link-${index}`} className="flex gap-2">
                    <input
                      type="url"
                      className="admin-input"
                      value={link}
                      onChange={(e) => handleServiceLinkChange(index, e.target.value)}
                      placeholder={`https://... (${isArabic ? `رابط ${index + 1}` : `Link ${index + 1}`})`}
                    />
                    <button
                      type="button"
                      onClick={() => removeServiceLinkField(index)}
                      className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs text-slate-300 transition hover:border-white/20 hover:text-white"
                    >
                      {isArabic ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={addServiceLinkField}
                  className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
                >
                  {isArabic ? 'إضافة رابط آخر' : 'Add another link'}
                </button>
              </div>
              <p className="admin-helper mt-2">
                {isArabic
                  ? 'اختياري بالكامل. لو فيه أكتر من مثال للخدمة ضيفهم هنا.'
                  : 'Completely optional. Add multiple links if you have more than one service example.'}
              </p>
            </div>
            <div>
              <label className="admin-label">Service video URL</label>
              <input
                type="url"
                className="admin-input"
                value={formData.video_url}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                placeholder="https://... (MP4 / YouTube / Vimeo)"
              />
              <p className="admin-helper mt-2">
                استخدم رابط YouTube/Vimeo أو رابط فيديو مباشر بدل الرفع من الجهاز.
              </p>

              {formData.video_url ? (
                <div className="group relative mt-4 overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/20">
                  {(() => {
                    const preview = getVideoPreview(formData.video_url)
                    if (!preview) return null

                    if (preview.kind === 'embed') {
                      return (
                        <iframe
                          src={preview.src}
                          className="h-56 w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Service video preview"
                        />
                      )
                    }

                    return <video src={preview.src} className="h-56 w-full object-cover" controls />
                  })()}
                  <button
                    type="button"
                    onClick={() => handleChange('video_url', '')}
                    className="absolute right-3 top-3 rounded-xl border border-rose-400/20 bg-rose-400/10 p-2 text-rose-200 opacity-0 transition group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
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
                <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 text-xs text-slate-300">
                  <p className="font-semibold text-slate-200">{isArabic ? 'معاينة ترتيب الفلاتر' : 'Filter order preview'}</p>
                  <p className="mt-2">{isArabic ? 'الكل' : 'All'}: #{String(allOrderPreview).padStart(2, '0')}</p>
                  <p>{isArabic ? 'برمجة' : 'Programming'}: {programmingOrderPreview ? `#${String(programmingOrderPreview).padStart(2, '0')}` : '—'}</p>
                  <p>{isArabic ? 'تصميم UX / UI' : 'UX / UI Design'}: {uxUiOrderPreview ? `#${String(uxUiOrderPreview).padStart(2, '0')}` : '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input id="featured-service" type="checkbox" checked={formData.is_featured} onChange={(e) => handleChange('is_featured', e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-black/20 accent-[var(--color-green-accent)]" />
                <label htmlFor="featured-service" className="text-sm text-slate-300">Feature this service on the homepage</label>
              </div>
            </div>
          </section>

          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Service images</h2>
            <p className="mt-1 text-sm text-slate-500">Up to 3 images (PNG/JPG/JPEG/WebP) — first is the main cover. Images are auto-converted to WebP.</p>
            <div className="mt-6 space-y-5">
              <div>
                <p className="admin-label mb-2">Image 1 — Cover</p>
                <MediaUpload
                  bucket="portfolio-media"
                  folder="services"
                  accept="image/*"
                  currentUrl={formData.image_1_url}
                  onUploadSuccess={(url) => handleChange('image_1_url', url)}
                  onRemove={mediaSyncing ? undefined : () => void handleRemoveServiceImage('image_1_url')}
                />
              </div>
              <div>
                <p className="admin-label mb-2">Image 2 — Supporting</p>
                <MediaUpload
                  bucket="portfolio-media"
                  folder="services"
                  accept="image/*"
                  currentUrl={formData.image_2_url}
                  onUploadSuccess={(url) => handleChange('image_2_url', url)}
                  onRemove={mediaSyncing ? undefined : () => void handleRemoveServiceImage('image_2_url')}
                />
              </div>
              <div>
                <p className="admin-label mb-2">Image 3 — Supporting</p>
                <MediaUpload
                  bucket="portfolio-media"
                  folder="services"
                  accept="image/*"
                  currentUrl={formData.image_3_url}
                  onUploadSuccess={(url) => handleChange('image_3_url', url)}
                  onRemove={mediaSyncing ? undefined : () => void handleRemoveServiceImage('image_3_url')}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
