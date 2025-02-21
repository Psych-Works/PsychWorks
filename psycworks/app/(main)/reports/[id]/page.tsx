"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface Domain {
  id: number;
  name: string;
  score_type: string;
  subtests: Subtest[];
}

interface Subtest {
  id: number;
  name: string;
  score_type: string;
}

interface Assessment {
  id: number;
  name: string;
  measure: string;
  description: string;
  created_at: string;
  updated_at: string | null;
  domains: Domain[];
  standaloneSubtests: Subtest[];
}

interface Report {
  id: number;
  name: string;
  created_at: string;
  updated_at: string | null;
  assessments: Assessment[];
}

export default function ViewReportPage() {
  const router = useRouter();
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${id}`);
        if (!response.ok) throw new Error("Failed to fetch report");
        const data = await response.json();
        const formattedData = {
          ...data,
          assessments:
            data.ReportAssessment?.map((ra: any) => ra.Assessment) || [],
        };
        setReport(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return <div className="p-4">Loading report...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!report) return <div className="p-4">Report not found</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{report.name}</h1>
        <Button onClick={() => router.back()}>Back to List</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Created</p>
            <p>{format(new Date(report.created_at), "PPpp")}</p>
          </div>
          <div>
            <p className="font-medium">Last Updated</p>
            <p>
              {report.updated_at
                ? format(new Date(report.updated_at), "PPpp")
                : "Never"}
            </p>
          </div>
        </CardContent>
      </Card>

      {report.assessments?.map((assessment) => (
        <Card key={assessment.id}>
          <CardHeader>
            <CardTitle>{assessment.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">Measure: {assessment.measure}</p>

            {assessment.domains?.map((domain) => (
              <div key={domain.id} className="mt-4">
                <h3 className="text-xl font-semibold">{domain.name}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subtest Name</TableHead>
                      <TableHead>Score Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {domain.subtests.map((subtest) => (
                      <TableRow key={subtest.id}>
                        <TableCell>{subtest.name}</TableCell>
                        <TableCell>{subtest.score_type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
