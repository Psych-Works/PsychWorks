export const runtime = "nodejs"; // Prevent Edge runtime issues

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  // Prevent stale API responses
  const headers = new Headers({
    "Cache-Control": "no-store, must-revalidate", // Prevents ghost users
  });

  // Ensure environment variables exist
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.error("Supabase environment variables are missing.");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  // Initialize Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400, headers }
      );
    }

    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabase.rpc(
      "is_admin",
      { userid: userId }
    );

    if (adminError || !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403, headers }
      );
    }

    // Fetch users from Supabase auth
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    // Ensure response is always fresh
    return new NextResponse(JSON.stringify({ users: users.users }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500, headers }
    );
  }
}
