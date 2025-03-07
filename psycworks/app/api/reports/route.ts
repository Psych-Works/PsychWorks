import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const order = searchParams.get("order") || "desc";
    const search = searchParams.get("search") || "";

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build the query
    let query = supabase
      .from("Report")
      .select(
        "*, ReportAssessment:ReportAssessment(*, Assessment(name, measure))",
        { count: "exact" }
      );

    // Add search filter if search term is provided
    if (search) {
      query = query.or(`name.ilike.%${search}%`);
    }

    // Add sorting
    query = query.order(sortBy, { ascending: order === "asc" });

    // Add pagination
    const { data: reports, error, count } = await query.range(from, to);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch reports" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: reports,
      totalCount: count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, assessment_ids } = body;

    if (!name || !assessment_ids || !Array.isArray(assessment_ids)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create Report
    const { data: reportData, error: reportError } = await supabase
      .from("Report")
      .insert({ name })
      .select()
      .single();

    if (reportError) throw reportError;

    const reportId = reportData.id;

    try {
      // Create ReportAssessment links
      await Promise.all(
        assessment_ids.map(async (assessmentId: number) => {
          await supabase.from("ReportAssessment").insert({
            report_id: reportId,
            assessment_id: assessmentId,
          });
        })
      );
    } catch (error) {
      // Cleanup Report if any insertion fails
      await supabase.from("Report").delete().eq("id", reportId);
      throw error;
    }

    return NextResponse.json(reportData, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
