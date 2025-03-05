import React from "react";
import { Button } from "@/components/ui/button";
import { Document, Packer, Paragraph } from "docx";
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

interface ExportToDocxButtonProps {
  dynamicTables?: any[];
}

const ExportToDocxButton = ({ dynamicTables }: ExportToDocxButtonProps) => {
  const handleExport = async () => {
    const childrenElements = [
      ReportTitle,
      ClientInfo,
      ...FirstHalfHeaders,
      ...ReportEvaluationMethods,
      ...ReportAssessmentResults,
    ];

    if (dynamicTables && dynamicTables.length > 0) {
      dynamicTables.forEach((table, index) => {
        childrenElements.push(table);
        if (index !== dynamicTables.length - 1) {
          childrenElements.push(
            new Paragraph({
              text: "",
              spacing: { after: 240 },
            })
          );
        }
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            titlePage: true,
          },
          headers: {
            first: ReportHeader,
          },
          footers: {
            default: ReportFooter,
          },
          children: childrenElements,
        },
      ],
      numbering: {
        config: [],
      },
    });

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
