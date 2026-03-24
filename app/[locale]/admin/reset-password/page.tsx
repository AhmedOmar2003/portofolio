'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

import BrandMark from '@/components/ui/BrandMark'
import { createClient } from '@/utils/supabase/client'

type MessageState = { type: 'success' | 'error'; text: string } | null

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingLink, setCheckingLink] = useState(true)
  const [recoveryReady, setRecoveryReady] = useState(false)
  const [message, setMessage] = useState<MessageState>(null)

  useEffect(() => {
    const bootRecovery = async () => {
      const hash = typeof window !== 'undefined' ? window.location.hash : ''

      if (hash) {
        const params = new URLSearchParams(hash.replace(/^#/, ''))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            setMessage({ type: 'error', text: 'This recovery link is invalid or expired. Request a new one.' })
            setCheckingLink(false)
            return
          }
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setMessage({ type: 'error', text: 'No active recovery session was found. Open the reset link from your email again.' })
        setCheckingLink(false)
        return
      }

      setRecoveryReady(true)
      setCheckingLink(false)
    }

    void bootRecovery()
  }, [supabase])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Use a password with at least 6 characters.' })
      return
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
      return
    }

    setMessage({ type: 'success', text: 'Password updated successfully. Redirecting you to login...' })
    setLoading(false)

    setTimeout(() => {
      router.push('/en/admin/login')
    }, 1400)
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04070f] px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(141,246,200,0.16),transparent_32%),linear-gradient(180deg,rgba(9,14,27,0.94),rgba(4,7,15,1))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <section className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(8,12,22,0.78)] px-6 py-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-8 sm:py-10">
        <BrandMark className="mb-6" />
        <p className="admin-kicker">Set new password</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">Choose a new admin password</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          This page is only for the secure recovery link sent from Supabase Auth.
        </p>

        {checkingLink ? (
          <div className="mt-8 flex items-center gap-3 rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-[#8df6c8]" />
            Verifying recovery session...
          </div>
        ) : null}

        {message ? (
          <div className={`mt-6 rounded-[1.15rem] border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/20 bg-rose-400/10 text-rose-200'}`}>
            {message.text}
          </div>
        ) : null}

        {recoveryReady ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="admin-label" htmlFor="password">New password</label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input pl-11"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="admin-label" htmlFor="confirmPassword">Confirm password</label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="admin-input pl-11"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center text-sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {loading ? 'Updating password...' : 'Save new password'}
            </button>
          </form>
        ) : null}

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
