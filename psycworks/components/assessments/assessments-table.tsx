"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface Assessment {
  id: bigint;
  table_type_id: bigint;
  name: string;
  created_at: string;
  updated_at: string | null;
  score_conversion: bigint | null;
  score_type: "raw" | "standard" | "percentile" | null;
  measure: string;
}

interface ApiResponse {
  data: Assessment[];
  totalCount: number;
  page: number;
  totalPages: number;
}

interface AssessmentsTableProps {
  searchQuery?: string;
}

export function AssessmentsTable({ searchQuery = "" }: AssessmentsTableProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    sortBy: "created_at",
    order: "desc",
  });

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        sortBy: sortConfig.sortBy,
        order: sortConfig.order,
        search: searchQuery,
      });

      const response = await fetch(`/api/assessments?${queryParams}`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch assessments");

      const { data }: ApiResponse = await response.json();
      setAssessments(data);
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [sortConfig.sortBy, sortConfig.order, searchQuery]);

  const handleDeleteAssessment = async (assessmentId: bigint) => {
    try {
      const response = await fetch(`/api/assessments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: Number(assessmentId) }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete assessment");
      }

      await fetchAssessments();
    } catch (error) {
      console.error("Error deleting assessment:", error);
    }
  };

  const handleSort = (column: string) => {
    setSortConfig((prev) => ({
      sortBy: column,
      order: prev.sortBy === column && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const SortButton = ({
    column,
    children,
  }: {
    column: string;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(column)}
      className="hover:bg-transparent"
    >
      {children}
      {sortConfig.sortBy === column && (
        <span className="ml-2">{sortConfig.order === "asc" ? "↑" : "↓"}</span>
      )}
    </Button>
  );

  if (loading) {
    return (
      <div className="flex justify-center p-8">Loading assessments...</div>
    );
  }

  return (
    <div className="space-y-4 border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-primary/20 hover:bg-primary/5">
            <TableHead className="bg-primary/5 text-center">
              <SortButton column="name">Name</SortButton>
            </TableHead>
            <TableHead className="bg-primary/5 text-center">
              <SortButton column="measure">Measure</SortButton>
            </TableHead>
            <TableHead className="bg-primary/5 text-center">
              <SortButton column="created_at">Created At</SortButton>
            </TableHead>
            <TableHead className="bg-primary/5 text-center">
              <SortButton column="updated_at">Updated At</SortButton>
            </TableHead>
            <TableHead className="bg-primary/5 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.length > 0 ? (
            assessments.map((assessment) => (
              <TableRow
                key={assessment.id.toString()}
                className="border-b border-primary/10 hover:bg-primary/5"
              >
                <TableCell className="font-medium text-center">
                  {assessment.name}
                </TableCell>
                <TableCell className="text-center">
                  {assessment.measure}
                </TableCell>
                <TableCell className="text-center">
                  {format(new Date(assessment.created_at), "PPP")}
                </TableCell>
                <TableCell className="text-center">
                  {assessment.updated_at
                    ? format(new Date(assessment.updated_at), "PPP")
                    : "—"}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Link href={`/assessments/${assessment.id}`} passHref>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Link href={`/assessments/edit/${assessment.id}`} passHref>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Do you really want to delete this?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Data of{" "}
                            <span className="font-bold">{assessment.name}</span>{" "}
                            will be permanently removed!
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDeleteAssessment(assessment.id);
                            }}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No assessments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
