import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

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
    const domainsWithSubtests = assessment.Domain.map((domain) => ({
      ...domain,
      subtests: assessment.SubTest.filter((st) => st.domain_id === domain.id),
    }));

    const standaloneSubtests = assessment.SubTest.filter((st) => !st.domain_id);

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
