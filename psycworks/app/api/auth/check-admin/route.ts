import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  // Initialize Supabase with the service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // Get user ID from request
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    console.log("Checking admin status for userId:", userId);
    
    const { data, error } = await supabase.rpc('is_admin', {
      userid: userId
    });

    console.log("RPC Response - data:", data);
    console.log("RPC Response - error:", error);

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        code: error.code,
        details: error.details
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ isAdmin: data || false });
  } catch (error) {
    console.error("Check admin error:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json({ error: "Failed to check admin status" }, { status: 500 });
  }
}
