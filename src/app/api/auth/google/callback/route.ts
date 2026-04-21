import { getTokensFromCode } from '@/lib/google-calendar'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type GoogleState = {
  userId?: string
  role?: 'tutor' | 'student'
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawState = searchParams.get('state')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_google_code`)
  }

  let state: GoogleState = {}
  try {
    state = rawState ? (JSON.parse(rawState) as GoogleState) : {}
  } catch {
    return NextResponse.redirect(`${origin}/login?error=invalid_google_state`)
  }

  const role = state.role
  if (!role || (role !== 'tutor' && role !== 'student') || !state.userId) {
    return NextResponse.redirect(`${origin}/login?error=invalid_google_state`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== state.userId) {
    return NextResponse.redirect(`${origin}/login?error=google_auth_mismatch`)
  }

  const tokens = await getTokensFromCode(code)
  const table = role === 'tutor' ? 'tutor_profiles' : 'student_profiles'
  const { data: existingProfile } = await supabase
    .from(table)
    .select('google_refresh_token')
    .eq('id', state.userId)
    .maybeSingle()

  const refreshToken = tokens.refresh_token ?? existingProfile?.google_refresh_token
  if (!refreshToken) {
    return NextResponse.redirect(`${origin}/${role}/calendar?error=missing_refresh_token`)
  }

  const { error } = await supabase
    .from(table)
    .update({ google_refresh_token: refreshToken })
    .eq('id', state.userId)

  if (error) {
    return NextResponse.redirect(`${origin}/${role}/calendar?error=google_save_failed`)
  }

  return NextResponse.redirect(`${origin}/${role}/calendar?connected=1`)
}
