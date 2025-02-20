import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(request: Request) {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
    }

    // Delete ReportAssessment entries first
    await supabase.from("ReportAssessment").delete().eq("report_id", id);

    const { error: deleteError } = await supabase
      .from("Report")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json(
      { success: true, message: "Report deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { id } = params;

  try {
    const { data: report, error } = await supabase
      .from("Report")
      .select(
        `
        *,
        ReportAssessment:ReportAssessment (
          Assessment:Assessment (
            *,
            Domains:Domain (
              *,
              SubTests:SubTest (*)
            ),
            SubTests:SubTest (
              *
            )
          )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}
