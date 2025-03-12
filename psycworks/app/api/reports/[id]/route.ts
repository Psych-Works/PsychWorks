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

    const { data: hasDeleteAccess, error: accessError } = await supabase.rpc(
      'has_delete_access',
      { userid: user.id }
    );

    if (accessError || !hasDeleteAccess) {
      return NextResponse.json(
        { error: "Unauthorized - Insufficient permissions to delete" },
        { status: 403 }
      );
    }

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const reportId = params.id;
  const body = await request.json();

  try {
    console.log("Updating report with ID:", reportId);
    console.log("Request payload:", body);

    // Validate the request payload
    if (!body || typeof body !== 'object' || !body.name) {
      console.error("Invalid request payload:", body);
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // Update the report name and updated_at field
    const { data: reportData, error: reportError } = await supabase
      .from("Report")
      .update({
        name: body.name,
        updated_at: new Date().toISOString() // Update the updated_at field
      })
      .eq("id", reportId)
      .select()
      .single();

    if (reportError) {
      console.error("Error updating report name:", reportError);
      return NextResponse.json({ error: "Failed to update report name" }, { status: 500 });
    }

    // Update ReportAssessment links
    const { error: deleteError } = await supabase
      .from("ReportAssessment")
      .delete()
      .eq("report_id", reportId);

    if (deleteError) {
      console.error("Error deleting old assessments:", deleteError);
      return NextResponse.json({ error: "Failed to update assessments" }, { status: 500 });
    }

    const { error: insertError } = await supabase
      .from("ReportAssessment")
      .insert(
        body.assessment_ids.map((assessmentId: number) => ({
          report_id: reportId,
          assessment_id: assessmentId,
        }))
      );

    if (insertError) {
      console.error("Error inserting new assessments:", insertError);
      return NextResponse.json({ error: "Failed to update assessments" }, { status: 500 });
    }

    console.log("Report updated successfully:", reportData);
    return NextResponse.json(reportData, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
