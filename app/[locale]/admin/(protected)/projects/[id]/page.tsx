'use client'

import Image from 'next/image'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import MediaUpload from '@/components/admin/MediaUpload'
import { createClient } from '@/utils/supabase/client'
import { getProjectTypeLabel, normalizeProjectType, type ProjectType } from '@/utils/project-type'

type MessageState = { type: 'success' | 'error'; text: string } | null

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

export default function ProjectEditorPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
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
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    slug: '',
    category: '',
    project_type: 'design' as ProjectType,
    description_en: '',
    description_ar: '',
    problem_en: '',
    problem_ar: '',
    solution_en: '',
    solution_ar: '',
    idea_en: '',
    idea_ar: '',
    ui_ux_en: '',
    ui_ux_ar: '',
    technologiesInput: '',
    start_date: '',
    end_date: '',
    view_order: 0,
    is_featured: false,
    images: [] as string[],
    videos: [] as string[],
    external_links: { live_demo: '', github: '', android: '', ios: '', project_type: 'design' as ProjectType },
  })

  useEffect(() => {
    if (!isNew) {
      void fetchProject()
    } else {
      void fetchMaxOrder()
    }
  }, [isNew, id])

  const normalizeImages = (images: string[]) =>
    images
      .filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
      .slice(0, 4)

  const fetchMaxOrder = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('view_order')
      .order('view_order', { ascending: false })
      .limit(1)

    if (error) {
      console.warn('Could not load project order field yet:', error.message)
    }

    const maxOrder = data?.[0]?.view_order
    setFormData((prev) => ({
      ...prev,
      view_order: typeof maxOrder === 'number' ? maxOrder + 1 : 0,
    }))
    setLoading(false)
  }

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
      if (error) throw error

      if (data) {
        const externalLinks = (data.external_links || {}) as {
          live_demo?: string;
          github?: string;
          android?: string;
          ios?: string;
          project_type?: string;
        }
        const normalizedProjectType = normalizeProjectType(externalLinks.project_type)

        setFormData({
          name_en: data.name_en || '',
          name_ar: data.name_ar || '',
          slug: data.slug || '',
          category: data.category || '',
          project_type: normalizedProjectType,
          description_en: data.description_en || '',
          description_ar: data.description_ar || '',
          problem_en: data.problem_en || '',
          problem_ar: data.problem_ar || '',
          solution_en: data.solution_en || '',
          solution_ar: data.solution_ar || '',
          idea_en: data.idea_en || '',
          idea_ar: data.idea_ar || '',
          ui_ux_en: data.ui_ux_en || '',
          ui_ux_ar: data.ui_ux_ar || '',
          technologiesInput: Array.isArray(data.technologies) ? data.technologies.join(', ') : '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          view_order: typeof data.view_order === 'number' ? data.view_order : 0,
          is_featured: data.is_featured || false,
          images: normalizeImages(Array.isArray(data.images) ? data.images : []),
          videos: data.videos || [],
          external_links: {
            live_demo: externalLinks.live_demo || '',
            github: externalLinks.github || '',
            android: externalLinks.android || '',
            ios: externalLinks.ios || '',
            project_type: normalizedProjectType,
          },
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

  const handleVideoUrlChange = (value: string) => {
    const normalized = value.trim()
    handleChange('videos', normalized ? [normalized] : [])
  }

  const persistProjectImages = async (nextImages: string[]) => {
    if (isNew) return true

    setMediaSyncing(true)
    const normalized = normalizeImages(nextImages)

    try {
      const { error } = await supabase.from('projects').update({ images: normalized }).eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Image changes saved.' })
      setTimeout(() => setMessage(null), 1800)
      return true
    } catch (error) {
      console.error('Error syncing project images:', error)
      setMessage({ type: 'error', text: 'Could not save image deletion. Please try again.' })
      return false
    } finally {
      setMediaSyncing(false)
    }
  }

  const handleRemoveProjectImage = async (index: number) => {
    const previous = [...formData.images]
    const updated = previous.filter((_, currentIndex) => currentIndex !== index)

    handleChange('images', updated)

    const synced = await persistProjectImages(updated)
    if (!synced) {
      handleChange('images', previous)
    }
  }

  const createSlugFromName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

  const generateSlug = () => {
    if (!formData.name_en) return
    const slug = createSlugFromName(formData.name_en)
    handleChange('slug', slug)
  }

  const handleSave = async () => {
    const normalizedSlug = (formData.slug || createSlugFromName(formData.name_en)).trim()
    if (!formData.name_en || !normalizedSlug) {
      setMessage({ type: 'error', text: 'Project name and slug are required.' })
      return
    }

    if (normalizedSlug !== formData.slug) {
      handleChange('slug', normalizedSlug)
    }

    setSaving(true)
    setMessage(null)

    const payload = {
      name_en: formData.name_en,
      name_ar: formData.name_ar,
      slug: normalizedSlug,
      category: formData.category,
      description_en: formData.description_en,
      description_ar: formData.description_ar,
      problem_en: formData.problem_en,
      problem_ar: formData.problem_ar,
      solution_en: formData.solution_en,
      solution_ar: formData.solution_ar,
      idea_en: formData.idea_en,
      idea_ar: formData.idea_ar,
      ui_ux_en: formData.ui_ux_en,
      ui_ux_ar: formData.ui_ux_ar,
      technologies: formData.technologiesInput.split(',').map(s => s.trim()).filter(Boolean),
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      view_order: Number.isFinite(formData.view_order) ? formData.view_order : 0,
      is_featured: formData.is_featured,
      images: normalizeImages(formData.images),
      videos: formData.videos.slice(0, 1), // Enforce 1 video max
      external_links: {
        live_demo: formData.external_links.live_demo || '',
        github: formData.external_links.github || '',
        android: formData.external_links.android || '',
        ios: formData.external_links.ios || '',
        project_type: formData.project_type,
      },
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
      const errorText = error instanceof Error ? error.message : String(error)
      if (errorText.toLowerCase().includes('view_order')) {
        setMessage({
          type: 'error',
          text: 'Project order column is missing. Run projects-view-order-migration.sql in Supabase, then try again.',
        })
      } else {
        setMessage({ type: 'error', text: 'Failed to save the project.' })
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

  const isDesignProject = formData.project_type === 'design'

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
              {!isDesignProject ? (
                <>
                  <div>
                    <label className="admin-label">Slug</label>
                    <input className="admin-input" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} placeholder="smart-banking-app" />
                  </div>
                  <div>
                    <label className="admin-label">Category</label>
                    <input
                      className="admin-input"
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      placeholder={isArabic ? 'ويب، موبايل، داشبورد...' : 'Web App, Mobile App, Dashboard...'}
                    />
                    <p className="admin-helper mt-2">
                      {isArabic ? 'التصنيف يوضح شكل/منصة المشروع.' : 'Category describes the platform or format of the project.'}
                    </p>
                  </div>
                </>
              ) : null}
              <div>
                <label className="admin-label">Project type</label>
                <select
                  className="admin-input"
                  value={formData.project_type}
                  onChange={(e) => handleChange('project_type', e.target.value as ProjectType)}
                >
                  <option value="design">{getProjectTypeLabel('design', locale)}</option>
                  <option value="programming">{getProjectTypeLabel('programming', locale)}</option>
                  <option value="applications">{getProjectTypeLabel('applications', locale)}</option>
                </select>
                <p className="admin-helper mt-2">
                  {isArabic ? 'اختار نوع المشروع: تصميم أو برمجة أو تطبيقات.' : 'Choose one project type: Design, Programming, or Applications.'}
                </p>
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
                <label className="admin-label">The Idea (English)</label>
                <textarea className="admin-textarea min-h-[150px]" value={formData.idea_en} onChange={(e) => handleChange('idea_en', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">الفكرة (العربية)</label>
                <textarea
                  dir="rtl"
                  className="admin-textarea min-h-[150px] text-right"
                  value={formData.idea_ar}
                  onChange={(e) => handleChange('idea_ar', e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Challenges (English)</label>
                <textarea className="admin-textarea min-h-[150px]" value={formData.problem_en} onChange={(e) => handleChange('problem_en', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">التحديات (العربية)</label>
                <textarea
                  dir="rtl"
                  className="admin-textarea min-h-[150px] text-right"
                  value={formData.problem_ar}
                  onChange={(e) => handleChange('problem_ar', e.target.value)}
                />
              </div>
              {!isDesignProject ? (
                <>
                  <div>
                    <label className="admin-label">UI/UX Design (English - Optional)</label>
                    <textarea className="admin-textarea min-h-[120px]" value={formData.ui_ux_en} onChange={(e) => handleChange('ui_ux_en', e.target.value)} />
                  </div>
                  <div>
                    <label className="admin-label">تصميم UI/UX (العربية - اختياري)</label>
                    <textarea
                      dir="rtl"
                      className="admin-textarea min-h-[120px] text-right"
                      value={formData.ui_ux_ar}
                      onChange={(e) => handleChange('ui_ux_ar', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-label">Technologies Used (Comma separated: React, Next.js, Figma)</label>
                    <input className="admin-input" value={formData.technologiesInput} onChange={(e) => handleChange('technologiesInput', e.target.value)} placeholder="React, Figma, Supabase" />
                  </div>
                </>
              ) : null}
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
            {isDesignProject ? (
              <div className="mt-6 grid gap-5">
                <div>
                  <label className="admin-label">{isArabic ? 'رابط المشروع (مثال)' : 'Project link (example)'}</label>
                  <input className="admin-input" value={formData.external_links.live_demo || ''} onChange={(e) => handleLinkChange('live_demo', e.target.value)} placeholder="https://..." />
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="admin-label">Live demo</label>
                  <input className="admin-input" value={formData.external_links.live_demo || ''} onChange={(e) => handleLinkChange('live_demo', e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label className="admin-label">Repository / source</label>
                  <input className="admin-input" value={formData.external_links.github || ''} onChange={(e) => handleLinkChange('github', e.target.value)} placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="admin-label">Android app link (optional)</label>
                  <input className="admin-input" value={formData.external_links.android || ''} onChange={(e) => handleLinkChange('android', e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label className="admin-label">iOS app link (optional)</label>
                  <input className="admin-input" value={formData.external_links.ios || ''} onChange={(e) => handleLinkChange('ios', e.target.value)} placeholder="https://..." />
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          {!isDesignProject ? (
            <section className="admin-card px-6 py-6">
              <h2 className="text-xl font-semibold text-white">Publishing</h2>
              <div className="mt-6 space-y-5">
                <div>
                  <label className="admin-label">Display order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={formData.view_order}
                    onChange={(e) => handleChange('view_order', Number(e.target.value))}
                  />
                  <p className="admin-helper mt-2">
                    Smaller numbers appear first on the Projects page.
                  </p>
                </div>

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
          ) : null}

          <section className="admin-card px-6 py-6">
            <h2 className="text-xl font-semibold text-white">Media Gallery</h2>
            <p className="mt-1 text-sm text-slate-500">Up to 4 images max (PNG/JPG/JPEG/WebP). Images are auto-converted to WebP.</p>
            <div className="mt-6 space-y-5">
              {(['Hero Cover', 'Gallery 1', 'Gallery 2', 'Gallery 3'] as const).map((label, index) => (
                <div key={label}>
                  <p className="admin-label mb-2">Image {index + 1} — {label}</p>
                  {formData.images[index] ? (
                    <div className="group relative overflow-hidden rounded-[1.2rem] border border-white/10">
                      <Image src={formData.images[index]} alt={`Project asset ${index + 1}`} width={640} height={360} className="h-40 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => void handleRemoveProjectImage(index)}
                        disabled={mediaSyncing}
                        className="absolute right-3 top-3 rounded-xl border border-rose-400/20 bg-rose-400/10 p-2 text-rose-200 opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
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

              <div className="mt-8 border-t border-white/10 pt-8">
                <p className="admin-label mb-2">Project Video URL (Optional)</p>
                <input
                  type="url"
                  className="admin-input"
                  value={formData.videos[0] || ''}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="https://... (MP4 / YouTube / Vimeo)"
                />
                <p className="admin-helper">
                  استخدم رابط فيديو مباشر أو رابط YouTube/Vimeo بدل الرفع من الجهاز.
                </p>

                {formData.videos[0] ? (
                  <div className="group relative mt-4 overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/20">
                    {(() => {
                      const preview = getVideoPreview(formData.videos[0])
                      if (!preview) return null

                      if (preview.kind === 'embed') {
                        return (
                          <iframe
                            src={preview.src}
                            className="h-56 w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Project video preview"
                          />
                        )
                      }

                      return <video src={preview.src} className="h-56 w-full object-cover" controls />
                    })()}
                    <button
                      type="button"
                      onClick={() => handleChange('videos', [])}
                      className="absolute right-3 top-3 rounded-xl border border-rose-400/20 bg-rose-400/10 p-2 text-rose-200 opacity-0 transition group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
