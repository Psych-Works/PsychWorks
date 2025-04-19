import { Table, TableRow, TableCell, Paragraph, TextRun } from "docx";
import { DataRow } from "@/types/data-row";
import { getPercentileFromScore } from "@/utils/percentile";

interface ReportDynamicTableProps {
  assessmentName: string;
  measure: string;
  description?: string;
  dataRows: DataRow[];
  bodyText?: string;
}

export const ReportDynamicTable = ({
  assessmentName,
  measure,
  description,
  dataRows,
  bodyText = "",
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

  // Process body text to replace domain references with actual scores
  const processBodyText = (text: string) => {
    let processedText = text;
    dataRows.forEach((row) => {
      if (row.depth === 0) { // Only process domain rows
        const domainName = row.DomSub;
        const score = row.Score;
        const regex = new RegExp(`\\[${domainName}\\]`, 'g');
        processedText = processedText.replace(regex, score.toString());
      }
    });
    return processedText;
  };

  const bodyTextParagraph = bodyText
    ? new Paragraph({
        children: [
          new TextRun({
            text: processBodyText(bodyText),
            size: 24,
            font: "Times New Roman",
          }),
        ],
        spacing: { before: 240, after: 240 },
      })
    : null;

  return [tablePlaceholder, descriptionParagraph, bodyTextParagraph].filter(Boolean);
};

export default ReportDynamicTable;
