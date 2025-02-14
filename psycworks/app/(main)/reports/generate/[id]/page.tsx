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

interface ReportAssessment {
  Assessment: {
    id: string;
    name: string;
    measure: string;
  };
}

interface Report {
  id: string;
  name: string;
  ReportAssessment: ReportAssessment[];
}

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

  if (loading) {
    return <div className="container mx-auto py-8">Loading report...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">{error}</div>;
  }

  if (!report) {
    return <div className="container mx-auto py-8">Report not found</div>;
  }

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
                    <div className="h-32 flex items-center justify-center bg-background rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Content area for {Assessment.name}
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
