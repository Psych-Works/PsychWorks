import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.json();

  try {
    // Validate inputs
    if (formData.newPassword !== formData.confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Reauthenticate user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: formData.currentPassword,
    });

    if (signInError) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: formData.newPassword,
    });

    if (updateError) {
      return NextResponse.json(
        { error: "Password update failed: " + updateError.message },
        { status: 500 }
      );
    }

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("Sign out error:", signOutError);
      return NextResponse.json(
        { error: "Password changed but failed to sign out sessions" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Password updated successfully! Please sign in again." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
