'use client'

import { useId, useState } from 'react'
import { UploadCloud, X, Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'

const MAX_FILE_SIZE_MB = 10
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

interface MediaUploadProps {
  bucket: string
  folder?: string
  currentUrl?: string | null
  onUploadSuccess: (url: string) => void
  onRemove?: () => void
  accept?: string
  label?: string
}

export default function MediaUpload({
  bucket,
  folder = 'general',
  currentUrl,
  onUploadSuccess,
  onRemove,
  accept = 'image/*',
  label = 'Upload file',
}: MediaUploadProps) {
  const uid = useId()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const convertImageToWebp = async (file: File) => {
    const alreadyWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp')
    if (alreadyWebp) return file

    const sourceUrl = URL.createObjectURL(file)

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('Unable to read the selected image.'))
        img.src = sourceUrl
      })

      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth || image.width
      canvas.height = image.naturalHeight || image.height

      const context = canvas.getContext('2d')
      if (!context) {
        // Canvas not supported — upload original
        return file
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      const webpBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/webp', 0.86)
      })

      if (!webpBlob) return file

      const baseName = file.name.replace(/\.[^/.]+$/, '')
      return new File([webpBlob], `${baseName}.webp`, { type: 'image/webp' })
    } finally {
      URL.revokeObjectURL(sourceUrl)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isImageUpload = accept.includes('image')

    if (isImageUpload && !file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, JPEG, or WebP).')
      e.target.value = ''
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`)
      e.target.value = ''
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const uploadFile = isImageUpload ? await convertImageToWebp(file) : file
      const formData = new FormData()
      formData.append('bucket', bucket)
      formData.append('folder', folder)
      formData.append('file', uploadFile)

      const response = await fetch('/api/admin/upload-media', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(result?.error || 'Upload failed. Please try again.')
      }

      if (!result?.url) {
        throw new Error('Upload succeeded but no URL was returned. Please refresh.')
      }

      onUploadSuccess(result.url)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="w-full">
      {error ? (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-3 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-400/10 p-3 text-sm text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      {currentUrl ? (
        <div className="relative inline-block overflow-hidden rounded-xl border border-white/10 bg-white/5">
          {accept.includes('video') ? (
            <video
              src={currentUrl}
              className="max-h-48 rounded-xl object-cover"
              controls
              aria-label="Uploaded video preview"
            />
          ) : accept.includes('pdf') || accept.includes('document') ? (
            <div className="flex h-48 w-48 flex-col items-center justify-center p-4 text-center text-sm text-white/60">
              <span>Document uploaded</span>
              <span className="mt-2 max-w-[150px] break-all text-xs">{currentUrl.split('/').pop()}</span>
            </div>
          ) : (
            <Image
              src={currentUrl}
              alt="Uploaded media preview"
              width={300}
              height={300}
              className="max-h-48 w-auto rounded-xl object-cover"
            />
          )}

          {onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove uploaded file"
              className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-red-500/80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 group-hover:opacity-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : (
        <div className="group relative">
          <label
            htmlFor={uid}
            className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
              isUploading
                ? 'border-[#8df6c8]/40 bg-[#8df6c8]/5'
                : 'border-white/20 bg-white/5 hover:border-[#8df6c8]/40 hover:bg-[#8df6c8]/5'
            }`}
          >
            <div className="flex flex-col items-center justify-center text-white/60">
              {isUploading ? (
                <>
                  <Loader2 className="mb-3 h-10 w-10 animate-spin text-[#8df6c8]" aria-hidden="true" />
                  <p className="text-sm font-medium text-white/80">Uploading…</p>
                </>
              ) : (
                <>
                  <UploadCloud className="mb-3 h-10 w-10" aria-hidden="true" />
                  <p className="mb-1 text-sm font-medium">
                    <span className="font-semibold text-white">Click to upload</span>
                    {' '}or drag and drop
                  </p>
                  <p className="text-xs text-white/40">
                    {accept.includes('image')
                      ? `PNG, JPG, WebP — max ${MAX_FILE_SIZE_MB} MB`
                      : `Max ${MAX_FILE_SIZE_MB} MB`}
                  </p>
                </>
              )}
            </div>

            <input
              id={uid}
              type="file"
              className="sr-only"
              accept={accept}
              onChange={handleUpload}
              disabled={isUploading}
              aria-label={label}
              aria-describedby={error ? `${uid}-error` : undefined}
            />
          </label>
        </div>
      )}
    </div>
  )
}
