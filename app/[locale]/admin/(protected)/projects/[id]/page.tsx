'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import LanguageTabs from '@/components/admin/LanguageTabs'
import MediaUpload from '@/components/admin/MediaUpload'
import { Save, Loader2, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ProjectEditorPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
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
    name_en: '', name_ar: '',
    slug: '',
    category: '',
    description_en: '', description_ar: '',
    problem_en: '', problem_ar: '',
    solution_en: '', solution_ar: '',
    process_en: '', process_ar: '',
    start_date: '', end_date: '',
    is_featured: false,
    images: [] as string[],
    videos: [] as string[],
    external_links: { live_demo: '', github: '' }
  })

  useEffect(() => {
    if (!isNew) fetchProject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew])

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
      if (error) throw error
      if (data) {
        setFormData({
          name_en: data.name_en || '', name_ar: data.name_ar || '',
          slug: data.slug || '',
          category: data.category || '',
          description_en: data.description_en || '', description_ar: data.description_ar || '',
          problem_en: data.problem_en || '', problem_ar: data.problem_ar || '',
          solution_en: data.solution_en || '', solution_ar: data.solution_ar || '',
          process_en: data.process_en || '', process_ar: data.process_ar || '',
          start_date: data.start_date || '', end_date: data.end_date || '',
          is_featured: data.is_featured || false,
          images: data.images || [],
          videos: data.videos || [],
          external_links: data.external_links || { live_demo: '', github: '' }
        })
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      setMessage({ type: 'error', text: 'Failed to load project.' })
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLinkChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      external_links: { ...prev.external_links, [key]: value }
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
      setMessage({ type: 'error', text: 'English Name and Slug are required.' })
      return
    }

    setSaving(true)
    setMessage(null)
    try {
      if (isNew) {
        const { error } = await supabase.from('projects').insert([formData])
        if (error) throw error
        setMessage({ type: 'success', text: 'Project created successfully!' })
        setTimeout(() => router.push(`/${locale}/admin/projects`), 1500)
      } else {
        const { error } = await supabase.from('projects').update(formData).eq('id', id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Project updated successfully!' })
        setTimeout(() => setMessage(null), 3000)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error saving project' })
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
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-6">
        <Link href={`/${locale}/admin/projects`} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isNew ? 'Create New Project' : 'Edit Project'}
          </h1>
          <p className="text-white/60">
            {isNew ? 'Add a new case study to your portfolio.' : `Editing: ${formData.name_en || 'Untitled'}`}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-light text-brand-dark font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Project'}
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
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Info */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-5">
            <h2 className="text-xl font-bold text-white mb-4">General Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">English Name *</label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => handleChange('name_en', e.target.value)}
                  onBlur={isNew ? generateSlug : undefined}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none"
                  required
                />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium text-white/80 mb-2 text-right">Arabic Name *</label>
                <input
                  type="text"
                  value={formData.name_ar}
                  onChange={(e) => handleChange('name_ar', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none text-right"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">URL Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none"
                  placeholder="e.g. smart-banking-app"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none"
                  placeholder="e.g. UX/UI Design, Web App"
                />
              </div>
            </div>
          </div>

          {/* Bilingual Content */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Project Details</h2>
              <LanguageTabs activeLanguage={activeLang} onLanguageChange={setActiveLang} />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Brief Description</label>
                <textarea
                  rows={3}
                  value={activeLang === 'en' ? formData.description_en : formData.description_ar}
                  onChange={(e) => handleChange(`description_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">The Problem</label>
                <textarea
                  rows={4}
                  value={activeLang === 'en' ? formData.problem_en : formData.problem_ar}
                  onChange={(e) => handleChange(`problem_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">The Solution</label>
                <textarea
                  rows={4}
                  value={activeLang === 'en' ? formData.solution_en : formData.solution_ar}
                  onChange={(e) => handleChange(`solution_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Design Process</label>
                <textarea
                  rows={5}
                  value={activeLang === 'en' ? formData.process_en : formData.process_ar}
                  onChange={(e) => handleChange(`process_${activeLang}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none resize-none"
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media & Settings */}
        <div className="space-y-8">
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            
            <label 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleChange('is_featured', !formData.is_featured)}
            >
              <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.is_featured ? 'bg-brand-primary' : 'bg-white/20'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.is_featured ? 'translate-x-7 bg-brand-dark' : 'translate-x-1'}`} />
              </div>
              <span className="text-white/80 group-hover:text-white transition-colors">Featured Project</span>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => handleChange('end_date', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-bold text-white">External Links</h3>
              <div>
                <label className="block text-xs text-white/60 mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={formData.external_links.live_demo || ''}
                  onChange={(e) => handleLinkChange('live_demo', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary text-white outline-none text-sm"
                  placeholder="https://"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Gallery (Images)</h2>
            <div className="space-y-4">
              {formData.images.map((imgUrl, index) => (
                <div key={index} className="relative group">
                  <Image src={imgUrl} alt={`Gallery ${index}`} width={300} height={200} className="w-full h-32 object-cover rounded-xl border border-white/10" />
                  <button
                    onClick={() => handleChange('images', formData.images.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <MediaUpload
                bucket="portfolio-media"
                folder="projects"
                accept="image/*"
                onUploadSuccess={(url) => handleChange('images', [...formData.images, url])}
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
