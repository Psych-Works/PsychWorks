"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CreateReportHeader } from "@/components/reports/create-report-header";
import { AssessmentSelectionDialog } from "@/components/reports/assessment-selection-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

export default function NewReportPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedAssessments, setSelectedAssessments] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || selectedAssessments.length === 0) {
      setError("Please fill template name and select at least one assessment");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          assessment_ids: selectedAssessments.map((a) => a.id),
        }),
      });

      if (!response.ok) throw new Error("Failed to create template");
      router.push("/reports");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Create Report Template</h1>
      </div>

      <CreateReportHeader
        name={name}
        onNameChange={setName}
        onAddAssessment={() => setShowDialog(true)}
      />

      <AssessmentSelectionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        selected={selectedAssessments}
        onSelect={setSelectedAssessments}
      />

      {/* Selected Assessments Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assessment Name</TableHead>
              <TableHead>Measure</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedAssessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell className="font-medium">{assessment.name}</TableCell>
                <TableCell>{assessment.measure}</TableCell>
                <TableCell>
                  {new Date(assessment.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setSelectedAssessments((prev) =>
                        prev.filter((a) => a.id !== assessment.id)
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {selectedAssessments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-32">
                  No assessments selected
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Bottom buttons grid matching assessment page layout */}
      <div className="grid grid-cols-5 w-full fixed bottom-10 left-10">
        <Button
          className="col-start-1 col-span-1"
          onClick={() => router.back()}
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="col-start-4 col-span-1"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Template"}
        </Button>
      </div>

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
}
