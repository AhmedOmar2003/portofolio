'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'

import { createClient } from '@/utils/supabase/client'

type MessageState = { type: 'success' | 'error'; text: string } | null

export default function AboutAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<MessageState>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    intro_en: '',
    intro_ar: '',
    long_biography_en: '',
    long_biography_ar: '',
    philosophy_en: '',
    philosophy_ar: '',
    strengths_en: '',
    strengths_ar: '',
  })

  useEffect(() => {
    void fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase.from('about').select('*').single()
      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        const parseList = (val: unknown) =>
          Array.isArray(val)
            ? val.map((v) => (typeof v === 'string' ? v : String((v as Record<string, unknown>)?.name_en || (v as Record<string, unknown>)?.name || ''))).filter(Boolean).join('\n')
            : typeof val === 'string' ? val : ''

        setFormData({
          title_en:            data.title_en || '',
          title_ar:            data.title_ar || '',
          intro_en:            data.intro_en || '',
          intro_ar:            data.intro_ar || '',
          long_biography_en:   data.long_biography_en || '',
          long_biography_ar:   data.long_biography_ar || '',
          philosophy_en:       data.philosophy_en || '',
          philosophy_ar:       data.philosophy_ar || '',
          strengths_en:        parseList(data.strengths_en) || parseList(data.skills),
          strengths_ar:        parseList(data.strengths_ar) || '',
        })
      }
    } catch (err) {
      console.error('Error fetching about data:', err)
      setMessage({ type: 'error', text: 'Failed to load about content.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toLines = (text: string) =>
    text.split('\n').map((s) => s.trim()).filter(Boolean)

  const handleSave = async () => {
    if (!formData.title_en) {
      setMessage({ type: 'error', text: 'Professional title is required.' })
      return
    }

    setSaving(true)
    setMessage(null)

    const payload = {
      title_en:           formData.title_en,
      title_ar:           formData.title_ar,
      intro_en:           formData.intro_en,
      intro_ar:           formData.intro_ar,
      long_biography_en:  formData.long_biography_en,
      long_biography_ar:  formData.long_biography_ar,
      philosophy_en:      formData.philosophy_en,
      philosophy_ar:      formData.philosophy_ar,
      strengths_en:       toLines(formData.strengths_en),
      strengths_ar:       toLines(formData.strengths_ar),
    }

    try {
      const { data: existing } = await supabase.from('about').select('id').single()
      if (existing) {
        const { error } = await supabase.from('about').update(payload).eq('id', existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('about').insert([payload])
        if (error) throw error
      }
      setMessage({ type: 'success', text: 'Content saved successfully.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error('Error saving about data:', err)
      setMessage({ type: 'error', text: 'Failed to save content.' })
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
    <div className="mx-auto max-w-4xl space-y-6 pb-20">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="admin-kicker">About</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">عني والمحتوى</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-400">
            اكتب رحلتك، مبادئك، وما تقدمه لمشروع العميل. هذا المحتوى يظهر مباشرة في صفحة "عني".
          </p>
        </div>
        <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary w-fit text-sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      {message && (
        <div className={`rounded-[1.15rem] border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/20 bg-rose-400/10 text-rose-200'}`}>
          {message.text}
        </div>
      )}

      {/* ─── Professional title ─── */}
      <section className="admin-card px-6 py-6">
        <h2 className="text-lg font-semibold text-white">المسمى الوظيفي</h2>
        <p className="mt-1 text-sm text-slate-500">يظهر كـ overline / eyebrow أعلى صفحة عني.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="admin-label">Title (English)</label>
            <input className="admin-input" value={formData.title_en} onChange={(e) => handleChange('title_en', e.target.value)} placeholder="UI/UX Designer & Developer" />
          </div>
          <div>
            <label className="admin-label">العنوان (العربية)</label>
            <input dir="rtl" className="admin-input text-right" value={formData.title_ar} onChange={(e) => handleChange('title_ar', e.target.value)} placeholder="مصمم ومطور واجهات" />
          </div>
        </div>
      </section>

      {/* ─── Short intro ─── */}
      <section className="admin-card px-6 py-6">
        <h2 className="text-lg font-semibold text-white">المقدمة المختصرة</h2>
        <p className="mt-1 text-sm text-slate-500">جملة أو جملتان تظهران مباشرة أسفل عنوان الصفحة.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="admin-label">Intro (English)</label>
            <textarea className="admin-textarea min-h-[100px]" value={formData.intro_en} onChange={(e) => handleChange('intro_en', e.target.value)} />
          </div>
          <div>
            <label className="admin-label">المقدمة (العربية)</label>
            <textarea dir="rtl" className="admin-textarea min-h-[100px] text-right" value={formData.intro_ar} onChange={(e) => handleChange('intro_ar', e.target.value)} />
          </div>
        </div>
      </section>

      {/* ─── Journey / Biography ─── */}
      <section className="admin-card px-6 py-6">
        <h2 className="text-lg font-semibold text-white">رحلتي</h2>
        <p className="mt-1 text-sm text-slate-500">
          اكتب قصتك كيف بدأت، ما الذي دفعك، وما الذي تؤمن به. كل سطر يظهر كفقرة مستقلة.
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="admin-label">Journey (English) — one paragraph per line</label>
            <textarea
              className="admin-textarea min-h-[200px]"
              value={formData.long_biography_en}
              onChange={(e) => handleChange('long_biography_en', e.target.value)}
              placeholder={"I started designing when...\nOver the years I've worked on..."}
            />
          </div>
          <div>
            <label className="admin-label">رحلتي (العربية) — فقرة واحدة في كل سطر</label>
            <textarea
              dir="rtl"
              className="admin-textarea min-h-[200px] text-right"
              value={formData.long_biography_ar}
              onChange={(e) => handleChange('long_biography_ar', e.target.value)}
              placeholder={"بدأت رحلتي في التصميم عندما...\nعلى مرّ السنوات..."}
            />
          </div>
        </div>
      </section>

      {/* ─── Principles ─── */}
      <section className="admin-card px-6 py-6">
        <h2 className="text-lg font-semibold text-white">مبادئي</h2>
        <p className="mt-1 text-sm text-slate-500">
          مبادئ أو قيم تؤمن بها. تظهر كقائمة مرقمة في صفحة عني. اكتب كل مبدأ في سطر مستقل.
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="admin-label">Principles (English)</label>
            <textarea
              className="admin-textarea min-h-[160px]"
              value={formData.philosophy_en}
              onChange={(e) => handleChange('philosophy_en', e.target.value)}
              placeholder={"Simplicity is the foundation of great design.\nPerformance is part of the user experience.\nClear communication builds trust."}
            />
          </div>
          <div>
            <label className="admin-label">المبادئ (العربية)</label>
            <textarea
              dir="rtl"
              className="admin-textarea min-h-[160px] text-right"
              value={formData.philosophy_ar}
              onChange={(e) => handleChange('philosophy_ar', e.target.value)}
              placeholder={"البساطة أساس أي تصميم ناجح.\nالأداء جزء من تجربة المستخدم.\nالتواصل الواضح يبني الثقة."}
            />
          </div>
        </div>
      </section>

      {/* ─── What I offer ─── */}
      <section className="admin-card px-6 py-6">
        <h2 className="text-lg font-semibold text-white">اللي بقدمه لمشروعك</h2>
        <p className="mt-1 text-sm text-slate-500">
          Badges تظهر أسفل صفحة عني. مثال: تصميم UI/UX · برمجة قوية · تسليم في الوقت. كل عنصر في سطر مستقل.
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="admin-label">What I offer (English)</label>
            <textarea
              className="admin-textarea min-h-[140px]"
              value={formData.strengths_en}
              onChange={(e) => handleChange('strengths_en', e.target.value)}
              placeholder={"UI/UX Design\nFull-Stack Development\nOn-time delivery\nProblem solving"}
            />
          </div>
          <div>
            <label className="admin-label">ما أقدمه (العربية)</label>
            <textarea
              dir="rtl"
              className="admin-textarea min-h-[140px] text-right"
              value={formData.strengths_ar}
              onChange={(e) => handleChange('strengths_ar', e.target.value)}
              placeholder={"تصميم UI/UX\nبرمجة Full-Stack\nالتسليم في الوقت\nحل المشاكل التقنية"}
            />
          </div>
        </div>
      </section>

      {/* Save button bottom */}
      <div className="flex justify-end pt-2">
        <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary text-sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

    </div>
  )
}
