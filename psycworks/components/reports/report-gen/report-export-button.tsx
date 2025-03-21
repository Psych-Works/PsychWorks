import React from "react";
import { Button } from "@/components/ui/button";
import { AlignmentType, Document, LevelFormat, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
import {
  ReportTitle,
  ClientInfo,
  ReportHeader,
  ReportFooter,
  FirstHalfHeaders,
  getReportEvaluationMethods,
  ReportAssessmentResults,
  EndOfReport,
} from "@/components/reports/report-gen/report-static-text";

interface ExportToDocxButtonProps {
  dynamicTables?: any[];
  assessmentNames: string[];
}

const ExportToDocxButton = ({
  dynamicTables,
  assessmentNames,
}: ExportToDocxButtonProps) => {
  const handleExport = async () => {
    const reportEvaluationMethods = getReportEvaluationMethods(assessmentNames);

    const childrenElements = [
      ReportTitle,
      ClientInfo,
      ...FirstHalfHeaders,
      ...reportEvaluationMethods,
      ...ReportAssessmentResults,
    ];

    if (dynamicTables && dynamicTables.length > 0) {
      dynamicTables.forEach((tableEntry, index) => {
        const elements = Array.isArray(tableEntry) ? tableEntry : [tableEntry];
        childrenElements.push(...elements);

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
        {
          children: [...EndOfReport],
        },
      ],
      numbering: {
        config: [
          {
            reference: "1",
            levels: [
              {
                level: 0,
                format: LevelFormat.DECIMAL,
                text: "%1.",
                alignment: AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: {
                      left: 500,
                    },
                  },
                },
              },
              {
                level: 1,
                format: LevelFormat.LOWER_LETTER,
                text: "%2.",
                alignment: AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: {
                      left: 750,
                    },
                  },
                },
              },
            ],
          },
        ],
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
      Generate Report
    </Button>
  );
};

export default ExportToDocxButton;
