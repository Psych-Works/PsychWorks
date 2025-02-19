import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      );
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      return NextResponse.json(
        { error: "Password update failed: " + updateError.message },
        { status: 400 }
      );
    }

    // Sign out all sessions after password reset
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("Sign out error:", signOutError);
      return NextResponse.json(
        { error: "Password changed but failed to sign out sessions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Password updated successfully! Please sign in with your new password.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}