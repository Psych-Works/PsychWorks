import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ReportsTable = () => {
  return (
    <div className="space-y-4 border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-primary/20">
            <TableHead className="bg-primary/5 text-center">Report Name</TableHead>
            <TableHead className="bg-primary/5 text-center">Date</TableHead>
            <TableHead className="bg-primary/5 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Empty state */}
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4">
              No reports available.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsTable; 