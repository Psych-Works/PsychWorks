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

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const {
      data: reports,
      error,
      count,
    } = await supabase
      .from("Report")
      .select(
        "*, ReportAssessment:ReportAssessment(*, Assessment(name, measure))"
      )
      .order(sortBy, { ascending: order === "asc" })
      .range(from, to);

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

export async function DELETE(request: Request) {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
    }

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
