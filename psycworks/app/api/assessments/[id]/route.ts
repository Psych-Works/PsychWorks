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
