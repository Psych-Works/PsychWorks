import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        Allow: "GET",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

export async function GET(request: Request) {
  try {
    // Get the URL object to parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const order = searchParams.get("order") || "desc";

    const { data: assessments, error } = await supabase
      .from("Assessment")
      .select("*")
      .order(sortBy, { ascending: order === "asc" })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch assessments" },
        { status: 500 }
      );
    }

    return NextResponse.json(assessments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
