"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CreateAssessmentHeader from "@/components/assessments/create-assessment-header";
import CreateAssessmentField from "@/components/assessments/create-assessment-field";
import { ModifyTableDialog } from "@/components/assessments/form-swap-hook/modify-table-dialog";
import TableFormContextProvider, {
  useTableFormContext,
} from "@/components/assessments/form-swap-hook/assessments-form-context";

const EditAssessmentPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [measure, setMeasure] = useState("");
  const [tableTypeId, setTableTypeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const { formData, updateFormData, clearFormData } = useTableFormContext();

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const assessmentId = window.location.pathname.split("/").pop();
        const response = await fetch(`/api/assessments/${assessmentId}`);
        if (!response.ok) throw new Error("Failed to fetch assessment");

        const data = await response.json();
        console.log(data);
        setAssessmentData(data);
        setName(data.name);
        setMeasure(data.measure);
        setTableTypeId(data.table_type_id.toString());

        // Transform and update form data
        const transformedData = {
          fields: [
            ...data.domains.map((domain: any) => ({
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
            })),
            ...data.standaloneSubtests.map((subtest: any) => ({
              type: "subtest",
              fieldData: {
                id: subtest.id.toString(),
                name: subtest.name,
                score_type: subtest.score_type,
              },
            })),
          ],
          associatedText: data.description,
        };

        updateFormData(transformedData);
      } catch (error) {
        console.error("Error fetching assessment:", error);
        setError("Failed to load assessment data");
      }
    };

    fetchAssessmentData();
  }, [updateFormData]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const assessmentId = window.location.pathname.split("/").pop();

      const numericTableTypeId = Number(tableTypeId);
      if (isNaN(numericTableTypeId)) {
        throw new Error("Invalid table type id");
      }

      const formattedData = {
        name,
        measure,
        description: formData.associatedText,
        table_type_id: Number(tableTypeId),
        domains: formData.fields
          .filter((field) => field.type === "domain")
          .map((domain) => ({
            id: Number(domain.fieldData.id),
            name: domain.fieldData.name,
            score_type: domain.fieldData.score_type,
            subtests:
              domain.subtests?.map((subtest) => ({
                id: subtest.id ? Number(subtest.id) : null,
                name: subtest.name,
                score_type: subtest.score_type,
              })) || [],
          })),
        standalone_subtests: formData.fields
          .filter((field) => field.type === "subtest")
          .map((subtest) => ({
            id: subtest.fieldData.id ? Number(subtest.fieldData.id) : null,
            name: subtest.fieldData.name,
            score_type: subtest.fieldData.score_type,
          })),
      };

      // Fetch current data from the database to compare
      const existingResponse = await fetch(`/api/assessments/${assessmentId}`);
      const existingData = await existingResponse.json();

      if (!existingResponse.ok) {
        throw new Error(existingData.error || "Failed to fetch current data");
      }

      // Identify deleted domains and subtests
      const existingDomains = new Set(existingData.domains.map((d: any) => d.id));
      const newDomains = new Set(formattedData.domains.map((d: any) => d.id));
      const domainsToDelete = Array.from(existingDomains).filter((id) => !newDomains.has(id));

      console.log("Domains to delete:", domainsToDelete);

      // Collect all existing subtests (both from domains and standalone)
      const existingSubtests = new Set([
        ...existingData.domains.flatMap((d: any) => d.subtests.map((s: any) => s.id)),
        ...existingData.standaloneSubtests.map((s: any) => s.id)
      ]);

      // Collect all new subtests (both from domains and standalone)
      const newSubtests = new Set([
        ...formattedData.domains.flatMap((d: any) => d.subtests.map((s: any) => s.id).filter(Boolean)),
        ...formattedData.standalone_subtests.map((s: any) => s.id).filter(Boolean)
      ]);

      const subtestsToDelete = Array.from(existingSubtests).filter((id) => !newSubtests.has(id));

      console.log("Subtests to delete:", subtestsToDelete);

      // For now, let's try a workaround: create a special update payload
      // that explicitly lists only the items we want to keep
      const cleanedFormattedData = {
        id: Number(assessmentId),
        name,
        measure,
        description: formData.associatedText,
        table_type_id: Number(tableTypeId),
        // Only include domains that should NOT be deleted
        domains: formData.fields
          .filter((field) => field.type === "domain")
          .filter(field => !domainsToDelete.includes(Number(field.fieldData.id)))
          .map((domain) => ({
            id: Number(domain.fieldData.id),
            name: domain.fieldData.name,
            score_type: domain.fieldData.score_type,
            // Only include subtests that should NOT be deleted
            subtests: (domain.subtests || [])
              .filter(subtest => !subtestsToDelete.includes(Number(subtest.id)))
              .map((subtest) => ({
                id: subtest.id ? Number(subtest.id) : null,
                name: subtest.name,
                score_type: subtest.score_type,
              })),
          })),
        // Only include standalone subtests that should NOT be deleted
        standalone_subtests: formData.fields
          .filter((field) => field.type === "subtest")
          .filter(field => !subtestsToDelete.includes(Number(field.fieldData.id)))
          .map((subtest) => ({
            id: subtest.fieldData.id ? Number(subtest.fieldData.id) : null,
            name: subtest.fieldData.name,
            score_type: subtest.fieldData.score_type,
          })),
      };

      console.log("Sending cleaned data without deleted items:", cleanedFormattedData);

      // Update the assessment with the cleaned data
      const response = await fetch(`/api/assessments/${assessmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(cleanedFormattedData),
      });

      // Try to parse the response as JSON, but handle non-JSON responses gracefully
      let responseData;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          const text = await response.text();
          responseData = { error: text };
        }
      } catch (e) {
        const text = await response.text();
        responseData = { error: `Failed to parse response: ${text}` };
      }

      if (!response.ok) {
        console.error("Update failed:", responseData);
        throw new Error(responseData.error || `Update failed with status ${response.status}`);
      }

      // Successfully updated, return to assessments list
      router.push("/assessments");
    } catch (error) {
      console.error("Update error:", error);
      setError(error instanceof Error ? error.message : "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-20">
      <div className="flex-col items-center justify-items-center">
        <CreateAssessmentHeader
          onTableTypeChange={(value) => setTableTypeId(value)}
          mode="modify"
          selectedTypeId={tableTypeId}
        />
        <CreateAssessmentField name="Name" value={name} onChange={setName} />
        <CreateAssessmentField
          name="Measure"
          value={measure}
          onChange={setMeasure}
        />

        {assessmentData && (
          <ModifyTableDialog
            assessmentName={name}
            measure={measure}
            tableTypeId={tableTypeId}
            onClose={() => { }}
            existingData={assessmentData}
          />
        )}

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        <div className="grid grid-cols-5 w-full fixed bottom-10 left-10">
          <Button
            className="col-start-1 col-span-1"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            className="col-start-4 col-span-1"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function EditAssessmentPageWrapper() {
  return (
    <TableFormContextProvider>
      <EditAssessmentPage />
    </TableFormContextProvider>
  );
}
