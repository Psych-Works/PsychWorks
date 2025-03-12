import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function PATCH(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    );

    try {
        const { adminId, targetUserId, isPromoting } = await request.json();
        
        console.log("Received PATCH request with:", { adminId, targetUserId, isPromoting });

        if (!adminId || !targetUserId) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        // Check if user is admin
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
            userid: adminId
        });

        if (adminError || !isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Update user's metadata to include role
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            targetUserId,
            {
                user_metadata: {
                    role: isPromoting ? 'Elevated_delete' : 'default'
                }
            }
        );

        if (updateError) {
            console.error("Error updating user role:", updateError);
            throw updateError;
        }

        console.log("User role updated successfully for:", targetUserId);

        return NextResponse.json({ 
            message: `User successfully ${isPromoting ? 'promoted' : 'demoted'}`
        });
    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json(
            { error: "Failed to update user role" },
            { status: 500 }
        );
    }
}