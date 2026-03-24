'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, LockKeyhole } from 'lucide-react'
import { useRouter } from 'next/navigation'

import BrandMark from '@/components/ui/BrandMark'
import { createClient } from '@/utils/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.refresh()
    router.push('/en/admin')
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04070f] px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(141,246,200,0.16),transparent_32%),linear-gradient(180deg,rgba(9,14,27,0.94),rgba(4,7,15,1))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <section className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(8,12,22,0.78)] shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.8fr)]">
        <div className="hidden border-r border-white/8 px-10 py-12 lg:block">
          <BrandMark className="mb-6" />
          <p className="admin-kicker">Admin access</p>
          <h1 className="mt-3 max-w-md text-4xl font-semibold tracking-[-0.06em] text-white">
            Manage the portfolio like a polished product.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-slate-400">
            Update hero messaging, case studies, services, articles, and contact details from one clean editorial workspace.
          </p>

          <div className="mt-10 grid gap-4">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Content system</p>
              <p className="mt-3 text-lg font-medium text-white">Hero, about, projects, services, articles, and contact in one place.</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Publishing flow</p>
              <p className="mt-3 text-lg font-medium text-white">Structured forms, cleaner hierarchy, and faster updates without touching code.</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="flex items-center gap-3">
            <BrandMark compact />
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8df6c8]/25 bg-[#8df6c8]/10 text-[#8df6c8]">
              <LockKeyhole className="h-5 w-5" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-white">Portfolio control center</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Sign in to manage content, featured work, and presentation details.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {error ? (
              <div className="rounded-[1.15rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <div>
              <label className="admin-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="admin-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center text-sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {loading ? 'Signing in...' : 'Sign in to dashboard'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
