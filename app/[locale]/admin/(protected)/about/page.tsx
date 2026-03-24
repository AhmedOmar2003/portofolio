'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'

import MediaUpload from '@/components/admin/MediaUpload'
import { createClient } from '@/utils/supabase/client'

type MessageState = { type: 'success' | 'error'; text: string } | null

function stringifyList(items: unknown) {
  if (!Array.isArray(items)) {
    return ''
  }

  return items
    .map((item) => {
      if (typeof item === 'string') {
        return item
      }

      if (item && typeof item === 'object') {
        const entry = item as Record<string, unknown>
        return String(entry.name_en || entry.name || entry.title || '')
      }

      return ''
    })
    .filter(Boolean)
    .join('\n')
}

function stringifyTimeline(items: unknown) {
  if (!Array.isArray(items)) {
    return ''
  }

  return items
    .map((item) => {
      if (typeof item === 'string') {
        return item
      }

      if (item && typeof item === 'object') {
        const entry = item as Record<string, unknown>
        return [entry.role || entry.title || '', entry.company || '', entry.period || '', entry.summary || '']
          .map((value) => String(value || '').trim())
          .filter(Boolean)
          .join(' | ')
      }

      return ''
    })
    .filter(Boolean)
    .join('\n')
}

function parseSimpleList(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => ({ name_en: item }))
}

function parseTimeline(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [role = '', company = '', period = '', summary = ''] = line.split('|').map((item) => item.trim())
      return { role, company, period, summary }
    })
}

export default function AboutAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<MessageState>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name_en: '',
    title_en: '',
    intro_en: '',
    long_biography_en: '',
    philosophy_en: '',
    skillsText: '',
    toolsText: '',
    experienceText: '',
    profile_image_url: '',
    resume_url_en: '',
  })

  useEffect(() => {
    void fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase.from('about').select('*').single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setFormData({
          name_en: data.name_en || '',
          title_en: data.title_en || '',
          intro_en: data.intro_en || '',
          long_biography_en: data.long_biography_en || '',
          philosophy_en: data.philosophy_en || '',
          skillsText: stringifyList(data.skills),
          toolsText: stringifyList(data.tools),
          experienceText: stringifyTimeline(data.experience_timeline),
          profile_image_url: data.profile_image_url || '',
          resume_url_en: data.resume_url_en || '',
        })
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
      setMessage({ type: 'error', text: 'Failed to load the About content.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.name_en || !formData.title_en) {
      setMessage({ type: 'error', text: 'Name and professional title are required.' })
      return
    }

    setSaving(true)
    setMessage(null)

    const payload = {
      name_en: formData.name_en,
      name_ar: formData.name_en,
      title_en: formData.title_en,
      title_ar: formData.title_en,
      intro_en: formData.intro_en,
      intro_ar: formData.intro_en,
      long_biography_en: formData.long_biography_en,
      long_biography_ar: formData.long_biography_en,
      philosophy_en: formData.philosophy_en,
      philosophy_ar: formData.philosophy_en,
      skills: parseSimpleList(formData.skillsText),
      tools: parseSimpleList(formData.toolsText),
      experience_timeline: parseTimeline(formData.experienceText),
      profile_image_url: formData.profile_image_url,
      resume_url_en: formData.resume_url_en,
      resume_url_ar: formData.resume_url_en,
    }

    try {
      const { data: existingData } = await supabase.from('about').select('id').single()

      if (existingData) {
        const { error } = await supabase.from('about').update(payload).eq('id', existingData.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('about').insert([payload])
        if (error) throw error
      }

      setMessage({ type: 'success', text: 'About content updated successfully.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error saving about data:', error)
      setMessage({ type: 'error', text: 'Failed to save About content.' })
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
          <p className="admin-kicker">About & Skills</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">Shape the designer story</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Manage the About page, skills, tools, and experience timeline that power the portfolio narrative.
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Core profile</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="admin-label">Full name</label>
                <input className="admin-input" value={formData.name_en} onChange={(e) => handleChange('name_en', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">Professional title</label>
                <input className="admin-input" value={formData.title_en} onChange={(e) => handleChange('title_en', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">Short introduction</label>
                <textarea className="admin-textarea min-h-[110px]" value={formData.intro_en} onChange={(e) => handleChange('intro_en', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">Long biography</label>
                <textarea className="admin-textarea min-h-[220px]" value={formData.long_biography_en} onChange={(e) => handleChange('long_biography_en', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">Design philosophy</label>
                <textarea className="admin-textarea min-h-[180px]" value={formData.philosophy_en} onChange={(e) => handleChange('philosophy_en', e.target.value)} />
              </div>
            </div>
          </section>

          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Skills, tools, and experience</h2>
            <div className="mt-6 grid gap-5">
              <div>
                <label className="admin-label">Skills</label>
                <textarea className="admin-textarea min-h-[140px]" value={formData.skillsText} onChange={(e) => handleChange('skillsText', e.target.value)} placeholder="One skill per line" />
                <p className="admin-helper">One skill per line. These populate the public skill cluster and supporting content.</p>
              </div>

              <div>
                <label className="admin-label">Tools</label>
                <textarea className="admin-textarea min-h-[140px]" value={formData.toolsText} onChange={(e) => handleChange('toolsText', e.target.value)} placeholder="One tool per line" />
                <p className="admin-helper">One tool per line, for example: Figma, Framer, Maze, Notion.</p>
              </div>

              <div>
                <label className="admin-label">Experience timeline</label>
                <textarea
                  className="admin-textarea min-h-[180px]"
                  value={formData.experienceText}
                  onChange={(e) => handleChange('experienceText', e.target.value)}
                  placeholder="Role | Company | Period | Summary"
                />
                <p className="admin-helper">Use one line per item with this format: Role | Company | Period | Summary.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Profile media</h2>
            <div className="mt-6 space-y-6">
              <div>
                <label className="admin-label">Profile image</label>
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
                <label className="admin-label">Resume file</label>
                <MediaUpload
                  bucket="portfolio-media"
                  folder="about"
                  currentUrl={formData.resume_url_en}
                  accept="application/pdf"
                  onUploadSuccess={(url) => handleChange('resume_url_en', url)}
                  onRemove={() => handleChange('resume_url_en', '')}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
