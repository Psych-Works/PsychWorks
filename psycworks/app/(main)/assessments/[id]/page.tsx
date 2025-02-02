// app/assessments/view/[id]/page.tsx
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
import Link from "next/link";

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
  table_type_name: string;
  created_at: string;
  updated_at: string | null;
  domains: Domain[];
  standaloneSubtests: Subtest[];
}

export default function ViewAssessmentPage() {
  const router = useRouter();
  const { id } = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${id}`);
        if (!response.ok) throw new Error("Failed to fetch assessment");
        const data = await response.json();
        setAssessment(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load assessment"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  if (loading) return <div className="p-4">Loading assessment...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!assessment) return <div className="p-4">Assessment not found</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{assessment.name}</h1>
        <Button onClick={() => router.back()}>Back to List</Button>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Measure</p>
            <p>{assessment.measure}</p>
          </div>
          <div>
            <p className="font-medium">Table Type</p>
            <p>{assessment.table_type_name}</p>
          </div>
          <div>
            <p className="font-medium">Created</p>
            <p>{format(new Date(assessment.created_at), "PPpp")}</p>
          </div>
          <div>
            <p className="font-medium">Last Updated</p>
            <p>
              {assessment.updated_at
                ? format(new Date(assessment.updated_at), "PPpp")
                : "Never"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Description Card */}
      {assessment.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-700">
              {assessment.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Domains Section */}
      {assessment.domains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Domains</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {assessment.domains.map((domain) => (
              <div key={domain.id} className="border rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{domain.name}</h3>
                  <p className="text-sm text-gray-500">
                    Score Type: {domain.score_type}
                  </p>
                </div>

                {domain.subtests.length > 0 && (
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
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Standalone Subtests */}
      {assessment.standaloneSubtests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Standalone Subtests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subtest Name</TableHead>
                  <TableHead>Score Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessment.standaloneSubtests.map((subtest) => (
                  <TableRow key={subtest.id}>
                    <TableCell>{subtest.name}</TableCell>
                    <TableCell>{subtest.score_type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
