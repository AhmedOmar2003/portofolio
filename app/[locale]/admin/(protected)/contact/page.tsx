'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Loader2, Save, X, Phone, Mail, Link as LinkIcon, Instagram, Linkedin, Twitter, Github } from 'lucide-react'
import LanguageTabs from '@/components/admin/LanguageTabs'

const ICONS = {
  phone: Phone,
  email: Mail,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  github: Github,
  link: LinkIcon
}

export default function ContactMethodsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [methods, setMethods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchMethods()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_methods')
        .select('*')
        .order('view_order', { ascending: true })
      
      if (error) throw error
      if (data) setMethods(data)
    } catch (error) {
      console.error('Error fetching contact methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setMethods([
      ...methods, 
      { 
        id: `new_${Date.now()}`, 
        type: 'email', 
        label_en: '', 
        label_ar: '', 
        value: '', 
        icon: 'email', 
        is_visible: true, 
        view_order: methods.length,
        _isNew: true
      }
    ])
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (index: number, field: string, value: any) => {
    const newMethods = [...methods]
    newMethods[index] = { ...newMethods[index], [field]: value }
    setMethods(newMethods)
  }

  const handleRemove = async (index: number) => {
    const method = methods[index]
    if (!method._isNew) {
      if (!confirm('Are you sure you want to delete this contact method from the database?')) return
      try {
        await supabase.from('contact_methods').delete().eq('id', method.id)
      } catch (e) {
        console.error('Error deleting', e)
        return
      }
    }
    const newMethods = [...methods]
    newMethods.splice(index, 1)
    setMethods(newMethods)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      // Filter out new methods correctly and update existing ones
      const promises = methods.map((m, idx) => {
        const payload = {
          type: m.type,
          label_en: m.label_en,
          label_ar: m.label_ar,
          value: m.value,
          icon: m.icon,
          is_visible: m.is_visible,
          view_order: idx
        }

        if (m._isNew) {
          return supabase.from('contact_methods').insert([payload])
        } else {
          return supabase.from('contact_methods').update(payload).eq('id', m.id)
        }
      })

      const results = await Promise.all(promises)
      const hasErrors = results.some(r => r.error !== null)
      
      if (hasErrors) throw new Error('Some methods failed to save.')
      
      setMessage({ type: 'success', text: 'Contact methods saved successfully!' })
      await fetchMethods() // Refresh
      setTimeout(() => setMessage(null), 3000)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error saving data' })
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contact Methods</h1>
          <p className="text-white/60">Manage how clients can reach you.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10"
          >
            <Plus className="w-5 h-5" />
            Add Method
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-light text-brand-dark font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-8 rounded-xl border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <LanguageTabs activeLanguage={activeLang} onLanguageChange={setActiveLang} />
      </div>

      <div className="space-y-4">
        {methods.map((method, index) => {
          const IconComponent = ICONS[method.icon as keyof typeof ICONS] || LinkIcon

          return (
            <div key={method.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-6 relative group">
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-4 right-4 p-1.5 text-white/30 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                <IconComponent className="w-8 h-8" />
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pr-8">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Type Identifier</label>
                  <select
                    value={method.type}
                    onChange={(e) => handleChange(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-xl focus:border-brand-primary text-white text-sm outline-none"
                  >
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
                  <label className="block text-xs font-medium text-white/60 mb-1">Icon</label>
                  <select
                    value={method.icon}
                    onChange={(e) => handleChange(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-xl focus:border-brand-primary text-white text-sm outline-none"
                  >
                    {Object.keys(ICONS).map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">
                    Label ({activeLang === 'en' ? 'EN' : 'AR'})
                  </label>
                  <input
                    type="text"
                    value={activeLang === 'en' ? method.label_en : method.label_ar}
                    onChange={(e) => handleChange(index, `label_${activeLang}`, e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-xl focus:border-brand-primary text-white text-sm outline-none"
                    dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                    placeholder="e.g. Drop me an email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Link Value (URL/Phone)</label>
                  <input
                    type="text"
                    value={method.value}
                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-xl focus:border-brand-primary text-white text-sm outline-none"
                    placeholder="mailto:.., tel:.., https:.."
                  />
                </div>

                <div className="lg:col-span-4 flex items-center gap-3 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={method.is_visible} 
                      onChange={(e) => handleChange(index, 'is_visible', e.target.checked)}
                      className="rounded border-white/20 bg-black/20 text-brand-primary accent-brand-primary w-4 h-4"
                    />
                    <span className="text-sm text-white/80">Visible on website</span>
                  </label>
                </div>
              </div>
            </div>
          )
        })}
        {methods.length === 0 && (
           <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center text-white/60">
              No contact methods added yet.
           </div>
        )}
      </div>
    </div>
  )
}
