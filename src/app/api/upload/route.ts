import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type UploadRequest = {
  bucket?: 'avatars' | 'tutor-documents' | 'chat-attachments' | 'session-resources'
  fileName?: string
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as UploadRequest
  if (!body.bucket || !body.fileName) {
    return NextResponse.json({ error: 'bucket and fileName are required' }, { status: 400 })
  }

  const safeName = body.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${user.id}/${Date.now()}_${safeName}`

  const { data, error } = await supabase.storage.from(body.bucket).createSignedUploadUrl(path)
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Failed to create signed upload URL' }, { status: 400 })
  }

  return NextResponse.json({ path, token: data.token, signedUrl: data.signedUrl })
}
