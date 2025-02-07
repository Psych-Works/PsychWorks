"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function AssessmentSelectionDialog({
  open,
  onOpenChange,
  selected,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: any[];
  onSelect: (assessments: any[]) => void;
}) {
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch("/api/assessments");
        const { data } = await response.json();
        setAssessments(data);
      } catch (error) {
        console.error("Failed to fetch assessments:", error);
      }
    };
    fetchAssessments();
  }, []);

  const handleSelect = (assessment: any) => {
    const isSelected = selected.some((a) => a.id === assessment.id);
    onSelect(
      isSelected
        ? selected.filter((a) => a.id !== assessment.id)
        : [...selected, assessment]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Assessments</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="flex items-center gap-4 p-2 hover:bg-muted/50 rounded-lg"
            >
              <Checkbox
                checked={selected.some((a) => a.id === assessment.id)}
                onCheckedChange={() => handleSelect(assessment)}
              />
              <div className="flex-1">
                <p className="font-medium">{assessment.name}</p>
                <p className="text-sm text-muted-foreground">
                  {assessment.measure}
                </p>
                <p className="text-xs text-muted-foreground">
                  Created:{" "}
                  {new Date(assessment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
