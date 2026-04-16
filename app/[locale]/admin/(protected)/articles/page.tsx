'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Edit2, Loader2, Plus, Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'

import { createClient } from '@/utils/supabase/client'
import { getLocaleDateFormat, isArabicLocale } from '@/utils/locale-content'

type ArticleListItem = {
  id: string
  title_en: string
  title_ar?: string
  slug: string
  published_at: string | null
  cover_image_url: string | null
  created_at: string | null
}

export default function ArticlesListPage() {
  const supabase = createClient()
  const [articles, setArticles] = useState<ArticleListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const params = useParams<{ locale: string }>()
  const locale = params?.locale || 'en'

  useEffect(() => {
    void fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title_en, title_ar, slug, published_at, cover_image_url, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setArticles((data as ArticleListItem[]) || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
      setFetchError('Unable to load articles right now.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article? This action cannot be undone.')) return

    setDeletingId(id)
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id)
      if (error) throw error
      setArticles((current) => current.filter((article) => article.id !== id))
    } catch (error) {
      console.error('Error deleting article:', error)
      setFetchError('Unable to delete the article. Please try again.')
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
          <p className="admin-kicker">Articles</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">Editorial content</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Publish product design notes, case study reflections, and perspective pieces that reinforce the portfolio story.
          </p>
        </div>
        <Link href="./articles/new" className="btn btn-primary w-fit text-sm">
          <Plus className="h-4 w-4" />
          New article
        </Link>
      </div>

      {fetchError ? (
        <div className="rounded-[1.15rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {fetchError}
        </div>
      ) : null}

      {articles.length === 0 ? (
        <section className="admin-card px-6 py-10 text-center">
          <h2 className="text-xl font-semibold text-white">No articles yet</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Add your first article to share product thinking, UX lessons, and behind-the-scenes case study insights.
          </p>
          <Link href="./articles/new" className="btn btn-secondary mt-6 inline-flex">
            Create article
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => {
            const isPublished = article.published_at && new Date(article.published_at) <= new Date()
            const statusLabel = isPublished ? 'Published' : 'Draft'
              const dateLabel = article.published_at || article.created_at
                ? new Date(article.published_at || article.created_at || '').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'No date'
              const localizedDateLabel = article.published_at || article.created_at
                ? new Date(article.published_at || article.created_at || '').toLocaleDateString(getLocaleDateFormat(locale), {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
                : 'No date'

            return (
              <article key={article.id} className="admin-card overflow-hidden">
                <div className="relative h-44 border-b border-white/8 bg-[radial-gradient(circle_at_top,rgba(141,246,200,0.18),rgba(6,10,20,0.4)_58%)]">
                  {article.cover_image_url ? (
                    <Image
                      src={article.cover_image_url}
                      alt={isArabicLocale(locale) ? article.title_ar || article.title_en : article.title_en || article.title_ar || ''}
                      fill
                      className="object-cover opacity-80 transition duration-500 hover:scale-[1.02] hover:opacity-100"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                      Cover image not added yet
                    </div>
                  )}
                  <span className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${isPublished ? 'border-emerald-400/20 bg-emerald-400/12 text-emerald-200' : 'border-amber-400/20 bg-amber-400/12 text-amber-200'}`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="flex h-[calc(100%-11rem)] flex-col px-5 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold leading-7 text-white">
                        {isArabicLocale(locale) ? article.title_ar || article.title_en : article.title_en || article.title_ar}
                      </h2>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{localizedDateLabel || dateLabel}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      {article.slug}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-4">
                    <Link
                      href={`./articles/${article.id}`}
                      className="btn btn-secondary h-11 px-4 text-sm"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(article.id)}
                      disabled={deletingId === article.id}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 text-sm font-medium text-rose-100 transition hover:border-rose-300/30 hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === article.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
