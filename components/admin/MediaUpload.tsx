'use client'

import { useState } from 'react'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

interface MediaUploadProps {
  bucket: string
  folder?: string
  currentUrl?: string | null
  onUploadSuccess: (url: string) => void
  onRemove?: () => void
  accept?: string
}

export default function MediaUpload({
  bucket,
  folder = 'general',
  currentUrl,
  onUploadSuccess,
  onRemove,
  accept = 'image/*'
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      onUploadSuccess(publicUrlData.publicUrl)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Error uploading file')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-2 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}
      
      {currentUrl ? (
        <div className="relative group inline-block rounded-xl overflow-hidden border border-white/10 bg-white/5">
          {accept.includes('video') ? (
            <video src={currentUrl} className="max-h-48 object-cover rounded-xl" controls />
          ) : accept.includes('pdf') || accept.includes('document') ? (
            <div className="h-48 w-48 flex items-center justify-center p-4 text-center text-sm text-white/60">
              Document Uploaded<br/>
              <span className="text-xs break-all mt-2 max-w-[150px]">{currentUrl}</span>
            </div>
          ) : (
            <Image 
              src={currentUrl} 
              alt="Uploaded media" 
              width={300} 
              height={300} 
              className="max-h-48 w-auto object-cover rounded-xl"
            />
          )}
          
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 hover:border-brand-primary/50 bg-white/5 hover:bg-brand-primary/5 rounded-2xl cursor-pointer transition-all duration-300">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-white/60 group-hover:text-brand-primary">
            {isUploading ? (
              <Loader2 className="w-10 h-10 mb-3 animate-spin text-brand-primary" />
            ) : (
              <UploadCloud className="w-10 h-10 mb-3" />
            )}
            <p className="mb-2 text-sm font-medium">
              <span className="font-semibold text-white">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs">
              {accept === 'image/*' ? 'PNG, JPG, WebP, GIF' : accept}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  )
}
