'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'

import MediaUpload from '@/components/admin/MediaUpload'
import { createClient } from '@/utils/supabase/client'

type MessageState = { type: 'success' | 'error'; text: string } | null

export default function SiteSettingsAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<MessageState>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    logo_url: '',
    favicon_url: '',
    hero_title_en: '',
    hero_title_ar: '',
    hero_subtitle_en: '',
    hero_subtitle_ar: '',
    social_links: { twitter: '', behance: '', linkedin: '', dribbble: '' },
  })

  useEffect(() => {
    void fetchSettingsData()
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
          hero_title_en: data.hero_title_en || '',
          hero_title_ar: data.hero_title_ar || '',
          hero_subtitle_en: data.hero_subtitle_en || '',
          hero_subtitle_ar: data.hero_subtitle_ar || '',
          social_links: data.social_links || { twitter: '', behance: '', linkedin: '', dribbble: '' },
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage({ type: 'error', text: 'Failed to load site settings.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData, value: string | typeof formData.social_links) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSocialChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [key]: value },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    const payload = {
      logo_url: formData.logo_url,
      favicon_url: formData.favicon_url,
      hero_title_en: formData.hero_title_en,
      hero_title_ar: formData.hero_title_ar,
      hero_subtitle_en: formData.hero_subtitle_en,
      hero_subtitle_ar: formData.hero_subtitle_ar,
      default_language: 'ar',
      social_links: formData.social_links,
    }

    try {
      const { data: existingData } = await supabase.from('site_settings').select('id').single()

      if (existingData) {
        const { error } = await supabase.from('site_settings').update(payload).eq('id', existingData.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('site_settings').insert([payload])
        if (error) throw error
      }

      setMessage({ type: 'success', text: 'Brand and hero settings updated.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error saving site settings:', error)
      setMessage({ type: 'error', text: 'Failed to save site settings.' })
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="admin-kicker">Hero & Brand</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">Manage the first impression</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Update the hero message, logo, and social links that shape the overall brand experience.
          </p>
        </div>

        <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary w-fit text-sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      {message ? (
        <div className={`rounded-[1.15rem] border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/20 bg-rose-400/10 text-rose-200'}`}>
          {message.text}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <section className="admin-card px-6 py-6">
          <h2 className="text-xl font-semibold text-white">Hero content</h2>
          <div className="mt-6 grid gap-5">
            <div>
              <label className="admin-label">Hero headline (English)</label>
              <textarea className="admin-textarea min-h-[140px]" value={formData.hero_title_en} onChange={(e) => handleChange('hero_title_en', e.target.value)} />
            </div>
            <div>
              <label className="admin-label">العنوان الرئيسي (العربية)</label>
              <textarea
                dir="rtl"
                className="admin-textarea min-h-[140px] text-right"
                value={formData.hero_title_ar}
                onChange={(e) => handleChange('hero_title_ar', e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Hero supporting text (English)</label>
              <textarea className="admin-textarea min-h-[140px]" value={formData.hero_subtitle_en} onChange={(e) => handleChange('hero_subtitle_en', e.target.value)} />
            </div>
            <div>
              <label className="admin-label">النص الداعم (العربية)</label>
              <textarea
                dir="rtl"
                className="admin-textarea min-h-[140px] text-right"
                value={formData.hero_subtitle_ar}
                onChange={(e) => handleChange('hero_subtitle_ar', e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Brand assets</h2>
            <div className="mt-6 space-y-6">
              <div>
                <label className="admin-label">Site logo</label>
                <MediaUpload
                  bucket="portfolio-media"
                  folder="settings"
                  accept="image/*"
                  currentUrl={formData.logo_url}
                  onUploadSuccess={(url) => handleChange('logo_url', url)}
                  onRemove={() => handleChange('logo_url', '')}
                />
              </div>
              <div>
                <label className="admin-label">Favicon / icon</label>
                <MediaUpload
                  bucket="portfolio-media"
                  folder="settings"
                  accept="image/*"
                  currentUrl={formData.favicon_url}
                  onUploadSuccess={(url) => handleChange('favicon_url', url)}
                  onRemove={() => handleChange('favicon_url', '')}
                />
              </div>
            </div>
          </section>

          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Social links</h2>
            <div className="mt-6 grid gap-4">
              {['linkedin', 'behance', 'twitter', 'dribbble'].map((social) => (
                <div key={social}>
                  <label className="admin-label capitalize">{social}</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={formData.social_links[social as keyof typeof formData.social_links] || ''}
                    onChange={(e) => handleSocialChange(social, e.target.value)}
                    placeholder="https://"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
