import React from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/searchbar/search-bar";
import { AssessmentsTable } from "@/components/assessments/assessments-table";
import Link from "next/link";

export default function AssessmentsPage() {
  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Assessment Table Template</h1>
          <p className="text-gray-500 mt-2">
            Create templates to use tables that you can reuse on Templates
          </p>
        </div>
        <Link href="/assessments/new">
          <Button className="w-40 h-12">Create</Button>
        </Link>
      </div>

      <div className="w-full">
        <SearchBar />
      </div>

      <AssessmentsTable />
    </div>
  );
}
