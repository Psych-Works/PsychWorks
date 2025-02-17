// components/assessments/form-swap-hook/modify-table-dialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useTableFormContext } from "./assessments-form-context";
import { Button } from "@/components/ui/button";
import { CreationForm } from "./creation-form";
import { FinalizeForm } from "./finalize-form";
import { useEffect, useState } from "react";

interface ModifyTableDialogProps {
  assessmentName: string;
  onClose: () => void;
  measure: string;
  tableTypeId: string;
  existingData: any; // Add prop for existing data
}

const FormContainer = ({
  onClose,
  assessmentName,
  measure,
  tableTypeId,
  existingData,
}: ModifyTableDialogProps) => {
  const { currentStep, updateFormData } = useTableFormContext();

  return (
    <>
      {currentStep === 1 && <CreationForm />}
      {currentStep === 2 && (
        <FinalizeForm
          onClose={onClose}
          assessmentName={assessmentName}
          measure={measure}
          tableTypeId={tableTypeId}
        />
      )}
    </>
  );
};

// Transform API response to InputData format
const transformExistingData = (data: any) => {
  const fields = [];

  // Process domains
  if (data.domains) {
    for (const domain of data.domains) {
      fields.push({
        type: "domain",
        fieldData: {
          id: domain.id.toString(),
          name: domain.name,
          score_type: domain.score_type,
        },
        subtests: domain.subtests.map((subtest: any) => ({
          id: subtest.id.toString(),
          name: subtest.name,
          score_type: subtest.score_type,
          domain_id: domain.id.toString(),
        })),
      });
    }
  }

  // Process standalone subtests
  if (data.standaloneSubtests) {
    for (const subtest of data.standaloneSubtests) {
      fields.push({
        type: "subtest",
        fieldData: {
          id: subtest.id.toString(),
          name: subtest.name,
          score_type: subtest.score_type,
        },
      });
    }
  }

  return {
    fields,
    associatedText: data.description || "",
  };
};

export const ModifyTableDialog = ({
  assessmentName,
  onClose,
  measure,
  tableTypeId,
  existingData,
}: ModifyTableDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { formData, updateFormData } = useTableFormContext();

  const handleSetIsOpen = (open: boolean) => {
    if (!open) {
      updateFormData({
        ...formData,
        associatedText: formData.associatedText,
      });
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleSetIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => handleSetIsOpen(true)}
          variant="outline"
          className="ml-4"
        >
          Edit Domain/Subtest
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[80%] h-[80vh] w-[80%] flex flex-col overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle>Assessment Modification</DialogTitle>
        <DialogDescription />

        <FormContainer
          onClose={() => handleSetIsOpen(false)}
          assessmentName={assessmentName}
          measure={measure}
          tableTypeId={tableTypeId}
          existingData={existingData}
        />
      </DialogContent>
    </Dialog>
  );
};
