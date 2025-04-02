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
  // const titleRow = new TableRow({
  //   children: [
  //     new TableCell({
  //       columnSpan: 4,
  //       children: [
  //         new Paragraph({
  //           children: [
  //             new TextRun({
  //               text: `${assessmentName} (${measure})`,
  //               bold: true,
  //             }),
  //           ],
  //         }),
  //       ],
  //     }),
  //   ],
  // });

  // const headerRow = new TableRow({
  //   children: [
  //     new TableCell({
  //       children: [
  //         new Paragraph({
  //           children: [new TextRun({ text: "Domain/Subtest" })],
  //         }),
  //       ],
  //     }),
  //     new TableCell({
  //       children: [
  //         new Paragraph({ children: [new TextRun({ text: "Scale" })] }),
  //       ],
  //     }),
  //     new TableCell({
  //       children: [
  //         new Paragraph({ children: [new TextRun({ text: "Score" })] }),
  //       ],
  //     }),
  //     new TableCell({
  //       children: [
  //         new Paragraph({ children: [new TextRun({ text: "%tile" })] }),
  //       ],
  //     }),
  //   ],
  // });

  // const dataRowsDocx = dataRows.map((row) => {
  //   const percentile = getPercentileFromScore(row.Score, row.Scale);
  //   return new TableRow({
  //     children: [
  //       new TableCell({
  //         children: [
  //           new Paragraph({
  //             indent: { left: row.depth === 1 ? 720 : 0 },
  //             children: [new TextRun({ text: row.DomSub })],
  //           }),
  //         ],
  //       }),
  //       new TableCell({
  //         children: [
  //           new Paragraph({ children: [new TextRun({ text: row.Scale })] }),
  //         ],
  //       }),
  //       new TableCell({
  //         children: [
  //           new Paragraph({
  //             children: [new TextRun({ text: row.Score.toString() })],
  //           }),
  //         ],
  //       }),
  //       new TableCell({
  //         children: [
  //           new Paragraph({
  //             children: [
  //               new TextRun({ text: percentile ? percentile.toString() : "" }),
  //             ],
  //           }),
  //         ],
  //       }),
  //     ],
  //   });
  // });

  // const table = new Table({
  //   rows: [titleRow, headerRow, ...dataRowsDocx],
  //   width: { size: 100, type: "pct" },
  // });

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
