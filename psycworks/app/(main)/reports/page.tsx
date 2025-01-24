import React from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/searchbar/search-bar";
import ReportsTable from "@/components/reports/reports-table";
import Link from "next/link";

export default function ReportsPage() {
  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Reports</h1>
          <p className="text-gray-500 mt-2">
            Create Reports for patients using saved assessment tables.
          </p>
        </div>
        <Link href="/reports/new">
          <Button className="w-40 h-12">Create</Button>
        </Link>
      </div>

      <div className="w-full">
        <SearchBar />
      </div>

      <ReportsTable />
    </div>
  );
}
