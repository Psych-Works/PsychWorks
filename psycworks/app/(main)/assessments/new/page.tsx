"use client";
import { useState } from "react";
import { CreationForm } from "@/components/assessments/creation-form";
import { Button } from "@/components/ui/button";
import CreateAssessmentHeader from "@/components/assessments/create-assessment-header";
import CreateAssessmentField from "@/components/assessments/create-assessment-field";
import Link from "next/link";

export default function NewAssessmentPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <div className="space-y-20">
        <div className="flex-col items-center justify-items-center">
          <CreateAssessmentHeader />
          <CreateAssessmentField name='Name' />
          <CreateAssessmentField name='Measure' />
          <div className='grid grid-cols-5 w-full'>
            <CreationForm isOpen={isOpen} onOpenChange={setIsOpen} />
          </div>
          <div className='grid grid-cols-5 w-full fixed bottom-10 left-10'>
            <Link href="/assessments">
              <Button className='col-start-1 col-span-1'>Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
