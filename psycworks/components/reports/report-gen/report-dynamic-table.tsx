import { Table, TableRow, TableCell, Paragraph, TextRun } from "docx";
import { DataRow } from "@/types/data-row";
import { getPercentileFromScore } from "@/utils/percentile";

interface ReportDynamicTableProps {
  assessmentName: string;
  measure: string;
  description?: string;
  dataRows: DataRow[];
}

export const ReportDynamicTable = ({
  assessmentName,
  measure,
  description,
  dataRows,
}: ReportDynamicTableProps) => {
  const tablePlaceholder = new Paragraph({
    children: [
      new TextRun({
        text: `[${assessmentName} table goes here]`,
        bold: true,
        size: 28,
      }),
    ],
    spacing: { after: 240 }, // space after title
  });

  const descriptionParagraph = description
    ? new Paragraph({
      children: [
        new TextRun({
          text: description,
          size: 24,
          font: "Times New Roman",
        }),
      ],
      spacing: { before: 240, after: 240 },
    })
    : null;

  return [tablePlaceholder, descriptionParagraph];
};

export default ReportDynamicTable;
