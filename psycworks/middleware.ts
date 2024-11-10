// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  try {
    // Retrieve token from cookies
    const token = req.cookies.get('sb-access-token')?.value;

    // If token exists, get session
    const { data: { user }, error } = token
      ? await supabase.auth.getUser(token)
      : { data: { user: null }, error: null };

    console.log('Middleware user:', user, error);

    // Define protected and auth-only routes
    const protectedRoutes = ['/assessments', '/templates', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route =>
      req.nextUrl.pathname.startsWith(route)
    );

    const authRoutes = ['/sign-in', '/sign-up'];
    const isAuthRoute = authRoutes.some(route =>
      req.nextUrl.pathname.startsWith(route)
    );

    // Redirect to sign-in if not authenticated and accessing a protected route
    if (!user && isProtectedRoute) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Redirect authenticated users away from auth routes
    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL('/assessments', req.url));
    }
  } catch (error) {
    console.error('Middleware error:', error);
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
