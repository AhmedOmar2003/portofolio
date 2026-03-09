'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import LanguageTabs from '@/components/admin/LanguageTabs'
import MediaUpload from '@/components/admin/MediaUpload'
import { Save, Loader2 } from 'lucide-react'

export default function SiteSettingsAdminPage() {
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const supabase = createClient()

  const [formData, setFormData] = useState({
    logo_url: '',
    favicon_url: '',
    hero_title_en: '', hero_title_ar: '',
    hero_subtitle_en: '', hero_subtitle_ar: '',
    default_language: 'en',
    social_links: { twitter: '', behance: '', linkedin: '', dribbble: '' }
  })

  useEffect(() => {
    fetchSettingsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchSettingsData = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').single()
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      if (data) {
        setFormData({
          logo_url: data.logo_url || '',
          favicon_url: data.favicon_url || '',
          hero_title_en: data.hero_title_en || '', hero_title_ar: data.hero_title_ar || '',
          hero_subtitle_en: data.hero_subtitle_en || '', hero_subtitle_ar: data.hero_subtitle_ar || '',
          default_language: data.default_language || 'en',
          social_links: data.social_links || { twitter: '', behance: '', linkedin: '', dribbble: '' }
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSocialChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [key]: value }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const { data: existingData } = await supabase.from('site_settings').select('id').single()

      if (existingData) {
        const { error } = await supabase.from('site_settings').update(formData).eq('id', existingData.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('site_settings').insert([formData])
        if (error) throw error
      }
      
      setMessage({ type: 'success', text: 'Site settings saved successfully!' })
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
          <h1 className="text-3xl font-bold text-white mb-2">Site Settings</h1>
          <p className="text-white/60">Manage global website configuration and hero section.</p>
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
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-5">
            <h2 className="text-xl font-bold text-white mb-4">Hero Section Content</h2>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Hero Title</label>
              <textarea
                rows={3}
                value={activeLang === 'en' ? formData.hero_title_en : formData.hero_title_ar}
                onChange={(e) => handleChange(`hero_title_${activeLang}`, e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none text-xl font-medium"
                dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Hero Subtitle</label>
              <textarea
                rows={3}
                value={activeLang === 'en' ? formData.hero_subtitle_en : formData.hero_subtitle_ar}
                onChange={(e) => handleChange(`hero_subtitle_${activeLang}`, e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none"
                dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-5">
            <h2 className="text-xl font-bold text-white mb-4">Social Links</h2>
            <div className="grid grid-cols-2 gap-4">
              {['linkedin', 'behance', 'twitter', 'dribbble'].map(social => (
                <div key={social}>
                  <label className="block text-sm font-medium text-white/80 mb-2 capitalize">{social} URL</label>
                  <input
                    type="url"
                    value={formData.social_links[social as keyof typeof formData.social_links] || ''}
                    onChange={(e) => handleSocialChange(social, e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none"
                    placeholder="https://"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-white">Global Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Default Language</label>
              <select
                value={formData.default_language}
                onChange={(e) => handleChange('default_language', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none"
              >
                <option value="en">English (en)</option>
                <option value="ar">Arabic (ar)</option>
              </select>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Site Logo</h2>
            <MediaUpload
              bucket="portfolio-media"
              folder="settings"
              accept="image/*"
              currentUrl={formData.logo_url}
              onUploadSuccess={(url) => handleChange('logo_url', url)}
              onRemove={() => handleChange('logo_url', '')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
