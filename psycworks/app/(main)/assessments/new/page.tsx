"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CreateAssessmentHeader from "@/components/assessments/create-assessment-header";
import CreateAssessmentField from "@/components/assessments/create-assessment-field";
import { CreateTableDialog } from "@/components/assessments/form-swap-hook/assessment-form";
import TableFormContextProvider, {
  useTableFormContext,
} from "@/components/assessments/form-swap-hook/assessments-form-context";
import { useRouter } from "next/navigation";

interface Field {
  type: string;
  fieldData: {
    id?: string;
    name: string;
    score_type: string;
    parentId?: string;
  };
}

function NewAssessmentContent() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [measure, setMeasure] = useState("");
  const [tableTypeId, setTableTypeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { formData, clearFormData } = useTableFormContext();

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleMeasureChange = (value: string) => {
    setMeasure(value);
  };

  const handleTableTypeIdChange = (value: string) => {
    setTableTypeId(value);
  };

  const handleCancel = () => {
    clearFormData();
    router.back();
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !measure ||
      !tableTypeId ||
      formData.fields.length === 0 ||
      !formData.associatedText
    ) {
      setError("Please fill all required fields including the description");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Transform fields to include top-level 'id'
      const transformedFields = formData.fields.flatMap((field) => {
        const mainField = {
          type: field.type,
          id: field.fieldData.id,
          fieldData: {
            name: field.fieldData.name,
            score_type: field.fieldData.score_type,
          },
        };

        if (field.type === "domain" && field.subtests) {
          const subtests = field.subtests.map((subtest) => ({
            type: "subtest",
            id: subtest.id,
            fieldData: {
              name: subtest.name,
              score_type: subtest.score_type,
              id: subtest.domain_id,
            },
          }));
          return [mainField, ...subtests];
        }
        return [mainField];
      });

      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          measure,
          description: formData.associatedText, // ADD THIS
          table_type_id: Number(tableTypeId),
          fields: transformedFields,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create assessment");
      }

      router.push("/assessments");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create assessment"
      );
    } finally {
      setIsSubmitting(false);
    }
    clearFormData();
  };

  useEffect(() => {
    clearFormData();
  }, []);

  return (
    <div className="space-y-20">
      <div className="flex-col items-center justify-items-center">
        <CreateAssessmentHeader onTableTypeChange={handleTableTypeIdChange} />
        <CreateAssessmentField
          name="Name"
          value={name}
          onChange={handleNameChange}
        />
        <CreateAssessmentField
          name="Measure"
          value={measure}
          onChange={handleMeasureChange}
        />

        <CreateTableDialog
          assessmentName={name}
          onClose={() => {}}
          measure={measure}
          tableTypeId={tableTypeId}
        />

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}

        <div className="grid grid-cols-5 w-full fixed bottom-10 left-10">
          <Button className="col-start-1 col-span-1" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className="col-start-4 col-span-1"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Assessment"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NewAssessmentPage() {
  return (
    <TableFormContextProvider>
      <NewAssessmentContent />
    </TableFormContextProvider>
  );
}
