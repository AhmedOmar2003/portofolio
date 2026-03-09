'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function ProjectsListPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name_en, name_ar, slug, is_featured, images')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (data) setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    setDeletingId(id)
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      setProjects(projects.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setDeletingId(null)
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-white/60">Manage your portfolio case studies and projects.</p>
        </div>
        <Link
          href="./projects/new"
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-light text-brand-dark font-bold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <h3 className="text-xl font-medium text-white mb-2">No projects yet</h3>
          <p className="text-white/60 mb-6">Create your first case study to showcase your work.</p>
          <Link
            href="./projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-light text-brand-dark font-bold rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const coverImage = project.images?.[0] || ''
            
            return (
              <div key={project.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col group">
                <div className="relative h-48 bg-black/20">
                  {coverImage ? (
                    <Image 
                      src={coverImage} 
                      alt={project.name_en} 
                      fill 
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      No Image
                    </div>
                  )}
                  {project.is_featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-brand-primary text-brand-dark text-xs font-bold rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-primary transition-colors line-clamp-1">
                    {project.name_en}
                  </h3>
                  <p className="text-white/50 text-sm mb-4 line-clamp-1" dir="rtl">
                    {project.name_ar}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Link
                        href={`./projects/${project.id === 'new' ? 'new' : project.id}`}
                        className="p-2 bg-white/5 hover:bg-blue-500/20 text-white/60 hover:text-blue-400 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="p-2 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingId === project.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
