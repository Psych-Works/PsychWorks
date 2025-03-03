import React, { useState } from "react";
import { ReactNode } from "react";
import { useTableFormContext } from "@/components/assessments/form-swap-hook/assessments-form-context";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { lookupTable as percentileLookupTable } from "@/types/percentile-lookup-table";
import { Progress } from "@/components/ui/progress";
import { convertToVisualPercentage } from "@/types/visual-percentage-shift";

interface DynamicTableProps {
  assessmentName: string;
  measure: string;
  tableTypeId: string;
}

interface DataRow {
  id: number;
  DomSub: string;
  Scale: string;
  Percentile: number;
  depth: number;
}

function populateData(formData: any) {
  let id = 0;
  const mappedData: DataRow[] = [];

  formData.fields.forEach((field: any) => {
    const isDomain = field.subtests && field.subtests.length > 0;

    // Add domain/standalone field
    mappedData.push({
      id: id++,
      DomSub: field.fieldData.name,
      Scale: field.fieldData.score_type,
      Percentile: 0,
      depth: isDomain ? 0 : 0, // Domain or standalone subtest
    });

    // Add subtests if they exist
    if (field.subtests) {
      field.subtests.forEach((subtest: any) => {
        mappedData.push({
          id: id++,
          DomSub: subtest.name,
          Scale: subtest.score_type,
          Percentile: 0,
          depth: 1,
        });
      });
    }
  });

  return mappedData;
}

