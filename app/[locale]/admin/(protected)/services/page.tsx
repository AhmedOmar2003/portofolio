'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Loader2, ArrowUp, ArrowDown } from 'lucide-react'
import Image from 'next/image'

export default function ServicesListPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, title_en, title_ar, icon_image_url, view_order, is_featured')
        .order('view_order', { ascending: true })
      
      if (error) throw error
      if (data) setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    setDeletingId(id)
    try {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
      setServices(services.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting service:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === services.length - 1) return

    const newServices = [...services]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    
    // Swap view_order locally
    const tempOrder = newServices[index].view_order
    newServices[index].view_order = newServices[swapIndex].view_order
    newServices[swapIndex].view_order = tempOrder

    // Swap elements in array for immediate UI update
    const tempElement = newServices[index]
    newServices[index] = newServices[swapIndex]
    newServices[swapIndex] = tempElement

    setServices(newServices)

    // Update DB
    try {
      await Promise.all([
        supabase.from('services').update({ view_order: newServices[index].view_order }).eq('id', newServices[index].id),
        supabase.from('services').update({ view_order: newServices[swapIndex].view_order }).eq('id', newServices[swapIndex].id)
      ])
    } catch (error) {
      console.error('Error updating order:', error)
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
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Services</h1>
          <p className="text-white/60">Manage the services you offer.</p>
        </div>
        <Link
          href="./services/new"
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-light text-brand-dark font-bold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <h3 className="text-xl font-medium text-white mb-2">No services yet</h3>
          <p className="text-white/60 mb-6">Add services to show clients what you can do for them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={service.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-colors hover:bg-white/10">
              <div className="flex flex-col gap-1 pr-4 border-r border-white/10">
                <button 
                  onClick={() => moveOrder(index, 'up')}
                  disabled={index === 0}
                  className="text-white/40 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => moveOrder(index, 'down')}
                  disabled={index === services.length - 1}
                  className="text-white/40 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                {service.icon_image_url ? (
                  <Image src={service.icon_image_url} alt={service.title_en} width={48} height={48} className="object-cover" />
                ) : (
                  <div className="text-xs text-white/30 text-center leading-tight">No Icon</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">{service.title_en}</h3>
                <p className="text-sm text-white/50 truncate" dir="rtl">{service.title_ar}</p>
              </div>

              {service.is_featured && (
                <div className="px-3 py-1 bg-brand-primary/20 text-brand-primary text-xs font-bold rounded-full mr-4">
                  Featured
                </div>
              )}

              <div className="flex gap-2 pl-4 border-l border-white/10">
                <Link
                  href={`./services/${service.id}`}
                  className="p-2 bg-white/5 hover:bg-blue-500/20 text-white/60 hover:text-blue-400 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(service.id)}
                  disabled={deletingId === service.id}
                  className="p-2 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === service.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
