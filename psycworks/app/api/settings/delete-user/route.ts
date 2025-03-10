export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  try {
    const { adminId, userToDeleteId } = await request.json();

    if (!adminId || !userToDeleteId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabase.rpc(
      "is_admin",
      {
        userid: adminId,
      }
    );

    if (adminError || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      userToDeleteId
    );

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
