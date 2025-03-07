import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  // Disable caching for this API route
  const headers = new Headers({
    "Cache-Control": "no-store, must-revalidate", // Prevent stale data
  });

  // Initialize Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Missing userId" }), { status: 400, headers });
    }

    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin", { userid: userId });

    if (adminError || !isAdmin) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers });
    }

    // Fetch users from Supabase auth
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) throw error;

    // Transform the data
    const formattedUsers = users.users.map((user) => ({
      email: user.email,
      last_sign_in_at: user.last_sign_in_at,
      id: user.id,
    }));

    return new NextResponse(JSON.stringify({ users: formattedUsers }), { status: 200, headers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch users" }), { status: 500, headers });
  }
}
