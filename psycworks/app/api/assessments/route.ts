import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface Field {
  type: string;
  fieldData: {
    id?: string;
    name: string;
    score_type: string;
  };
}

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

export async function POST(request: Request) {
  let assessment: any = null;
  const supabase = await createClient();

  try {
    // Authentication check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body
    const body = await request.json();
    const { name, measure, table_type_id, score_type, fields } = body;
    if (!name || !measure || !table_type_id || !fields) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Insert Assessment
    const { data: assessmentData, error: assessmentError } = await supabase
      .from("Assessment")
      .insert({
        name,
        measure,
        table_type_id,
        score_type,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (assessmentError) throw assessmentError;
    assessment = assessmentData;

    // 2. Insert Domains
    const domainIdMap = new Map<string, number>();
    for (const field of fields.filter((f: Field) => f.type === "domain")) {
      const { data: domain, error: domainError } = await supabase
        .from("Domain")
        .insert({
          assessment_id: assessment.id,
          name: field.fieldData.name,
          score_type: field.fieldData.score_type,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (domainError) throw domainError;
      domainIdMap.set(field.id, domain.id);
    }

    // 3. Insert Subtests
    const subtestInserts = fields
      .filter((f: Field) => f.type === "subtest")
      .map(async (field: Field) => {
        const { error } = await supabase.from("SubTest").insert({
          assessment_id: assessment.id,
          domain_id: field.fieldData.id
            ? domainIdMap.get(field.fieldData.id)
            : null,
          name: field.fieldData.name,
          score_type: field.fieldData.score_type,
          created_at: new Date().toISOString(),
        });

        if (error) throw error;
      });

    await Promise.all(subtestInserts);

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error("Error creating assessment:", error);

    // Cleanup any partially created data
    if (assessment?.id) {
      try {
        await supabase
          .from("SubTest")
          .delete()
          .eq("assessment_id", assessment.id);
        await supabase
          .from("Domain")
          .delete()
          .eq("assessment_id", assessment.id);
        await supabase.from("Assessment").delete().eq("id", assessment.id);
      } catch (cleanupError) {
        console.error("Cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      { error: "Failed to create assessment. Rolled back changes." },
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
      return NextResponse.json(
        { error: "Invalid assessment ID" },
        { status: 400 }
      );
    }

    const { data: assessment, error: findError } = await supabase
      .from("Assessment")
      .select("*")
      .eq("id", id)
      .single();

    if (findError) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    const { error: subtestError } = await supabase
      .from("SubTest")
      .delete()
      .eq("assessment_id", id);

    if (subtestError) throw subtestError;

    const { error: domainError } = await supabase
      .from("Domain")
      .delete()
      .eq("assessment_id", id);

    if (domainError) throw domainError;

    const { error: deleteError } = await supabase
      .from("Assessment")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json(
      { success: true, message: "Assessment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting assessment:", error);
    return NextResponse.json(
      { error: "Failed to delete assessment" },
      { status: 500 }
    );
  }
}

