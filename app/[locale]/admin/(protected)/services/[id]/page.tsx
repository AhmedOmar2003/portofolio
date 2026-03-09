'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import LanguageTabs from '@/components/admin/LanguageTabs'
import MediaUpload from '@/components/admin/MediaUpload'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ServiceEditorPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
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
    description_en: '', description_ar: '',
    detailed_content_en: '', detailed_content_ar: '',
    icon_image_url: '',
    is_featured: false,
    view_order: 0
  })

  useEffect(() => {
    if (!isNew) fetchService()
    else fetchMaxOrder() // For new items, put them at the end
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew])

  const fetchService = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').eq('id', id).single()
      if (error) throw error
      if (data) {
        setFormData({
          title_en: data.title_en || '', title_ar: data.title_ar || '',
          description_en: data.description_en || '', description_ar: data.description_ar || '',
          detailed_content_en: data.detailed_content_en || '', detailed_content_ar: data.detailed_content_ar || '',
          icon_image_url: data.icon_image_url || '',
          is_featured: data.is_featured || false,
          view_order: data.view_order || 0
        })
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      setMessage({ type: 'error', text: 'Failed to load service.' })
    } finally {
      setLoading(false)
    }
  }

  const fetchMaxOrder = async () => {
    const { data } = await supabase.from('services').select('view_order').order('view_order', { ascending: false }).limit(1)
    if (data && data.length > 0) {
      setFormData(prev => ({ ...prev, view_order: (data[0].view_order || 0) + 1 }))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.title_en) {
      setMessage({ type: 'error', text: 'English Title is required.' })
      return
    }

    setSaving(true)
    setMessage(null)
    try {
      if (isNew) {
        const { error } = await supabase.from('services').insert([formData])
        if (error) throw error
        setMessage({ type: 'success', text: 'Service created successfully!' })
        setTimeout(() => router.push(`/${locale}/admin/services`), 1500)
      } else {
        const { error } = await supabase.from('services').update(formData).eq('id', id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Service updated successfully!' })
        setTimeout(() => setMessage(null), 3000)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error saving service' })
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
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <Link href={`/${locale}/admin/services`} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isNew ? 'Create New Service' : 'Edit Service'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-light text-brand-dark font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Service'}
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-8 rounded-xl border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Service Details</h2>
              <LanguageTabs activeLanguage={activeLang} onLanguageChange={setActiveLang} />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Title *</label>
                <input
                  type="text"
                  value={activeLang === 'en' ? formData.title_en : formData.title_ar}
                  onChange={(e) => handleChange(`title_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Short Description</label>
                <textarea
                  rows={3}
                  value={activeLang === 'en' ? formData.description_en : formData.description_ar}
                  onChange={(e) => handleChange(`description_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Detailed Content</label>
                <textarea
                  rows={6}
                  value={activeLang === 'en' ? formData.detailed_content_en : formData.detailed_content_ar}
                  onChange={(e) => handleChange(`detailed_content_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-white">Options</h2>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.is_featured ? 'bg-brand-primary' : 'bg-white/20'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.is_featured ? 'translate-x-7 bg-brand-dark' : 'translate-x-1'}`} />
              </div>
              <span className="text-white/80 group-hover:text-white transition-colors">Featured Service</span>
            </label>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Service Icon</h2>
            <MediaUpload
              bucket="portfolio-media"
              folder="services"
              accept="image/*"
              currentUrl={formData.icon_image_url}
              onUploadSuccess={(url) => handleChange('icon_image_url', url)}
              onRemove={() => handleChange('icon_image_url', '')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
