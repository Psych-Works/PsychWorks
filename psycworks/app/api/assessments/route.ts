import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Validate user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate query parameters
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

    // Calculate range for pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Fetch data with count
    const {
      data: assessments,
      error,
      count,
    } = await supabase
      .from("Assessment")
      .select("*", { count: "exact" })
      .order(sortBy, { ascending: order === "asc" })
      .range(from, to);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch assessments" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: assessments,
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
