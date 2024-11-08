import React from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/searchbar/search-bar";
import { AssessmentsTable } from "@/components/assessments/assessments-table";

export default function AssessmentsPage() {
  return (
    <div className="space-y-20">
      <div className="absolute left-[10%] right-[10%] top-40 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Assessment Table Template</h1>
          <p className="text-gray-500 mt-2">
            Create templates to use tables that you can reuse on Templates
          </p>
        </div>
        <Button className="w-40 h-12">Create</Button>
      </div>
      <div className="absolute left-40 right-40 top-60">
        <SearchBar />
      </div>

      <AssessmentsTable />
    </div>
  );
}
