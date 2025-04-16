import React, { useState, ReactNode } from "react";
import { useTableFormContext } from "@/components/assessments/form-swap-hook/assessments-form-context";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { getPercentileFromScore } from "@/utils/percentile";
import { Progress } from "@/components/ui/progress";
import { DataRow } from "@/types/data-row";
import { convertToVisualPercentage } from "@/types/visual-percentage-shift";

interface DynamicTableProps {
  assessmentName: string;
  measure: string;
  tableTypeId: string;
  initialData?: DataRow[];
  onDataChange?: (data: DataRow[]) => void;
}

function populateData(formData: any): DataRow[] {
  let id = 0;
  const mappedData: DataRow[] = [];
  formData.fields.forEach((field: any) => {
    const isDomain = field.subtests && field.subtests.length > 0;
    mappedData.push({
      id: id++,
      DomSub: field.fieldData.name,
      Scale: field.fieldData.score_type,
      Score: 0,
      depth: isDomain ? 0 : 0,
    });
    if (field.subtests) {
      field.subtests.forEach((subtest: any) => {
        mappedData.push({
          id: id++,
          DomSub: subtest.name,
          Scale: subtest.score_type,
          Score: 0,
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
  initialData = [],
  onDataChange,
}: DynamicTableProps) {
  const { formData } = useTableFormContext();
  const [data, setData] = useState<DataRow[]>(
    initialData && initialData.length > 0 ? initialData : populateData(formData)
  );
  const [editing, setEditing] = useState<{
    rowId: number | null;
    columnKey: string | null;
  }>({ rowId: null, columnKey: null });
  const [tempValue, setTempValue] = useState("");

  const countDomSub = formData.fields
    ? formData.fields.reduce((count: number, field: any) => {
      count += 1;
      if (field.subtests) count += field.subtests.length;
      return count;
    }, 0)
    : 0;

  const handleEdit = (rowId: number, columnKey: string, value: string) => {
    setEditing({ rowId, columnKey });
    setTempValue(value);
  };

  const handleSave = (rowId: number, columnKey: string) => {
    setData((prevData) => {
      const updatedData = prevData.map((row) =>
        row.id === rowId
          ? {
            ...row,
            [columnKey]:
              columnKey === "Score"
                ? Number(Number(tempValue).toFixed(2))
                : tempValue,
          }
          : row
      );
      if (onDataChange) onDataChange(updatedData);
      return updatedData;
    });
    setEditing({ rowId: null, columnKey: null });
  };

  const handleTabNavigation = (
    e: React.KeyboardEvent,
    currentRowId: number
  ) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const currentIndex = data.findIndex((row) => row.id === currentRowId);
      if (currentIndex === -1) {
        console.warn(`Row with id ${currentRowId} not found in data.`);
        return;
      }
      const nextIndex = e.shiftKey
        ? (currentIndex - 1 + data.length) % data.length
        : (currentIndex + 1) % data.length;

      handleSave(currentRowId, "Score");
      handleEdit(data[nextIndex].id, "Score", data[nextIndex].Score.toString());
    }
  };

  const determineTableType = (tableTypeId: string): ReactNode => {
    if (tableTypeId === "3") {
      return (
        <>
          <TableRow>
            <TableHead
              rowSpan={2}
              className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman"
            >
              Measured Area (Assessment)
            </TableHead>
            <TableHead
              rowSpan={2}
              className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman"
            >
              Domain/Subtest
            </TableHead>
            <TableHead
              rowSpan={2}
              className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman"
            >
              Scale
            </TableHead>
            <TableHead
              rowSpan={2}
              className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman"
            >
              Score
            </TableHead>
            <TableHead
              rowSpan={2}
              className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman"
            >
              %ile
            </TableHead>
            <TableHead
              colSpan={4}
              className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman"
            >
              Percentile
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
              Very Low (0-8)
            </TableHead>
            <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
              Low Av. (9-24)
            </TableHead>
            <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
              Average (25-74)
            </TableHead>
            <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
              High Av. (75-100)
            </TableHead>
          </TableRow>
        </>
      );
    } else if (tableTypeId === "2") {
      return (
        <TableRow>
          <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
            Measured Area (Assessment)
          </TableHead>
          <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
            Domain/Subtest
          </TableHead>
          <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
            Scale
          </TableHead>
          <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
            Score
          </TableHead>
          <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
            %ile
          </TableHead>
          <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
            Average
          </TableHead>
          <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
            Elevated
          </TableHead>
          <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
            Clinically Sgnif.
          </TableHead>
        </TableRow>
      );
    }
    return (
      <TableRow>
        <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
          Measured Area (Assessment)
        </TableHead>
        <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
          Domain/Subtest
        </TableHead>
        <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
          Scale
        </TableHead>
        <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
          Score
        </TableHead>
        <TableHead className="bg-gray-300 text-black font-medium text-sm text-center border border-black font-times-new-roman">
          %ile
        </TableHead>
      </TableRow>
    );
  };

  const renderPercentileValue = (row: DataRow): ReactNode => {
    const percentile = getPercentileFromScore(row.Score, row.Scale);
    if (row.Scale !== 'None') {
      return (
        <TableCell className="w-[5%] whitespace-normal break-words border border-black text-center">
          {percentile === 1 ? "<1" : percentile}%
        </TableCell>
      );
    }
    return (
      <TableCell className="w-[5%] whitespace-normal break-words border border-black text-center ">
        
      </TableCell>
    );
  };

  const renderPercentileProgress = (row: DataRow): ReactNode | null => {
    const percentile = getPercentileFromScore(row.Score, row.Scale);
    const visualPercentage = convertToVisualPercentage(percentile || 0);

    if (tableTypeId === "3" && row.Scale !== 'None') {
      return (
        <TableCell
          className="percentile-column border border-black"
          colSpan={4}
        >
          <Progress value={visualPercentage} className="tall-progress-bar" />
        </TableCell>
      );
    } else if (tableTypeId === "2" && row.Scale !== 'None') {
      return (
        <TableCell
          className="percentile-column border border-black"
          colSpan={3}
        >
          <Progress value={visualPercentage} className="tall-progress-bar" />
        </TableCell>
      );
    } else if (tableTypeId === "3" && row.Scale === 'None') {
      return (
        <TableCell
          className="percentile-column border border-black"
          colSpan={4}
        >
        </TableCell>
      );
    }
    return null;
  };

  const renderTableRows = (): ReactNode[] => {
    return data.map((row) => (
      <TableRow key={`row-${row.id}`}>
        <TableCell
          style={{ paddingLeft: row.depth === 1 ? "2rem" : "0" }}
          className={`${row.depth === 0 ? "font-bold" : "font-italic"
            } border border-black`}
        >
          {row.DomSub}
        </TableCell>
        {(
          <TableCell className="border border-black text-center">
            {row.Scale === 'None' ? '' : 
              row.Scale}
          </TableCell>
        )}
        {(
          <TableCell
            className="cursor-pointer border border-black text-center"
            onClick={() => handleEdit(row.id, "Score", row.Score.toString())}
          >
            {row.Scale === 'None' ? '' : 
              editing.rowId === row.id && editing.columnKey === "Score" ? (
                <input
                  type="number"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={() => handleSave(row.id, "Score")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave(row.id, "Score");
                  } else if (e.key === "Tab") {
                    handleTabNavigation(e, row.id);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-[60px] text-center font-serif text-inherit border border-gray-300"
                autoFocus
              />
            ) : (
              row.Score || ""
            )}
          </TableCell>
        )}
        {renderPercentileValue(row)}
        {renderPercentileProgress(row)}
      </TableRow>
    ));
  };

  return (
    <Table>
      <TableHeader>{determineTableType(tableTypeId)}</TableHeader>
      <TableBody>
        <TableRow>
          <TableCell
            rowSpan={countDomSub + 1}
            className="text-center border border-black font-times-new-roman"
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
