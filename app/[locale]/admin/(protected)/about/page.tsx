'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import LanguageTabs from '@/components/admin/LanguageTabs'
import MediaUpload from '@/components/admin/MediaUpload'
import { Save, Loader2 } from 'lucide-react'

export default function AboutAdminPage() {
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name_en: '', name_ar: '',
    title_en: '', title_ar: '',
    intro_en: '', intro_ar: '',
    long_biography_en: '', long_biography_ar: '',
    philosophy_en: '', philosophy_ar: '',
    profile_image_url: '',
    resume_url_en: '', resume_url_ar: '',
  })

  useEffect(() => {
    fetchAboutData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase.from('about').select('*').single()
      if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found'
        throw error
      }
      if (data) {
        setFormData({
          name_en: data.name_en || '', name_ar: data.name_ar || '',
          title_en: data.title_en || '', title_ar: data.title_ar || '',
          intro_en: data.intro_en || '', intro_ar: data.intro_ar || '',
          long_biography_en: data.long_biography_en || '', long_biography_ar: data.long_biography_ar || '',
          philosophy_en: data.philosophy_en || '', philosophy_ar: data.philosophy_ar || '',
          profile_image_url: data.profile_image_url || '',
          resume_url_en: data.resume_url_en || '', resume_url_ar: data.resume_url_ar || '',
        })
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      // Check if row exists
      const { data: existingData } = await supabase.from('about').select('id').single()

      if (existingData) {
        const { error } = await supabase.from('about').update(formData).eq('id', existingData.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('about').insert([formData])
        if (error) throw error
      }
      
      setMessage({ type: 'success', text: 'About content saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error saving data' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">About Section</h1>
          <p className="text-white/60">Manage your personal information, biography, and philosophy.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-light text-brand-dark font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-xl border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-8">
        <LanguageTabs activeLanguage={activeLang} onLanguageChange={setActiveLang} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Text Content</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
                <input
                  type="text"
                  value={activeLang === 'en' ? formData.name_en : formData.name_ar}
                  onChange={(e) => handleChange(`name_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Professional Title</label>
                <input
                  type="text"
                  value={activeLang === 'en' ? formData.title_en : formData.title_ar}
                  onChange={(e) => handleChange(`title_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Short Introduction</label>
                <textarea
                  rows={3}
                  value={activeLang === 'en' ? formData.intro_en : formData.intro_ar}
                  onChange={(e) => handleChange(`intro_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Long Biography</label>
                <textarea
                  rows={6}
                  value={activeLang === 'en' ? formData.long_biography_en : formData.long_biography_ar}
                  onChange={(e) => handleChange(`long_biography_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Design Philosophy</label>
                <textarea
                  rows={4}
                  value={activeLang === 'en' ? formData.philosophy_en : formData.philosophy_ar}
                  onChange={(e) => handleChange(`philosophy_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Media & Files</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Profile Image</label>
                <MediaUpload
                  bucket="portfolio-media"
                  folder="about"
                  currentUrl={formData.profile_image_url}
                  accept="image/*"
                  onUploadSuccess={(url) => handleChange('profile_image_url', url)}
                  onRemove={() => handleChange('profile_image_url', '')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Resume (English) PDF
                </label>
                <MediaUpload
                  bucket="portfolio-media"
                  folder="about"
                  currentUrl={formData.resume_url_en}
                  accept="application/pdf"
                  onUploadSuccess={(url) => handleChange('resume_url_en', url)}
                  onRemove={() => handleChange('resume_url_en', '')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Resume ({activeLang === 'ar' ? 'Arabic' : 'العربية'}) PDF
                </label>
                <MediaUpload
                  bucket="portfolio-media"
                  folder="about"
                  currentUrl={formData.resume_url_ar}
                  accept="application/pdf"
                  onUploadSuccess={(url) => handleChange('resume_url_ar', url)}
                  onRemove={() => handleChange('resume_url_ar', '')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
