import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

  const authToken = request.cookies.get('auth_token')?.value
  const userPassword = process.env.USER_PASSWORD
  const adminPassword = process.env.ADMIN_PASSWORD

  let role: string | null = null

  if (userPassword && authToken === userPassword) {
    role = 'user'
  } else if (adminPassword && authToken === adminPassword) {
    role = 'admin'
  }

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
