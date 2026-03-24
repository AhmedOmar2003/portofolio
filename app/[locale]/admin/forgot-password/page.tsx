'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Loader2, Mail } from 'lucide-react'

import BrandMark from '@/components/ui/BrandMark'
import { createClient } from '@/utils/supabase/client'

type MessageState = { type: 'success' | 'error'; text: string } | null

export default function ForgotPasswordPage() {
  const [supabase] = useState(() => createClient())
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<MessageState>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/en/admin/reset-password`
        : undefined

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
      return
    }

    setMessage({
      type: 'success',
      text: 'Password reset link sent. Open the email on the same device and follow the link to the reset page.',
    })
    setLoading(false)
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04070f] px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(141,246,200,0.16),transparent_32%),linear-gradient(180deg,rgba(9,14,27,0.94),rgba(4,7,15,1))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <section className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(8,12,22,0.78)] px-6 py-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-8 sm:py-10">
        <BrandMark className="mb-6" />
        <p className="admin-kicker">Password recovery</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">Reset your admin password</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Enter the admin email and we will send you a secure link that opens the dedicated reset page.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {message ? (
            <div className={`rounded-[1.15rem] border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/20 bg-rose-400/10 text-rose-200'}`}>
              {message.text}
            </div>
          ) : null}

          <div>
            <label className="admin-label" htmlFor="email">Admin email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input pl-11"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center text-sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {loading ? 'Sending reset link...' : 'Send reset link'}
          </button>
        </form>

        <div className="mt-6">
          <Link href="/en/admin/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </section>
    </main>
  )
}
