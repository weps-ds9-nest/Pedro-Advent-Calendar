import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveRole } from '@/lib/session'

const PUBLIC_PATHS = ['/login', '/favicon.ico', '/robots.txt']

export function middleware(request: NextRequest) {
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
    const response = NextResponse.next()
    response.headers.set('x-user-role', 'admin')
    return response
  }
  // ── End DEV MODE ───────────────────────────────────────────────────────────

  const token = request.cookies.get('auth_token')?.value

  // Resolve the opaque token to a role (server-side only — never exposes passwords)
  const role = token ? resolveRole(token) : null

  if (!role) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Pass role downstream via a request header
  const response = NextResponse.next()
  response.headers.set('x-user-role', role)
  return response
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
