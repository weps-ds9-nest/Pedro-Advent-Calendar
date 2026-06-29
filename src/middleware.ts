import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveRole } from '@/lib/session'

const PUBLIC_PATHS = ['/login', '/favicon.ico', '/robots.txt']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths and Next.js internals
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/_next/')
  ) {
    return NextResponse.next()
  }

  // ── DEV MODE bypass ────────────────────────────────────────────────────────
  // Set DEV_MODE=true in .env.local to skip auth entirely during development.
  // Never set this in production — remove the variable or set it to anything
  // other than "true".
  if (process.env.DEV_MODE === 'true') {
    const requestHeaders = new Headers(request.headers)
    const devRole = request.cookies.get('dev_role')?.value ?? 'admin'

    let activeRole: string
    let viewMode: string
    if (devRole === 'user' || devRole === 'student') {
      activeRole = 'user'
      viewMode = 'student-simulated'
    } else if (devRole === 'student-real') {
      activeRole = 'admin'
      viewMode = 'student-real'
    } else {
      activeRole = 'admin'
      viewMode = 'admin'
    }

    requestHeaders.set('x-actual-role', 'admin')
    requestHeaders.set('x-user-role', activeRole)
    requestHeaders.set('x-view-mode', viewMode)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  // ── End DEV MODE ───────────────────────────────────────────────────────────

  const token = request.cookies.get('auth_token')?.value

  // Resolve the opaque token to a role (server-side only — never exposes passwords)
  const role = token ? await resolveRole(token) : null

  if (!role) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-actual-role', role)

  let activeRole = role
  let viewMode = role === 'admin' ? 'admin' : 'student'
  if (role === 'admin') {
    const devRole = request.cookies.get('dev_role')?.value
    if (devRole === 'user' || devRole === 'student') {
      activeRole = 'user'
      viewMode = 'student-simulated'
    } else if (devRole === 'student-real') {
      activeRole = 'admin'
      viewMode = 'student-real'
    }
  }
  requestHeaders.set('x-user-role', activeRole)
  requestHeaders.set('x-view-mode', viewMode)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, robots.txt, sitemap.xml
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
