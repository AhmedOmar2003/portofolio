'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function ArticlesListPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title_en, title_ar, slug, published_at, cover_image_url, created_at')
        .order('created_at', { ascending: false })
      
      console.log('[Admin Articles] Supabase response:', { data, error })

      if (error) {
        console.error('[Admin Articles] Error:', error.message, error.details, error.hint)
        setFetchError(`${error.message}${error.hint ? ` — Hint: ${error.hint}` : ''}`)
        return
      }
      setArticles(data || [])
    } catch (err) {
      console.error('[Admin Articles] Unexpected error:', err)
      setFetchError('Unexpected error fetching articles.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    
    setDeletingId(id)
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id)
      if (error) throw error
      setArticles(articles.filter(a => a.id !== id))
    } catch (error) {
      console.error('Error deleting article:', error)
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
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Articles</h1>
          <p className="text-white/60">Manage your blog posts and writing.</p>
        </div>
        <Link
          href="./articles/new"
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-light text-brand-dark font-bold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Write Article
        </Link>
      </div>

      {fetchError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-mono">
          <strong>Supabase Error:</strong> {fetchError}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <h3 className="text-xl font-medium text-white mb-2">No articles written</h3>
          <p className="text-white/60 mb-6">Publish your thoughts to share knowledge with the community.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const isPublished = article.published_at && new Date(article.published_at) <= new Date()

            return (
              <div key={article.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:border-white/20 transition-colors">
                <div className="relative h-40 bg-black/20">
                  {article.cover_image_url ? (
                    <Image 
                      src={article.cover_image_url} 
                      alt={article.title_en} 
                      fill 
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
                      No Cover Image
                    </div>
                  )}
                  <div className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full ${isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {isPublished ? 'Published' : 'Draft'}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-primary transition-colors line-clamp-2">
                    {article.title_en}
                  </h3>
                  <p className="text-white/50 text-sm mb-4 line-clamp-1" dir="rtl">
                    {article.title_ar}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-white/40 font-mono">{article.slug}</span>
                    <div className="flex gap-2">
                      <Link
                        href={`./articles/${article.id === 'new' ? 'new' : article.id}`}
                        className="p-2 bg-white/5 hover:bg-blue-500/20 text-white/60 hover:text-blue-400 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={deletingId === article.id}
                        className="p-2 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingId === article.id ? (
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
