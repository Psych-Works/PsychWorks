// utils/text-parser.ts

// Define types for assessment scores
export type ScoreValue = {
  score: number;
  percentile: number;
};

export type AssessmentScores = {
  [key: string]: ScoreValue;
};

/**
 * Parse text containing placeholders and replace them with assessment values
 * Examples:
 * - [[field_name]] -> score value
 * - [[field_name:percentile]] -> percentile value with % sign
 * - [[field_name:average]] -> description based on percentile
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
    
    // If no property specified (just [[field_name]]), return the score
    if (!property) {
      return scoreValue.score.toString();
    }
    
    // Handle different property types
    switch (property.trim().toLowerCase()) {
      case "interpretation":
      case "interpret":
      case "average":
      case "avg":
        return getAverageDescription(scoreValue.percentile);
      
      case "percentile":
      case "percent":
      case "%":
      case "%tile":
        // Format with the percentage sign
        return `${scoreValue.percentile}%`;
      
      // If property exists directly on the score object
      default:
        if (property in scoreValue) {
          return scoreValue[property as keyof ScoreValue].toString();
        }
        return match;
    }
  });
}

/**
 * Returns a description based on percentile score
 */
function getAverageDescription(percentile: number): string {
  if (percentile >= 84) return "significantly above average";
  if (percentile >= 66) return "above average";
  if (percentile >= 35) return "average";
  if (percentile >= 17) return "below average";
  return "significantly below average";
}
