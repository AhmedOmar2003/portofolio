'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'


export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Using core next-intl, but since this is admin, we could hardcode English.
  // We'll keep it simple for now or use the generic t function if possible.
  // We'll hardcode English for login page to keep it simple and robust, this is just for the website owner.
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Refresh route to ensure layout re-evaluates session
    router.refresh()
    router.push('/en/admin') 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark/95">
      <div className="w-full max-w-md p-8 bg-brand-dark border border-white/10 rounded-2xl shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-serif italic text-white mb-2">Admin Portal</h1>
          <p className="text-white/60">Portfolio Control Center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-white outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-primary hover:bg-brand-primary-light text-brand-dark font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
