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
import ReportDynamicTable from "@/components/reports/report-gen/report-dynamic-table";
import { DataRow } from "@/types/data-row";

interface Assessment {
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
}

interface ReportAssessment {
  Assessment: Assessment;
}

interface Report {
  id: string;
  name: string;
  ReportAssessment: ReportAssessment[];
}

// Process assessment data into InputData format
const processAssessmentData = (assessment: Assessment): InputData => {
  const fields: any[] = [];
  assessment.Domains.forEach((domain) => {
    fields.push({
      fieldData: { name: domain.name, score_type: domain.score_type },
      subtests: domain.SubTests.map((subtest) => ({
        name: subtest.name,
        score_type: subtest.score_type,
      })),
    });
  });
  assessment.SubTests.forEach((subtest) => {
    if (!subtest.domain_id) {
      fields.push({
        fieldData: { name: subtest.name, score_type: subtest.score_type },
        subtests: [],
      });
    }
  });
  return { fields, associatedText: "" };
};

const generateInitialDataRows = (inputData: InputData): DataRow[] => {
  let id = 0;
  const mappedData: DataRow[] = [];
  inputData.fields.forEach((field) => {
    const isDomain = field.subtests && field.subtests.length > 0;
    mappedData.push({
      id: id++,
      DomSub: field.fieldData.name,
      Scale: field.fieldData.score_type,
      Score: 0,
      depth: isDomain ? 0 : 0,
    });
    if (field.subtests) {
      field.subtests.forEach((subtest) => {
        mappedData.push({
          id: id++,
          DomSub: subtest.name,
          Scale: subtest.score_type,
          Score: 0,
          depth: 1,
        });
      });
    }
  });
  return mappedData;
};

export default function GenerateReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assessmentsData, setAssessmentsData] = useState<
    Record<string, DataRow[]>
  >({});

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${id}`);
        if (!response.ok) throw new Error("Failed to fetch report");
        const data: Report = await response.json();
        const sortedReport = {
          ...data,
          ReportAssessment: [...data.ReportAssessment].sort((a, b) => {
            const aAssessment = a.Assessment;
            const bAssessment = b.Assessment;
            if (aAssessment.table_type_id !== bAssessment.table_type_id) {
              return bAssessment.table_type_id - aAssessment.table_type_id;
            }
            return aAssessment.name.localeCompare(bAssessment.name);
          }),
        };

        setReport(sortedReport);

        const initialData = sortedReport.ReportAssessment.reduce<
          Record<string, DataRow[]>
        >((acc, { Assessment }) => {
          const inputData = processAssessmentData(Assessment);
          acc[Assessment.id] = generateInitialDataRows(inputData);
          return acc;
        }, {});
        setAssessmentsData(initialData);
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
    setExpandedIds(report.ReportAssessment.map((ra) => ra.Assessment.id));
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

  const dynamicTables = report.ReportAssessment.map(({ Assessment }) => {
    const dataRows = assessmentsData[Assessment.id] || [];
    return ReportDynamicTable({
      assessmentName: Assessment.name,
      measure: Assessment.measure,
      description: Assessment.description,
      dataRows,
    });
  });

  const assessmentNames = report.ReportAssessment.map(
    (ra) => ra.Assessment.name
  );

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
                        initialData={assessmentsData[Assessment.id] || []}
                        onDataChange={(newData) =>
                          setAssessmentsData((prev) => ({
                            ...prev,
                            [Assessment.id]: newData,
                          }))
                        }
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
        <ExportToDocxButton
          dynamicTables={dynamicTables}
          assessmentNames={assessmentNames}
        />
      </div>
    </div>
  );
}
