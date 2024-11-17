import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();  

  
  try {
    // Get the token from the sb-access-token cookie
    const token = req.cookies.get("sb-access-token")?.value;

    // Add debug logging
    console.log("Token in middleware:", token ? "exists" : "missing");

    // If there's no token, treat as unauthenticated
    if (!token) {
      const publicRoutes = ["/sign-in", "/sign-up"];
      const isPublicRoute = publicRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
      );

      if (!isPublicRoute) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
      return res;
    }

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    // Add debug logging
    console.log("Middleware user verification:", { user, error });

    // Define public routes
    const publicRoutes = ["/sign-in", "/sign-up"];
    const isPublicRoute = publicRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );

    if (!user && !isPublicRoute) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (user && isPublicRoute) {
      return NextResponse.redirect(new URL("/assessments", req.url));
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }

  return res;
} 

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
