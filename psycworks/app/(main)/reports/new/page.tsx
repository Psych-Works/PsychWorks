"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewReportPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Create New Report</h1>
        <Link href="/reports">
            <Button className='col-start-1 col-span-1'>Cancel</Button>
        </Link>
      </div>
      <p className="text-gray-500 mt-2">
        Fill in the details below to create a new report.
      </p>
    </div>
  );
}
