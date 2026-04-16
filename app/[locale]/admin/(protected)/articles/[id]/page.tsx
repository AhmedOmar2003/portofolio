'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

import MediaUpload from '@/components/admin/MediaUpload'
import { createClient } from '@/utils/supabase/client'

type MessageState = { type: 'success' | 'error'; text: string } | null

export default function ArticleEditorPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
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
    slug: '',
    excerpt_en: '',
    excerpt_ar: '',
    content_en: '',
    content_ar: '',
    cover_image_url: '',
    published_at: '',
  })

  useEffect(() => {
    if (!isNew) {
      void fetchArticle()
    }
  }, [id, isNew])

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single()
      if (error) throw error

      setFormData({
        title_en: data.title_en || '',
        title_ar: data.title_ar || '',
        slug: data.slug || '',
        excerpt_en: data.excerpt_en || '',
        excerpt_ar: data.excerpt_ar || '',
        content_en: data.content_en || '',
        content_ar: data.content_ar || '',
        cover_image_url: data.cover_image_url || '',
        published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : '',
      })
    } catch (error) {
      console.error('Error fetching article:', error)
      setMessage({ type: 'error', text: 'Failed to load the article.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateSlug = () => {
    if (!formData.title_en) return

    const nextSlug = formData.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    handleChange('slug', nextSlug)
  }

  const handlePublish = async () => {
    const publishDate = formData.published_at || new Date().toISOString().slice(0, 16)
    await handleSave(publishDate)
  }

  const handleSave = async (publishDate = formData.published_at) => {
    if (!formData.title_en || !formData.slug) {
      setMessage({ type: 'error', text: 'Title and slug are required.' })
      return
    }

    setSaving(true)
    setMessage(null)

    const payload = {
      title_en: formData.title_en,
      title_ar: formData.title_ar,
      slug: formData.slug,
      excerpt_en: formData.excerpt_en,
      excerpt_ar: formData.excerpt_ar,
      content_en: formData.content_en,
      content_ar: formData.content_ar,
      cover_image_url: formData.cover_image_url,
      published_at: publishDate || null,
    }

    try {
      if (isNew) {
        const { error } = await supabase.from('articles').insert([payload])
        if (error) throw error
        setMessage({ type: 'success', text: 'Article created successfully.' })
        setTimeout(() => router.push(`/${locale}/admin/articles`), 1200)
      } else {
        const { error } = await supabase.from('articles').update(payload).eq('id', id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Article updated successfully.' })
      }

      if (publishDate !== formData.published_at) {
        setFormData((prev) => ({ ...prev, published_at: publishDate }))
      }
    } catch (error) {
      console.error('Error saving article:', error)
      setMessage({ type: 'error', text: 'Failed to save the article.' })
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
    <div className="mx-auto max-w-6xl space-y-6 pb-20">
      <Link href={`/${locale}/admin/articles`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to articles
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="admin-kicker">Articles</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">{isNew ? 'Create article' : 'Edit article'}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Keep editorial content structured, easy to scan, and aligned with the overall portfolio narrative.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => void handleSave()} disabled={saving} className="btn btn-secondary text-sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save draft
          </button>
          <button type="button" onClick={() => void handlePublish()} disabled={saving} className="btn btn-primary text-sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {formData.published_at ? 'Update published article' : 'Publish article'}
          </button>
        </div>
      </div>

      {message ? (
        <div className={`rounded-[1.15rem] border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/20 bg-rose-400/10 text-rose-200'}`}>
          {message.text}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <section className="admin-card px-6 py-6">
          <h2 className="text-xl font-semibold text-white">Editorial content</h2>
          <div className="mt-6 grid gap-5">
            <div>
              <label className="admin-label">Title (English)</label>
              <input
                className="admin-input"
                value={formData.title_en}
                onChange={(e) => handleChange('title_en', e.target.value)}
                onBlur={isNew ? generateSlug : undefined}
              />
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
              <label className="admin-label">Slug</label>
              <input
                className="admin-input font-mono text-sm"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="design-systems-that-scale"
              />
            </div>
            <div>
              <label className="admin-label">Excerpt (English)</label>
              <textarea
                className="admin-textarea min-h-[140px]"
                value={formData.excerpt_en}
                onChange={(e) => handleChange('excerpt_en', e.target.value)}
                placeholder="A short summary that explains the article's main insight."
              />
            </div>
            <div>
              <label className="admin-label">المُلخص (العربية)</label>
              <textarea
                dir="rtl"
                className="admin-textarea min-h-[140px] text-right"
                value={formData.excerpt_ar}
                onChange={(e) => handleChange('excerpt_ar', e.target.value)}
                placeholder="ملخص قصير يوضح الفكرة الأساسية للمقال."
              />
            </div>
            <div>
              <label className="admin-label">Main content (English)</label>
              <textarea
                className="admin-textarea min-h-[320px] font-mono text-sm leading-7"
                value={formData.content_en}
                onChange={(e) => handleChange('content_en', e.target.value)}
                placeholder="Write the article body here. Markdown-style formatting is fine."
              />
            </div>
            <div>
              <label className="admin-label">المحتوى الأساسي (العربية)</label>
              <textarea
                dir="rtl"
                className="admin-textarea min-h-[320px] text-right"
                value={formData.content_ar}
                onChange={(e) => handleChange('content_ar', e.target.value)}
                placeholder="اكتب محتوى المقال بالعربي."
              />
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Publishing</h2>
            <div className="mt-6 space-y-5">
              <div>
                <label className="admin-label">Publish date</label>
                <input
                  type="datetime-local"
                  className="admin-input [color-scheme:dark]"
                  value={formData.published_at}
                  onChange={(e) => handleChange('published_at', e.target.value)}
                />
                <p className="admin-helper mt-2">Leave empty to keep the article as a draft.</p>
              </div>
            </div>
          </section>

          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Cover image</h2>
            <div className="mt-6">
              <MediaUpload
                bucket="portfolio-media"
                folder="articles"
                accept="image/*"
                currentUrl={formData.cover_image_url}
                onUploadSuccess={(url) => handleChange('cover_image_url', url)}
                onRemove={() => handleChange('cover_image_url', '')}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
