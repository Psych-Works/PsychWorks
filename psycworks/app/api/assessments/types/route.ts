import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("AssessmentType")
      .select("id, name")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch assessment types" },
      { status: 500 }
    );
  }
}
