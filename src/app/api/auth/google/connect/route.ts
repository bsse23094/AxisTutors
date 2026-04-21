import { getAuthUrl } from '@/lib/google-calendar'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'tutor' && profile.role !== 'student')) {
    return new NextResponse('Only tutors and students can connect calendars', {
      status: 403,
    })
  }

  const url = getAuthUrl(user.id, profile.role)
  return NextResponse.redirect(url)
}
