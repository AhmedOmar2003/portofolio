'use client'

import Image from 'next/image'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import MediaUpload from '@/components/admin/MediaUpload'
import { createClient } from '@/utils/supabase/client'

type MessageState = { type: 'success' | 'error'; text: string } | null

export default function ProjectEditorPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const resolvedParams = use(params)
  const { locale, id } = resolvedParams
  const isArabic = locale === 'ar'
  const isNew = id === 'new'

  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<MessageState>(null)
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    slug: '',
    category: '',
    description_en: '',
    description_ar: '',
    problem_en: '',
    problem_ar: '',
    solution_en: '',
    solution_ar: '',
    process_en: '',
    process_ar: '',
    start_date: '',
    end_date: '',
    is_featured: false,
    images: [] as string[],
    external_links: { live_demo: '', github: '' },
  })

  useEffect(() => {
    if (!isNew) {
      void fetchProject()
    }
  }, [isNew, id])

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
      if (error) throw error

      if (data) {
        setFormData({
          name_en: data.name_en || '',
          name_ar: data.name_ar || '',
          slug: data.slug || '',
          category: data.category || '',
          description_en: data.description_en || '',
          description_ar: data.description_ar || '',
          problem_en: data.problem_en || '',
          problem_ar: data.problem_ar || '',
          solution_en: data.solution_en || '',
          solution_ar: data.solution_ar || '',
          process_en: data.process_en || '',
          process_ar: data.process_ar || '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          is_featured: data.is_featured || false,
          images: data.images || [],
          external_links: data.external_links || { live_demo: '', github: '' },
        })
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      setMessage({ type: 'error', text: 'Failed to load the project.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLinkChange = (key: keyof typeof formData.external_links, value: string) => {
    setFormData((prev) => ({
      ...prev,
      external_links: { ...prev.external_links, [key]: value },
    }))
  }

  const generateSlug = () => {
    if (!formData.name_en) return
    const slug = formData.name_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
    handleChange('slug', slug)
  }

  const handleSave = async () => {
    if (!formData.name_en || !formData.slug) {
      setMessage({ type: 'error', text: 'Project name and slug are required.' })
      return
    }

    setSaving(true)
    setMessage(null)

    const payload = {
      name_en: formData.name_en,
      name_ar: formData.name_ar,
      slug: formData.slug,
      category: formData.category,
      description_en: formData.description_en,
      description_ar: formData.description_ar,
      problem_en: formData.problem_en,
      problem_ar: formData.problem_ar,
      solution_en: formData.solution_en,
      solution_ar: formData.solution_ar,
      process_en: formData.process_en,
      process_ar: formData.process_ar,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      is_featured: formData.is_featured,
      images: formData.images,
      external_links: formData.external_links,
    }

    try {
      if (isNew) {
        const { error } = await supabase.from('projects').insert([payload])
        if (error) throw error
        setMessage({ type: 'success', text: 'Project created successfully.' })
        setTimeout(() => router.push(`/${locale}/admin/projects`), 1200)
      } else {
        const { error } = await supabase.from('projects').update(payload).eq('id', id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Project updated successfully.' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      console.error('Error saving project:', error)
      setMessage({ type: 'error', text: 'Failed to save the project.' })
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
      <Link href={`/${locale}/admin/projects`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white">
        <ArrowLeft className={`h-4 w-4 ${isArabic ? 'rtl-flip' : ''}`} />
        {isArabic ? 'رجوع للمشاريع' : 'Back to projects'}
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="admin-kicker">Projects</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">{isNew ? 'Create case study' : 'Edit case study'}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Manage the public project card, case study content, media, links, and homepage feature visibility.
          </p>
        </div>

        <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary w-fit text-sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save project'}
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
            <h2 className="text-xl font-semibold text-white">General information</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="admin-label">Project title (English)</label>
                <input className="admin-input" value={formData.name_en} onChange={(e) => handleChange('name_en', e.target.value)} onBlur={isNew ? generateSlug : undefined} />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">عنوان المشروع (العربية)</label>
                <input
                  dir="rtl"
                  className="admin-input text-right"
                  value={formData.name_ar}
                  onChange={(e) => handleChange('name_ar', e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Slug</label>
                <input className="admin-input" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} placeholder="smart-banking-app" />
              </div>
              <div>
                <label className="admin-label">Category</label>
                <input className="admin-input" value={formData.category} onChange={(e) => handleChange('category', e.target.value)} placeholder="Product Design, SaaS, UX Audit..." />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">Project summary (English)</label>
                <textarea className="admin-textarea min-h-[120px]" value={formData.description_en} onChange={(e) => handleChange('description_en', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">ملخص المشروع (العربية)</label>
                <textarea
                  dir="rtl"
                  className="admin-textarea min-h-[120px] text-right"
                  value={formData.description_ar}
                  onChange={(e) => handleChange('description_ar', e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Case study content</h2>
            <div className="mt-6 grid gap-5">
              <div>
                <label className="admin-label">Problem (English)</label>
                <textarea className="admin-textarea min-h-[150px]" value={formData.problem_en} onChange={(e) => handleChange('problem_en', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">المشكلة (العربية)</label>
                <textarea
                  dir="rtl"
                  className="admin-textarea min-h-[150px] text-right"
                  value={formData.problem_ar}
                  onChange={(e) => handleChange('problem_ar', e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Design process (English)</label>
                <textarea className="admin-textarea min-h-[180px]" value={formData.process_en} onChange={(e) => handleChange('process_en', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">عملية التصميم (العربية)</label>
                <textarea
                  dir="rtl"
                  className="admin-textarea min-h-[180px] text-right"
                  value={formData.process_ar}
                  onChange={(e) => handleChange('process_ar', e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Results and impact (English)</label>
                <textarea className="admin-textarea min-h-[150px]" value={formData.solution_en} onChange={(e) => handleChange('solution_en', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">النتائج والأثر (العربية)</label>
                <textarea
                  dir="rtl"
                  className="admin-textarea min-h-[150px] text-right"
                  value={formData.solution_ar}
                  onChange={(e) => handleChange('solution_ar', e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">External links</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="admin-label">Live demo</label>
                <input className="admin-input" value={formData.external_links.live_demo || ''} onChange={(e) => handleLinkChange('live_demo', e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="admin-label">Repository / source</label>
                <input className="admin-input" value={formData.external_links.github || ''} onChange={(e) => handleLinkChange('github', e.target.value)} placeholder="https://github.com/..." />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Publishing</h2>
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-3">
                <input
                  id="featured-project"
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => handleChange('is_featured', e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-black/20 accent-[var(--color-green-accent)]"
                />
                <label htmlFor="featured-project" className="text-sm text-slate-300">
                  Feature this project on the homepage
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <div>
                  <label className="admin-label">Start date</label>
                  <input type="date" className="admin-input [color-scheme:dark]" value={formData.start_date} onChange={(e) => handleChange('start_date', e.target.value)} />
                </div>
                <div>
                  <label className="admin-label">End date</label>
                  <input type="date" className="admin-input [color-scheme:dark]" value={formData.end_date} onChange={(e) => handleChange('end_date', e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Gallery images</h2>
            <p className="mt-1 text-sm text-slate-500">Up to 4 images — first is the cover shown on the project card.</p>
            <div className="mt-6 space-y-5">
              {(['Cover', 'Supporting 1', 'Supporting 2', 'Supporting 3'] as const).map((label, index) => (
                <div key={label}>
                  <p className="admin-label mb-2">Image {index + 1} — {label}</p>
                  {formData.images[index] ? (
                    <div className="group relative overflow-hidden rounded-[1.2rem] border border-white/10">
                      <Image src={formData.images[index]} alt={`Project asset ${index + 1}`} width={640} height={360} className="h-40 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.images];
                          updated.splice(index, 1);
                          handleChange('images', updated);
                        }}
                        className="absolute right-3 top-3 rounded-xl border border-rose-400/20 bg-rose-400/10 p-2 text-rose-200 opacity-0 transition group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <MediaUpload
                      bucket="portfolio-media"
                      folder="projects"
                      accept="image/*"
                      onUploadSuccess={(url) => {
                        const updated = [...formData.images];
                        updated[index] = url;
                        handleChange('images', updated);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
