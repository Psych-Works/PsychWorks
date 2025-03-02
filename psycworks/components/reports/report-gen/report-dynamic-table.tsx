import { Table, TableRow, TableCell, Paragraph, TextRun } from "docx";
import { InputData } from "@/types/table-input-data";

interface ReportDynamicTableProps {
  assessmentName: string;
  measure: string;
  tableTypeId: string;
  inputData: InputData;
}
const populateDataForDocx = (formData: InputData) => {
  let id = 0;
  const rows: {
    id: number;
    DomSub: string;
    Scale: string;
    Percentile: string;
    depth: number;
  }[] = [];

  formData.fields.forEach((field) => {
    rows.push({
      id: id++,
      DomSub: field.fieldData.name,
      Scale: field.fieldData.score_type || "N/A",
      Percentile: "",
      depth: 0,
    });
    if (field.subtests && field.subtests.length > 0) {
      field.subtests.forEach((subtest) => {
        rows.push({
          id: id++,
          DomSub: subtest.name,
          Scale: subtest.score_type || "N/A",
          Percentile: "",
          depth: 1,
        });
      });
    }
  });
  return rows;
};

export const ReportDynamicTable = ({
  assessmentName,
  measure,
  tableTypeId,
  inputData,
}: ReportDynamicTableProps) => {
  const rowsData = populateDataForDocx(inputData);

  const titleRow = new TableRow({
    children: [
      new TableCell({
        columnSpan: 3,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${assessmentName} (${measure})`,
                bold: true,
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const headerRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Domain/Subtest" })],
          }),
        ],
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Scale" })],
          }),
        ],
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: "%tile" })],
          }),
        ],
      }),
    ],
  });

  const dataRows = rowsData.map(
    (row) =>
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                indent: { left: row.depth === 1 ? 720 : 0 },
                children: [new TextRun({ text: row.DomSub })],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: row.Scale })],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: row.Percentile })],
              }),
            ],
          }),
        ],
      })
  );

  return new Table({
    rows: [titleRow, headerRow, ...dataRows],
    width: {
      size: 100,
      type: "pct",
    },
  });
};

export default ReportDynamicTable;
