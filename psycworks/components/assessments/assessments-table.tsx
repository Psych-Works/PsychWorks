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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface Assessment {
  id: bigint;
  table_type_id: bigint;
  name: string;
  created_at: string;
  updated_at: string | null;
  score_conversion: bigint | null;
  score_type: 'raw' | 'standard' | 'percentile' | null;
  measure: string;
}

export function AssessmentsTable() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    sortBy: "created_at",
    order: "desc",
  });

  const limit = 10;

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        sortBy: sortConfig.sortBy,
        order: sortConfig.order,
      });

      const response = await fetch(`/api/assessments?${queryParams}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setAssessments(data);
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [currentPage, sortConfig]);

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
    return <div>Loading...</div>;
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
          {assessments.map((assessment) => (
            <TableRow
              key={assessment.id}
              className="border-b border-primary/10 hover:bg-primary/5"
            >
              <TableCell className="font-medium text-center">{assessment.name}</TableCell>
              <TableCell className="text-center">{assessment.measure}</TableCell>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="border-t border-primary/10 py-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.max(prev - 1, 1));
              }}
              className={`${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-primary/10"
              }`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="bg-primary/5">
              {currentPage}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => prev + 1);
              }}
              className={`${
                assessments.length < limit
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-primary/10"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
