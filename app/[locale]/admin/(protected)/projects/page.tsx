'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Edit2, Loader2, Plus, Star, Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'

import { createClient } from '@/utils/supabase/client'
import { isArabicLocale } from '@/utils/locale-content'

type ProjectItem = {
  id: string
  name_en: string
  name_ar?: string
  slug: string
  view_order?: number | null
  is_featured: boolean
  images: string[]
}

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()
  const params = useParams<{ locale: string }>()
  const locale = params?.locale || 'en'

  useEffect(() => {
    void fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const orderedQuery = await supabase
        .from('projects')
        .select('id, name_en, name_ar, slug, view_order, is_featured, images')
        .order('view_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (orderedQuery.error) {
        const fallbackQuery = await supabase
          .from('projects')
          .select('id, name_en, name_ar, slug, is_featured, images')
          .order('created_at', { ascending: false })

        if (fallbackQuery.error) throw fallbackQuery.error
        setProjects((fallbackQuery.data as ProjectItem[]) || [])
        return
      }

      setProjects((orderedQuery.data as ProjectItem[]) || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return

    setDeletingId(id)
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      setProjects((prev) => prev.filter((project) => project.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setDeletingId(null)
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
          <p className="admin-kicker">Projects</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">Case study library</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">Organize featured work, control homepage highlights, and keep every project ready to present as a polished case study.</p>
        </div>

        <Link href="./projects/new" className="btn btn-primary w-fit text-sm">
          <Plus className="h-4 w-4" />
          Add project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="admin-card px-6 py-12 text-center">
          <h2 className="text-xl font-semibold text-white">No projects yet</h2>
          <p className="mt-3 text-sm text-slate-400">Create your first case study to start shaping the portfolio.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="admin-card overflow-hidden">
              <div className="relative h-52 bg-black/20">
                {project.images?.[0] ? (
                  <Image
                    src={project.images[0]}
                    alt={isArabicLocale(locale) ? project.name_ar || project.name_en : project.name_en || project.name_ar || ''}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">No cover image</div>
                )}
                {project.is_featured ? (
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-[#8df6c8]/20 bg-[#8df6c8]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#8df6c8]">
                    <Star className="h-3 w-3" />
                    Featured
                  </span>
                ) : null}
              </div>

              <div className="px-5 py-5">
                <h2 className="text-lg font-semibold text-white">
                  {isArabicLocale(locale) ? project.name_ar || project.name_en : project.name_en || project.name_ar}
                </h2>
                <p className="mt-2 text-sm text-slate-500">{project.slug}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {isArabicLocale(locale) ? 'الترتيب:' : 'Order:'} {typeof project.view_order === 'number' ? project.view_order : 0}
                </p>

                <div className="mt-5 flex items-center gap-3 border-t border-white/8 pt-4">
                  <Link href={`./projects/${project.id}`} className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-slate-200 transition hover:border-white/14 hover:text-white">
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-400/10 bg-rose-400/5 px-3 py-2 text-sm text-rose-200 transition hover:border-rose-400/20 hover:bg-rose-400/10 disabled:opacity-60"
                  >
                    {deletingId === project.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
