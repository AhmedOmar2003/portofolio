import crypto from 'crypto'

import { NextResponse } from 'next/server'

import { getAdminSession } from '@/utils/admin-auth'
import { createAdminClient } from '@/utils/supabase/admin'

const ALLOWED_BUCKETS = new Set(['portfolio-media'])

function sanitizeFolder(folder: string | null) {
  const value = (folder || 'general').trim()
  const segments = value
    .split('/')
    .map((segment) => segment.replace(/[^a-zA-Z0-9_-]/g, ''))
    .filter(Boolean)

  return segments.length > 0 ? segments.join('/') : 'general'
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const formData = await request.formData()
  const bucket = String(formData.get('bucket') || '').trim()
  const folder = sanitizeFolder(String(formData.get('folder') || 'general'))
  const file = formData.get('file')

  if (!ALLOWED_BUCKETS.has(bucket)) {
    return NextResponse.json({ error: 'Unsupported storage bucket.' }, { status: 400 })
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file was provided.' }, { status: 400 })
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const safeExt = fileExt.replace(/[^a-z0-9]/g, '') || 'bin'
  const fileName = `${crypto.randomUUID()}.${safeExt}`
  const filePath = `${folder}/${fileName}`

  const supabase = createAdminClient()
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: file.type || undefined,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message || 'Failed to upload the file.' },
      { status: 400 }
    )
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return NextResponse.json({
    ok: true,
    path: filePath,
    url: publicUrlData.publicUrl,
  })
}
