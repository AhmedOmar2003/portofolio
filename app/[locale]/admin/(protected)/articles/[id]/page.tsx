'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import LanguageTabs from '@/components/admin/LanguageTabs'
import MediaUpload from '@/components/admin/MediaUpload'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ArticleEditorPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const resolvedParams = use(params)
  const { locale, id } = resolvedParams
  const isNew = id === 'new'
  
  const router = useRouter()
  const supabase = createClient()
  
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en')
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [formData, setFormData] = useState({
    title_en: '', title_ar: '',
    slug: '',
    excerpt_en: '', excerpt_ar: '',
    content_en: '', content_ar: '',
    cover_image_url: '',
    published_at: ''
  })

  useEffect(() => {
    if (!isNew) fetchArticle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew])

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single()
      if (error) throw error
      if (data) {
        setFormData({
          title_en: data.title_en || '', title_ar: data.title_ar || '',
          slug: data.slug || '',
          excerpt_en: data.excerpt_en || '', excerpt_ar: data.excerpt_ar || '',
          content_en: data.content_en || '', content_ar: data.content_ar || '',
          cover_image_url: data.cover_image_url || '',
          // Format timestamp for datetime-local input
          published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : ''
        })
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      setMessage({ type: 'error', text: 'Failed to load article.' })
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateSlug = () => {
    if (!formData.title_en) return
    const slug = formData.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
    handleChange('slug', slug)
  }

  const handlePublish = async () => {
    // If not published yet, set to current time
    if (!formData.published_at) {
      handleChange('published_at', new Date().toISOString().slice(0, 16))
    }
    // Set a flag to identify publish action vs standard save if needed
    handleSave()
  }

  const handleSave = async () => {
    if (!formData.title_en || !formData.slug) {
      setMessage({ type: 'error', text: 'English Title and Slug are required.' })
      return
    }

    setSaving(true)
    setMessage(null)
    
    try {
      // Prepare payload, converting empty published_at string to null
      const payload = { ...formData, published_at: formData.published_at || null }

      if (isNew) {
        const { error } = await supabase.from('articles').insert([payload])
        if (error) throw error
        setMessage({ type: 'success', text: 'Article created successfully!' })
        setTimeout(() => router.push(`/${locale}/admin/articles`), 1500)
      } else {
        const { error } = await supabase.from('articles').update(payload).eq('id', id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Article updated successfully!' })
        setTimeout(() => setMessage(null), 3000)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error saving article' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-6">
        <Link href={`/${locale}/admin/articles`} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isNew ? 'Write New Article' : 'Edit Article'}
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors disabled:opacity-50 border border-white/10"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-light text-brand-dark font-bold rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-brand-primary/20"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (formData.published_at ? <Save className="w-5 h-5" /> : <Loader2 className="w-5 h-5 opacity-0" />)}
            {formData.published_at ? 'Update Published' : 'Publish Now'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-8 rounded-xl border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Content Editor</h2>
              <LanguageTabs activeLanguage={activeLang} onLanguageChange={setActiveLang} />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Title *</label>
                <input
                  type="text"
                  value={activeLang === 'en' ? formData.title_en : formData.title_ar}
                  onChange={(e) => handleChange(`title_${activeLang}`, e.target.value)}
                  onBlur={activeLang === 'en' && isNew ? generateSlug : undefined}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none text-lg font-medium"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  required
                />
              </div>

              {activeLang === 'en' && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">URL Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none font-mono text-sm text-white/60"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Excerpt</label>
                <textarea
                  rows={3}
                  value={activeLang === 'en' ? formData.excerpt_en : formData.excerpt_ar}
                  onChange={(e) => handleChange(`excerpt_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Main Content (Markdown supported)</label>
                <textarea
                  rows={20}
                  value={activeLang === 'en' ? formData.content_en : formData.content_ar}
                  onChange={(e) => handleChange(`content_${activeLang}`, e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none font-mono text-sm leading-relaxed"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-white">Publishing</h2>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Publish Date</label>
              <input
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) => handleChange('published_at', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none [color-scheme:dark]"
              />
              <p className="mt-2 text-xs text-white/40">Leave empty to keep as draft.</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Cover Image</h2>
            <MediaUpload
              bucket="portfolio-media"
              folder="articles"
              accept="image/*"
              currentUrl={formData.cover_image_url}
              onUploadSuccess={(url) => handleChange('cover_image_url', url)}
              onRemove={() => handleChange('cover_image_url', '')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
