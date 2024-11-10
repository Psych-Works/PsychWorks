"use client";
import { useState } from "react";
import { CreationForm } from "@/components/assessments/creation-form";


export default function NewAssessmentPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
     
     <CreationForm 
        isOpen={isOpen} 
        onOpenChange={setIsOpen}
      />
     
    </div>
  );
}
