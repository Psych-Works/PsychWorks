import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create a Supabase client for the middleware
  const supabase = createMiddlewareClient({ req, res })
  
  try {
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession()
    console.log('Middleware session:', session, error);

    // Protected routes - add any routes that require authentication
    const protectedRoutes = ['/assessments', '/templates', '/settings']
    const isProtectedRoute = protectedRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    )

    // Auth routes - routes for non-authenticated users
    const authRoutes = ['/sign-in', '/sign-up']
    const isAuthRoute = authRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    )

    // If accessing a protected route without a session, redirect to sign-in
    if (!session && isProtectedRoute) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }

    // If accessing auth routes with a session, redirect to assessments
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL('/assessments', req.url))
    }

  } catch (error) {
    console.error('Middleware error:', error)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}