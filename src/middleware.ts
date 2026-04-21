import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ROLE_ROUTES: Record<string, string> = {
  admin:   '/admin',
  tutor:   '/tutor',
  student: '/student',
  parent:  '/parent',
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Redirect unauthenticated users away from portals
  if (!user && (path.startsWith('/admin') || path.startsWith('/tutor') ||
      path.startsWith('/student') || path.startsWith('/parent'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile) {
      // Redirect from portal root to correct portal
      if (path === '/portal') {
        return NextResponse.redirect(new URL(ROLE_ROUTES[profile.role], request.url))
      }

      // Prevent cross-portal access
      const portalPaths = ['/admin', '/tutor', '/student', '/parent']
      for (const portalPath of portalPaths) {
        if (path.startsWith(portalPath) && !path.startsWith(ROLE_ROUTES[profile.role])) {
          return NextResponse.redirect(new URL(ROLE_ROUTES[profile.role], request.url))
        }
      }

      // Redirect authenticated users away from auth pages
      if (path.startsWith('/login') || path.startsWith('/register')) {
        return NextResponse.redirect(new URL(ROLE_ROUTES[profile.role], request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
