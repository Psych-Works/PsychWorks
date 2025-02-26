"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import DynamicTable from "@/components/assessments/table-rendering/dynamic-table";
import TableFormContextProvider from "@/components/assessments/form-swap-hook/assessments-form-context";
import { InputData } from "@/types/table-input-data";
import { Textarea } from "@/components/ui/textarea";
import ExportToDocxButton from "@/components/reports/report-gen/report-export-button";

interface ReportAssessment {
  Assessment: {
    id: string;
    name: string;
    measure: string;
    description: string;
    table_type_id: number;
    Domains: Array<{
      id: string;
      name: string;
      score_type: string;
      SubTests: Array<{
        id: string;
        name: string;
        score_type: string;
      }>;
    }>;
    SubTests: Array<{
      id: string;
      name: string;
      score_type: string;
      domain_id: string | null;
    }>;
  };
}

interface Report {
  id: string;
  name: string;
  ReportAssessment: ReportAssessment[];
}

const processAssessmentData = (assessment: any): InputData => {
  const fields: any[] = [];

  // Process domains and their subtests
  assessment.Domains.forEach((domain: any) => {
    fields.push({
      fieldData: {
        name: domain.name,
        score_type: domain.score_type,
      },
      subtests: domain.SubTests.map((subtest: any) => ({
        name: subtest.name,
        score_type: subtest.score_type,
      })),
    });
  });

  // Process standalone subtests (without domain)
  assessment.SubTests.forEach((subtest: any) => {
    if (!subtest.domain_id) {
      fields.push({
        fieldData: {
          name: subtest.name,
          score_type: subtest.score_type,
        },
        subtests: [],
      });
    }
  });

  return {
    fields,
    associatedText: "",
  };
};

export default function GenerateReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${id}`);
        if (!response.ok) throw new Error("Failed to fetch report");
        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleExpandAll = () => {
    if (!report) return;
    const allIds = report.ReportAssessment.map((ra) => ra.Assessment.id);
    setExpandedIds(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedIds([]);
  };

  const toggleDomain = (assessmentId: string) => {
    setExpandedIds((prev) =>
      prev.includes(assessmentId)
        ? prev.filter((id) => id !== assessmentId)
        : [...prev, assessmentId]
    );
  };

  if (loading)
    return <div className="container mx-auto py-8">Loading report...</div>;
  if (error)
    return <div className="container mx-auto py-8 text-red-500">{error}</div>;
  if (!report)
    return <div className="container mx-auto py-8">Report not found</div>;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{report.name}</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleExpandAll}>
            Expand All
          </Button>
          <Button variant="outline" onClick={handleCollapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {report.ReportAssessment.map(({ Assessment }) => (
          <Collapsible
            key={Assessment.id}
            open={expandedIds.includes(Assessment.id)}
            onOpenChange={() => toggleDomain(Assessment.id)}
          >
            <div className="border rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex justify-between items-center p-6 hover:bg-gray-50"
                >
                  <span className="text-lg font-medium">{Assessment.name}</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      expandedIds.includes(Assessment.id) ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-6 bg-gray-50 border-t">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      {Assessment.measure}
                    </p>
                    <TableFormContextProvider
                      initialData={processAssessmentData(Assessment)}
                    >
                      <DynamicTable
                        assessmentName={Assessment.name}
                        measure={Assessment.measure}
                        tableTypeId={Assessment.table_type_id.toString()}
                      />
                    </TableFormContextProvider>
                    <div className="mt-4">
                      <Textarea
                        value={Assessment.description || ""}
                        readOnly
                        className="resize-none bg-white cursor-default"
                        placeholder="No description available"
                      />
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
      <div className="text-right">
        <ExportToDocxButton />
      </div>
    </div>
  );
}
