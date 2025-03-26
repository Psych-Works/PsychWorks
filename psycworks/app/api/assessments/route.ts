import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface Field {
  type: string;
  fieldData: {
    id?: string;
    name: string;
    score_type: string;
    domain_id?: string;
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

    // Check if the user has delete access
    const { data: hasDeleteAccess, error: accessError } = await supabase.rpc('has_delete_access', {
      userid: user.id
    });

    if (accessError) {
      return NextResponse.json({ error: "Failed to check delete access" }, { status: 500 });
    }

    // Parse and validate query parameters
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

    // Calculate range for pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build the query
    let query = supabase
      .from("Assessment")
      .select("*", { count: "exact" });

    // Add search filter if search term is provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,measure.ilike.%${search}%`);
    }

    // Add sorting
    query = query.order(sortBy, { ascending: order === "asc" });

    // Add pagination
    const { data: assessments, error, count } = await query.range(from, to);

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
      canDelete: hasDeleteAccess
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
        description: body.description, // ADD THIS
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
        const domainId = field.fieldData.domain_id || field.fieldData.id;
        const { error } = await supabase.from("SubTest").insert({
          assessment_id: assessment.id,
          domain_id: domainId ? domainIdMap.get(domainId) : null,
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

export async function PATCH(request: Request) {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, measure, table_type_id, description, domains, subtests } =
      body;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid assessment ID" },
        { status: 400 }
      );
    }

    const { data: assessment, error: assessmentError } = await supabase
      .from("Assessment")
      .update({
        name,
        measure,
        table_type_id,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (assessmentError) throw assessmentError;

    let currentDomainIds: number[] = [];

    if (domains) {
      const { data: existingDomains, error: existingError } = await supabase
        .from("Domain")
        .select("id")
        .eq("assessment_id", id);

      if (existingError) throw existingError;
      const existingDomainIds = existingDomains.map((d) => d.id);
      const domainsToKeep: number[] = [];

      for (const domain of domains) {
        if (domain.id) {
          if (!existingDomainIds.includes(domain.id)) {
            return NextResponse.json(
              { error: `Domain ${domain.id} not found` },
              { status: 404 }
            );
          }

          const { error: updateError } = await supabase
            .from("Domain")
            .update({
              name: domain.name,
              score_type: domain.score_type,
              updated_at: new Date().toISOString(),
            })
            .eq("id", domain.id)
            .eq("assessment_id", id);

          if (updateError) throw updateError;
          domainsToKeep.push(domain.id);
        } else {
          const { data: newDomain, error: createError } = await supabase
            .from("Domain")
            .insert({
              assessment_id: id,
              name: domain.name,
              score_type: domain.score_type,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) throw createError;
          domainsToKeep.push(newDomain.id);
        }
      }

      if (domainsToKeep.length > 0) {
        await supabase
          .from("Domain")
          .delete()
          .eq("assessment_id", id)
          .not("id", "in", `(${domainsToKeep.join(",")})`);
      } else {
        await supabase.from("Domain").delete().eq("assessment_id", id);
      }

      currentDomainIds = domainsToKeep;
    } else {
      const { data: currentDomains, error } = await supabase
        .from("Domain")
        .select("id")
        .eq("assessment_id", id);

      if (error) throw error;
      currentDomainIds = currentDomains.map((d) => d.id);
    }

    if (subtests) {
      const { data: existingSubtests, error: existingError } = await supabase
        .from("SubTest")
        .select("id")
        .eq("assessment_id", id);

      if (existingError) throw existingError;
      const existingSubtestIds = existingSubtests.map((st) => st.id);
      const subtestsToKeep: number[] = [];

      for (const subtest of subtests) {
        if (subtest.id) {
          if (!existingSubtestIds.includes(subtest.id)) {
            return NextResponse.json(
              { error: `Subtest ${subtest.id} not found` },
              { status: 404 }
            );
          }

          if (
            subtest.domain_id &&
            !currentDomainIds.includes(subtest.domain_id)
          ) {
            return NextResponse.json(
              { error: "Invalid domain reference" },
              { status: 400 }
            );
          }

          const { error: updateError } = await supabase
            .from("SubTest")
            .update({
              name: subtest.name,
              score_type: subtest.score_type,
              domain_id: subtest.domain_id || null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", subtest.id)
            .eq("assessment_id", id);

          if (updateError) throw updateError;
          subtestsToKeep.push(subtest.id);
        } else {
          if (
            subtest.domain_id &&
            !currentDomainIds.includes(subtest.domain_id)
          ) {
            return NextResponse.json(
              { error: "Invalid domain reference" },
              { status: 400 }
            );
          }

          const { data: newSubtest, error: createError } = await supabase
            .from("SubTest")
            .insert({
              assessment_id: id,
              domain_id: subtest.domain_id || null,
              name: subtest.name,
              score_type: subtest.score_type,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) throw createError;
          subtestsToKeep.push(newSubtest.id);
        }
      }

      if (subtestsToKeep.length > 0) {
        await supabase
          .from("SubTest")
          .delete()
          .eq("assessment_id", id)
          .not("id", "in", `(${subtestsToKeep.join(",")})`);
      } else {
        await supabase.from("SubTest").delete().eq("assessment_id", id);
      }
    }

    return NextResponse.json(assessment, { status: 200 });
  } catch (error) {
    console.error("Error updating assessment:", error);
    return NextResponse.json(
      { error: "Failed to update assessment" },
      { status: 500 }
    );
  }
}
