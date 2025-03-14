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
    // First, fetch the current assessment data to identify items to delete
    const { data: currentAssessment, error: fetchError } = await supabase
      .from("Assessment")
      .select(
        `
        *,
        Domain:Domain(*),
        SubTest:SubTest(*)
      `
      )
      .eq("id", assessmentId)
      .single();

    if (fetchError) throw fetchError;

    // Identify domains and subtests to delete
    const currentDomainIds = new Set((currentAssessment.Domain as Domain[]).map(d => d.id));
    const newDomainIds = new Set(body.domains.map((d: any) => Number(d.id)).filter(Boolean));

    // Domains to delete: present in current data but not in new data
    const domainsToDelete = Array.from(currentDomainIds).filter(id => !newDomainIds.has(id));

    // Collect all current subtests (both from domains and standalone)
    const currentSubtestIds = new Set((currentAssessment.SubTest as SubTest[]).map(s => s.id));

    // Collect all new subtests (both from domains and standalone)
    const newSubtestIds = new Set([
      ...body.domains.flatMap((d: any) => (d.subtests || []).map((s: any) => Number(s.id)).filter(Boolean)),
      ...body.standalone_subtests.map((s: any) => Number(s.id)).filter(Boolean)
    ]);

    // Subtests to delete: present in current data but not in new data
    const subtestsToDelete = Array.from(currentSubtestIds).filter(id => !newSubtestIds.has(id));

    console.log("Domains to delete:", domainsToDelete);
    console.log("Subtests to delete:", subtestsToDelete);

    // Delete subtests first (to avoid foreign key constraints)
    if (subtestsToDelete.length > 0) {
      const { error: deleteSubtestsError } = await supabase
        .from("SubTest")
        .delete()
        .in("id", subtestsToDelete);

      if (deleteSubtestsError) throw deleteSubtestsError;
    }

    // Delete domains after subtests
    if (domainsToDelete.length > 0) {
      const { error: deleteDomainsError } = await supabase
        .from("Domain")
        .delete()
        .in("id", domainsToDelete);

      if (deleteDomainsError) throw deleteDomainsError;
    }

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
          (domain.subtests || []).map(async (subtest: any) => {
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
      (body.standalone_subtests || []).map(async (subtest: any) => {
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
