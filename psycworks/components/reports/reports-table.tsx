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
import { Eye, Trash2 } from "lucide-react";

interface Report {
  id: bigint;
  created_at: string;
  updated_at: string | null;
  name: string;
  ReportAssessment: {
    Assessment: {
      name: string;
      measure: string;
    }[];
  }[];
}

interface ApiResponse {
  data: Report[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export function ReportsTable() {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    sortBy: "created_at",
    order: "desc",
  });

  const limit = 10;

  const fetchReports = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        sortBy: sortConfig.sortBy,
        order: sortConfig.order,
      });

      const response = await fetch(`/api/reports?${queryParams}`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch reports");

      const { data, totalCount, page, totalPages }: ApiResponse =
        await response.json();

      setReports(data);
      setCurrentPage(page);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentPage, sortConfig.sortBy, sortConfig.order]);

  const handleDeleteReport = async (reportId: bigint) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: Number(reportId) }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      await fetchReports();
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const handleSort = (column: string) => {
    setSortConfig((prev) => ({
      sortBy: column,
      order: prev.sortBy === column && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
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
    return <div className="flex justify-center p-8">Loading reports...</div>;
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
              <SortButton column="created_at">Created At</SortButton>
            </TableHead>
            <TableHead className="bg-primary/5 text-center">
              <SortButton column="updated_at">Updated At</SortButton>
            </TableHead>
            <TableHead className="bg-primary/5 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <TableRow
                key={report.id.toString()}
                className="border-b border-primary/10 hover:bg-primary/5"
              >
                <TableCell className="font-medium text-center">
                  {report.name}
                </TableCell>
                <TableCell className="text-center">
                  {format(new Date(report.created_at), "PPP")}
                </TableCell>
                <TableCell className="text-center">
                  {report.updated_at
                    ? format(new Date(report.updated_at), "PPP")
                    : "—"}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Link href={`/reports/${report.id}`} passHref>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10"
                          aria-label="Delete report"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Report</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this report?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            Delete
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
                No reports found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
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
                Page {currentPage} of {totalPages}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                }}
                className={`${
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-primary/10"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
