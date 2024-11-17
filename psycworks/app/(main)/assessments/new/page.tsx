"use client";

import { useState } from "react";
import {Button} from "@/components/ui/button";
import CreateAssessmentHeader from "@/components/assessments/create-assessment-header";
import CreateAssessmentField from "@/components/assessments/create-assessment-field";
import HookFormSwap from "@/components/assessments/form-swap-hook";

export default function NewAssessmentPage() {
  
  return (
    <div>
     <div className="space-y-20">
          <div className="flex-col items-center justify-items-center">
              <CreateAssessmentHeader/>
              <CreateAssessmentField name='Name'/>
              <CreateAssessmentField name='Measure'/>
              
              <HookFormSwap />

              <div className='grid grid-cols-5 w-full fixed bottom-10 left-10'>
                  <Button className='col-start-1 col-span-1'>Cancel</Button>
              </div>
          </div>
          
      </div>
    </div>
  );
}