function DynamicTable({
  assessmentName,
  measure,
  tableTypeId,
}: DynamicTableProps) {
  const { formData } = useTableFormContext();
  const [data, setData] = useState<DataRow[]>(() => populateData(formData));

  const countDomSub = formData.fields.reduce((count, field) => {
    count += 1; // Count the domain or standalone subtest
    if (field.subtests) {
      count += field.subtests.length; // Count the child subtests
    }
    return count;
  }, 0);

  const [editing, setEditing] = useState<{
    rowId: number | null;
    columnKey: string | null;
  }>({ rowId: null, columnKey: null });
  const [tempValue, setTempValue] = useState("");

  const handleEdit = (rowId: number, columnKey: string, value: string) => {
    setEditing({ rowId, columnKey });
    setTempValue(value);
  };

  const handleSave = (rowId: number, columnKey: string) => {
    setData(
      data.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [columnKey]:
                columnKey === "Percentile"
                  ? Number(Number(tempValue).toFixed(2))
                  : tempValue,
            }
          : row
      )
    );
    setEditing({ rowId: null, columnKey: null });
  };

  const determineTableType = (tableTypeId: string) => {
    if (tableTypeId === "3") {
      return (
        <>
          <TableRow>
            <TableCell
              className="w-[20%] m-0 whitespace-normal break-words text-center border border-black bg-gray-400 "
              colSpan={4}
            >
              Percentile
            </TableCell>
          </TableRow>
          <TableRow>
            {[
              "Very Low\n0-8",
              "Low Av.\n9-24",
              "Average.\n25-74",
              "High Av.\n75-100",
            ].map((text) => (
              <TableCell
                key={text}
                className="w-[5%] m-0 whitespace-pre-line break-words text-center border border-black bg-gray-400 "
              >
                {text}
              </TableCell>
            ))}
          </TableRow>
        </>
      );
    } else if (tableTypeId === "2") {
      return (
        <>
          <TableRow>
            {["Clinically Sgnif.", "Elevated", "Average"].map((text, index) => (
              <TableCell
                key={index}
                className="w-[6.66%] bg-gray-400 text-center border border-black "
                rowSpan={2}
              >
                {text}
              </TableCell>
            ))}
          </TableRow>
        </>
      );
    }
  };

  const getPercentileFromScore = (
    score: number,
    scale: string
  ): number | null => {
    let mean = 0;
    let sd = 0;
    switch (scale) {
      case "T":
        mean = 50;
        sd = 10;
        break;
      case "Z":
        mean = 0;
        sd = 1;
        break;
      case "ScS":
        mean = 10;
        sd = 3;
        break;
      case "StS":
        mean = 100;
        sd = 15;
        break;
    }

    const standardScore = (((score - mean) / sd) * 15 + 100).toFixed(2);
    let numericStandardScore = Number(standardScore);
    numericStandardScore = Math.ceil(numericStandardScore);

    if (numericStandardScore < 40) return 1;
    if (numericStandardScore > 133) return 99;

    return (
      percentileLookupTable.find((row) => row.StS === numericStandardScore)
        ?.percentile ?? null
    );
  };

  const renderPercentileValue = (row: DataRow): ReactNode => {
    const percentile = getPercentileFromScore(row.Percentile, row.Scale);
    return (
      <TableCell className="w-[5%] whitespace-normal break-words">
        {percentile === 1 ? "<1" : percentile}
      </TableCell>
    );
  };

  const renderPercentileProgress = (row: DataRow): ReactNode | null => {
    const percentile = getPercentileFromScore(row.Percentile, row.Scale);

    const visualPercentage = convertToVisualPercentage(percentile ?? 0);
    console.log(visualPercentage);
  
    if (tableTypeId === "3") {
      return (
        <TableCell className="percentile-column" colSpan={4}>
          <Progress
            value={visualPercentage}
          />
        </TableCell>
      );
    } else if (tableTypeId === "2") {
      return (
        <TableCell className="percentile-column" colSpan={3}>
          <Progress
            value={visualPercentage}
          />
        </TableCell>
      );
    }
    return null;
  };

  const renderTableRows = (): ReactNode[] => {
    const rows: ReactNode[] = [];

    data.forEach((row: DataRow) => {
      rows.push(
        <TableRow key={`row-${row.id}`}>
          <TableCell
            className={`${row.depth === 1 ? "pl-8" : ""} ${
              row.depth === 0 ? "font-bold" : "font-italic"
            }`}
          >
            {row.DomSub}
          </TableCell>
          <TableCell
            className="cursor-pointer"
            onClick={() =>
              handleEdit(row.id, "Percentile", row.Percentile.toString())
            }
          >
            {row.Scale}:
            {editing.rowId === row.id && editing.columnKey === "Percentile" ? (
              <input
                type="number"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => handleSave(row.id, "Percentile")}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSave(row.id, "Percentile")
                }
                onClick={(e) => e.stopPropagation()}
                className="max-w-[60px] text-center font-serif text-inherit border border-gray-300"
                autoFocus
              />
            ) : (
              row.Percentile || ""
            )}
          </TableCell>
          {renderPercentileValue(row)}
          {renderPercentileProgress(row)}
        </TableRow>
      );
    });

    return rows;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="w-[15%] whitespace-normal break-words bg-gray-400 text-black font-medium text-sm text-center border border-black font-times-new-roman"
            rowSpan={3}
          >
            Measured Area (Assessment)
          </TableHead>
          <TableHead
            className="w-[15%] whitespace-normal break-words bg-gray-400 text-black font-medium text-sm text-center border border-black font-times-new-roman"
            rowSpan={3}
          >
            Domain/Subtest
          </TableHead>
          <TableHead
            className="w-[8%] whitespace-normal break-words bg-gray-400 text-black font-medium text-sm text-center border border-black font-times-new-roman"
            rowSpan={3}
          >
            Scale
          </TableHead>
          <TableHead
            className="bg-gray-400 text-black font-medium text-sm text-center border border-black font-times-new-roman"
            rowSpan={3}
          >
            %tile
          </TableHead>
        </TableRow>
        {determineTableType(tableTypeId)}
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell
            className="text-center border border-black font-times-new-roman"
            rowSpan={countDomSub + 1}
          >
            {assessmentName} ({measure})
          </TableCell>
        </TableRow>
        {renderTableRows()}
      </TableBody>
    </Table>
  );
}

export default DynamicTable;
