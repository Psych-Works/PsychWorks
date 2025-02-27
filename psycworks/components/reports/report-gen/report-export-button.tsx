import React from "react";
import { Button } from "@/components/ui/button";
import { Document, Packer } from "docx";
import { saveAs } from "file-saver";
import {
  ReportTitle,
  ClientInfo,
  ReportHeader,
  ReportFooter,
  FirstHalfHeaders,
  ReportEvaluationMethods,
  ReportAssessmentResults,
} from "@/components/reports/report-gen/report-static-text";

const ExportToDocxButton = () => {
  const handleExport = async () => {
    const doc = new Document({
      sections: [
        {
          headers: {
            default: ReportHeader,
          },
          footers: {
            default: ReportFooter,
          },
          children: [
            ReportTitle,
            ClientInfo,
            ...FirstHalfHeaders,
            ...ReportEvaluationMethods,
            ReportAssessmentResults,
          ],
        },
      ],
    });

    // Generate the document and save it
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(blob, "report.docx");
  };

  return (
    <Button className="w-40 h-12" onClick={handleExport}>
      Export to Docx
    </Button>
  );
};

export default ExportToDocxButton;
