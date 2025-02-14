import React, { useState } from 'react';
import { useTableFormContext } from '../form-swap-hook/assessments-form-context';
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from '@/components/ui/table';
import { lookupTable as percentileLookupTable } from '@/types/percentile-lookup-table';
import { Progress } from '@/components/ui/progress';
import './table-styling.css';

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
}

function populateData(formData: any) {
  let id = 0;
  const mappedData: DataRow[] = [];
  
  formData.fields.forEach((field: any) => {
    // Add domain/standalone field
    mappedData.push({
      id: id++,
      DomSub: field.fieldData.name,
      Scale: field.fieldData.score_type,
      Percentile: 0,
    });

    // Add subtests if they exist
    if (field.subtests) {
      field.subtests.forEach((subtest: any) => {
        mappedData.push({
          id: id++,
          DomSub: subtest.name,
          Scale: subtest.score_type,
          Percentile: 0,
        });
      });
    }
  });

  return mappedData;
}

function DynamicTable({ assessmentName, measure, tableTypeId }: DynamicTableProps) {
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
    setData(data.map(row => 
      row.id === rowId ? { ...row, [columnKey]: columnKey === "Percentile" ? Number(tempValue) : tempValue } : row
    ));
    setEditing({ rowId: null, columnKey: null });
  };

  const determineTableType = (tableTypeId: string) => {
    if (tableTypeId === '2') {
      return (
        <>
          <TableHead className="table-header-gray">
            <TableRow>
              <TableCell className="calculated-percentile-column"
              colSpan={4}>
                Behavioral Rating Scale
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="calculated-percentile-column">
                Very Low
                0-8
              </TableCell>
              <TableCell className="calculated-percentile-column">
                Low Av.
                9-24
              </TableCell>
              <TableCell className="calculated-percentile-column">
                Average.
                25-74
              </TableCell>
              <TableCell className="calculated-percentile-column">
                High Av.
                75-100
              </TableCell>
            </TableRow>
          </TableHead>
        </>
      )
    } else if (tableTypeId === '3') {
      return (
        <TableHead className="table-header-gray">
          <TableRow>
            <TableCell className="cognitive-percentile-column"
            colSpan={3}>
              Percentile
            </TableCell>
            <TableCell className="cognitive-percentile-column">
              Percentile
            </TableCell>
            <TableCell className="cognitive-percentile-column">
              Percentile
            </TableCell>
          </TableRow>
        </TableHead>
      )
    }
  };

  const getPercentileFromScore = (score: number, scale: string): number | null => {
    let mean = 0;
    let sd = 0;
    switch (scale) {
      case 'T':
        mean = 50;
        sd = 10;
        break;
      case 'Z':
        mean = 0;
        sd = 1;
        break;
      case 'ScS':
        mean = 10;
        sd = 3;
        break;
      case 'StS':
        mean = 100;
        sd = 15;
        break;
    }
    
    const standardScore = ((((score - mean) / sd) * 15) + 100).toFixed(2);
    const numericStandardScore = Number(standardScore);

    if (numericStandardScore < 40) return 1;
    if (numericStandardScore > 133) return 99;

    return percentileLookupTable.find(row => row.StS === numericStandardScore)?.percentile ?? null;
  };

  const renderPercentileValue = (row: DataRow): JSX.Element => {
    const percentile = getPercentileFromScore(row.Percentile, row.Scale);
    return (
      <TableCell className="percentile-column">
        {percentile === 1 ? '<1' : percentile}
      </TableCell>
    );
  };

  const renderPercentileProgress = (row: DataRow): JSX.Element | null => {
    if (tableTypeId === '2' || tableTypeId === '3') {
      return (
        <TableCell className="percentile-column">
          <Progress value={row.Percentile} />
        </TableCell>
      );
    }
    return null;
  };

  const renderTableRows = (): JSX.Element[] => {
    const rows: JSX.Element[] = [];

    data.forEach((row: DataRow) => {
      rows.push(
        <TableRow key={`row-${row.id}`}>
          <TableCell className={row.DomSub.includes('domain') ? 'font-bold' : 'font-italic'}>
            {row.DomSub}
          </TableCell>
          <TableCell
            className="cursor-pointer"
            onClick={() => handleEdit(row.id, "Percentile", row.Percentile.toString())}
          >
            {row.Scale}:
            {editing.rowId === row.id && editing.columnKey === "Percentile" ? (
              <input
                type="number"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => handleSave(row.id, "Percentile")}
                onKeyDown={(e) => e.key === "Enter" && handleSave(row.id, "Percentile")}
                onClick={(e) => e.stopPropagation()}
                className="table-input"
                autoFocus
              />
            ) : (
              row.Percentile || ''
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
        <TableRow className="table-header-gray">
          <TableHead className="measured-area-column" rowSpan={2}>Measured Area (Assessment)</TableHead>
          <TableHead className="domsub-column" rowSpan={2}>Domain/Subtest</TableHead>
          <TableHead className="scale-column" rowSpan={2}>Scale</TableHead>
          <TableHead rowSpan={2}>%tile</TableHead>
          {determineTableType(tableTypeId)}
        </TableRow>
      </TableHeader>

      <TableBody className="table-body-gray">
        <TableRow>
          <TableCell className="text-center" rowSpan={countDomSub + 1}> {assessmentName} ({measure})</TableCell>
        </TableRow>
        {renderTableRows()}
      </TableBody>  
    </Table>
  );
}

export default DynamicTable;