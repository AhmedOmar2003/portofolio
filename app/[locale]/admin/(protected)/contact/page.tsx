'use client'

import { useEffect, useState } from 'react'
import { Github, Instagram, Link as LinkIcon, Linkedin, Loader2, Mail, Phone, Plus, Save, Twitter, X } from 'lucide-react'

import { createClient } from '@/utils/supabase/client'

const ICONS = {
  phone: Phone,
  email: Mail,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  github: Github,
  link: LinkIcon,
}

type ContactMethod = {
  id: string
  type: keyof typeof ICONS
  label_en: string
  label_ar: string
  value: string
  icon: keyof typeof ICONS
  is_visible: boolean
  view_order: number
  _isNew?: boolean
}

export default function ContactMethodsPage() {
  const [methods, setMethods] = useState<ContactMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    void fetchMethods()
  }, [])

  const fetchMethods = async () => {
    try {
      const { data, error } = await supabase.from('contact_methods').select('*').order('view_order', { ascending: true })
      if (error) throw error
      setMethods((data as ContactMethod[]) || [])
    } catch (error) {
      console.error('Error fetching contact methods:', error)
      setMessage({ type: 'error', text: 'Failed to load contact methods.' })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setMethods((prev) => [
      ...prev,
      {
        id: `new_${Date.now()}`,
        type: 'email',
        label_en: '',
        label_ar: '',
        value: '',
        icon: 'email',
        is_visible: true,
        view_order: prev.length,
        _isNew: true,
      },
    ])
  }

  const handleChange = <K extends keyof ContactMethod>(index: number, field: K, value: ContactMethod[K]) => {
    setMethods((prev) => prev.map((method, methodIndex) => (methodIndex === index ? { ...method, [field]: value } : method)))
  }

  const handleRemove = async (index: number) => {
    const method = methods[index]

    if (!method._isNew) {
      if (!confirm('Delete this contact method?')) return
      await supabase.from('contact_methods').delete().eq('id', method.id)
    }

    setMethods((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const results = await Promise.all(
        methods.map((method, index) => {
          const payload = {
            type: method.type,
            label_en: method.label_en,
            label_ar: method.label_ar,
            value: method.value,
            icon: method.icon,
            is_visible: method.is_visible,
            view_order: index,
          }

          return method._isNew
            ? supabase.from('contact_methods').insert([payload])
            : supabase.from('contact_methods').update(payload).eq('id', method.id)
        })
      )

      if (results.some((result) => result.error)) {
        throw new Error('One or more contact methods failed to save.')
      }

      setMessage({ type: 'success', text: 'Contact methods updated successfully.' })
      await fetchMethods()
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error saving contact methods:', error)
      setMessage({ type: 'error', text: 'Failed to save contact methods.' })
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

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="admin-kicker">Contact</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">Manage contact paths</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">Control the ways visitors can reach out, from direct email to social and professional profiles.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleAdd} className="btn btn-secondary text-sm">
            <Plus className="h-4 w-4" />
            Add method
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary text-sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      {message ? (
        <div className={`rounded-[1.15rem] border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/20 bg-rose-400/10 text-rose-200'}`}>
          {message.text}
        </div>
      ) : null}

      <div className="space-y-4">
        {methods.length > 0 ? (
          methods.map((method, index) => {
            const IconComponent = ICONS[method.icon] || LinkIcon

            return (
              <section key={method.id} className="admin-card relative px-6 py-6">
                <button
                  type="button"
                  onClick={() => void handleRemove(index)}
                  className="absolute right-4 top-4 rounded-xl border border-white/8 bg-white/[0.03] p-2 text-slate-400 transition hover:border-rose-400/20 hover:bg-rose-400/10 hover:text-rose-200"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)]">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#8df6c8]">
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <div>
                      <label className="admin-label">Type</label>
                      <select className="admin-select" value={method.type} onChange={(e) => handleChange(index, 'type', e.target.value as ContactMethod['type'])}>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter / X</option>
                        <option value="instagram">Instagram</option>
                        <option value="github">GitHub</option>
                        <option value="link">Other Link</option>
                      </select>
                    </div>

                    <div>
                      <label className="admin-label">Icon</label>
                      <select className="admin-select" value={method.icon} onChange={(e) => handleChange(index, 'icon', e.target.value as ContactMethod['icon'])}>
                        {Object.keys(ICONS).map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="admin-label">Label (English)</label>
                      <input className="admin-input" value={method.label_en} onChange={(e) => handleChange(index, 'label_en', e.target.value)} placeholder="e.g. Email me" />
                    </div>

                    <div>
                      <label className="admin-label">الاسم الظاهر (العربية)</label>
                      <input
                        dir="rtl"
                        className="admin-input text-right"
                        value={method.label_ar}
                        onChange={(e) => handleChange(index, 'label_ar', e.target.value)}
                        placeholder="مثال: تواصل عبر البريد"
                      />
                    </div>

                    <div>
                      <label className="admin-label">Value</label>
                      <input className="admin-input" value={method.value} onChange={(e) => handleChange(index, 'value', e.target.value)} placeholder="mailto:..., tel:..., https://..." />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <input
                    id={`visible-${method.id}`}
                    type="checkbox"
                    checked={method.is_visible}
                    onChange={(e) => handleChange(index, 'is_visible', e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-black/20 accent-[var(--color-green-accent)]"
                  />
                  <label htmlFor={`visible-${method.id}`} className="text-sm text-slate-300">
                    Visible on the website
                  </label>
                </div>
              </section>
            )
          })
        ) : (
          <div className="admin-card px-6 py-10 text-center text-sm text-slate-500">No contact methods added yet.</div>
        )}
      </div>
    </div>
  )
}
