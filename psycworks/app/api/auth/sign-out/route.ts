import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        Allow: "POST",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

export async function POST() {
  try {
    // Clear the session cookies
    const response = NextResponse.json(
      { message: "Successfully signed out" },
      { status: 200 }
    );

    // Remove the sb-access-token cookie
    response.cookies.set('sb-access-token', '', {
      path: '/',
      httpOnly: true,
      //secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Expire immediately
    });

    return response;
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
