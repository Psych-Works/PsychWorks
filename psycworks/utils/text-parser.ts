// utils/text-parser.ts

// Define types for assessment scores
export type ScoreValue = {
  score: number;
  percentile: number;
  scale: string; // The scale type (T, Z, ScS, StS, etc.)
};

export type AssessmentScores = {
  [key: string]: ScoreValue;
};

/**
 * Returns the correct ordinal suffix for a number as superscript text
 */
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'ˢᵗ';
  if (j === 2 && k !== 12) return 'ⁿᵈ';
  if (j === 3 && k !== 13) return 'ʳᵈ';
  return 'ᵗʰ';
}

/**
 * Parse text containing placeholders and replace them with assessment values
 * Examples:
 * - [[field_name]] -> score value with scale type prefix (e.g., "StS: 100")
 * - [[field_name:percentile]] -> percentile value with ordinal suffix
 * - [[field_name:avg]] -> description based on percentile
 */
export function parseAdvancedText(text: string, scores: AssessmentScores): string {
  if (!text) return "";

  return text.replace(/\[\[([^\]:]*)(?:[:\.])?([^\]]*)\]\]/g, (match, fieldName, property) => {
    // Get the normalized versions of the field name for better matching
    const normalizedFieldName = fieldName.trim().toLowerCase().replace(/\s+/g, '_');

    // Find the score value from any available format
    let scoreValue: ScoreValue | undefined;

    // Try direct match with original case
    if (scores[fieldName]) {
      scoreValue = scores[fieldName];
    }
    // Try normalized version (lowercase with underscores)
    else if (scores[normalizedFieldName]) {
      scoreValue = scores[normalizedFieldName];
    }
    // Try case-insensitive match
    else {
      const key = Object.keys(scores).find(k => k.toLowerCase() === fieldName.toLowerCase());
      if (key) scoreValue = scores[key];
    }

    // If no match found, return the original placeholder
    if (!scoreValue) return match;

    // If no property specified (just [[field_name]]), return the score with its scale type
    if (!property) {
      const scalePrefix = getScalePrefix(scoreValue.scale);
      return `${scalePrefix}${scoreValue.score}`;
    }

    // Handle different property types
    switch (property.trim().toLowerCase()) {
      case "avg":
        return getAverageDescription(scoreValue.percentile);
      case "%":
      case "percentile":
        // Return percentile with proper ordinal suffix
        return `${scoreValue.percentile}${getOrdinalSuffix(scoreValue.percentile)} percentile`;
      default:
        if (property in scoreValue) {
          return scoreValue[property as keyof ScoreValue].toString();
        }
        return match;
    }
  });
}

/**
 * Returns the appropriate prefix for a scale type
 */
function getScalePrefix(scale: string): string {
  switch (scale) {
    case 'T':
      return 'T-Score: ';
    case 'Z':
      return 'Z-Score: ';
    case 'ScS':
      return 'ScS: ';
    case 'StS':
      return 'StS: ';
    default:
      return '';
  }
}

/**
 * Returns a description based on percentile score
 */
function getAverageDescription(percentile: number): string {
  if (percentile >= 98) return "Extremely High";
  if (percentile >= 91) return "Very High";
  if (percentile >= 75) return "High Average";
  if (percentile >= 25) return "Average";
  if (percentile >= 9) return "Low Average";
  if (percentile >= 3) return "Very Low";
  return "Extremely Low";
}
