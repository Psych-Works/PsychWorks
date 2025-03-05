import { lookupTable } from "@/types/percentile-lookup-table";

export function getPercentileFromScore(
  score: number,
  scale: string
): number | null {
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
    default:
      return null;
  }
  const standardScore = ((score - mean) / sd) * 15 + 100;
  const roundedStandardScore = Math.round(standardScore);
  if (roundedStandardScore <= 40) return 1;
  if (roundedStandardScore >= 133) return 99;
  const percentile = lookupTable.find(
    (row) => row.StS === roundedStandardScore
  )?.percentile;
  return percentile ?? null;
}
