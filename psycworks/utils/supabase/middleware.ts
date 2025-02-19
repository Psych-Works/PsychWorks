import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const publicRoutes = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password", "/auth/callback"];
    const isPublicRoute = publicRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );

    if (user && isPublicRoute) {
      return NextResponse.redirect(new URL("/assessments", request.url));
    }

    if (!user && !isPublicRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }

  return response;
}
