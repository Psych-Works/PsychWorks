import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface Domain {
  id: number;
  name: string;
  score_type: string;
  created_at: string;
  updated_at: string | null;
}

interface SubTest {
  id: number;
  name: string;
  score_type: string;
  domain_id: number | null;
  created_at: string;
  updated_at: string | null;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const assessmentId = params.id;

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: assessment, error: assessmentError } = await supabase
      .from("Assessment")
      .select(
        `
        *,
        AssessmentType:AssessmentType(name),
        Domain:Domain(*),
        SubTest:SubTest(*)
      `
      )
      .eq("id", assessmentId)
      .single();

    if (assessmentError) throw assessmentError;

    // Organize subtests into domains and standalone
    const domainsWithSubtests = (assessment.Domain as Domain[]).map(
      (domain: Domain) => ({
        ...domain,
        subtests: (assessment.SubTest as SubTest[]).filter(
          (st: SubTest) => st.domain_id === domain.id
        ),
      })
    );

    const standaloneSubtests = (assessment.SubTest as SubTest[]).filter(
      (st: SubTest) => !st.domain_id
    );

    return NextResponse.json({
      ...assessment,
      table_type_name: assessment.AssessmentType?.name,
      domains: domainsWithSubtests,
      standaloneSubtests,
    });
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  // Convert the assessment id to a number
  const assessmentId = Number(params.id);
  const body = await request.json();

  try {
    // Update the Assessment record
    const { data: assessment, error: assessmentError } = await supabase
      .from("Assessment")
      .update({
        name: body.name,
        measure: body.measure,
        description: body.description,
        table_type_id: body.table_type_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", assessmentId)
      .select()
      .single();

    if (assessmentError) throw assessmentError;

    // Process domains: update existing or insert new ones
    await Promise.all(
      body.domains.map(async (domain: any) => {
        let domainId: number;
        if (domain.id && !isNaN(Number(domain.id))) {
          // Update an existing domain
          const { error: domainError } = await supabase
            .from("Domain")
            .update({
              name: domain.name,
              score_type: domain.score_type,
              updated_at: new Date().toISOString(),
            })
            .eq("id", domain.id);
          if (domainError) throw domainError;
          domainId = domain.id;
        } else {
          // Insert a new domain, linking it to the current assessment
          const { data: insertedDomain, error: insertError } = await supabase
            .from("Domain")
            .insert({
              assessment_id: assessmentId,
              name: domain.name,
              score_type: domain.score_type,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();
          if (insertError) throw insertError;
          domainId = insertedDomain.id;
        }

        // Process the subtests for this domain: update or insert
        await Promise.all(
          domain.subtests.map(async (subtest: any) => {
            if (subtest.id && !isNaN(Number(subtest.id))) {
              // Update an existing subtest for this domain
              const { error: subtestError } = await supabase
                .from("SubTest")
                .update({
                  name: subtest.name,
                  score_type: subtest.score_type,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", subtest.id);
              if (subtestError) throw subtestError;
            } else {
              // Insert a new subtest linked to the newly inserted/updated domain
              const { error: insertError } = await supabase
                .from("SubTest")
                .insert({
                  assessment_id: assessmentId,
                  domain_id: domainId,
                  name: subtest.name,
                  score_type: subtest.score_type,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                });
              if (insertError) throw insertError;
            }
          })
        );
      })
    );

    // Process standalone subtests: update existing or insert new ones
    await Promise.all(
      body.standalone_subtests.map(async (subtest: any) => {
        if (subtest.id && !isNaN(Number(subtest.id))) {
          // Update an existing standalone subtest
          const { error: subtestError } = await supabase
            .from("SubTest")
            .update({
              name: subtest.name,
              score_type: subtest.score_type,
              updated_at: new Date().toISOString(),
            })
            .eq("id", subtest.id);
          if (subtestError) throw subtestError;
        } else {
          // Insert a new standalone subtest (domain_id remains null)
          const { error: insertError } = await supabase.from("SubTest").insert({
            assessment_id: assessmentId,
            domain_id: null,
            name: subtest.name,
            score_type: subtest.score_type,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          if (insertError) throw insertError;
        }
      })
    );

    return NextResponse.json({ success: true, data: assessment });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}
