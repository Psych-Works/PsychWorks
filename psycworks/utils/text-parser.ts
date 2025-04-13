// utils/text-parser.ts

// Define types for assessment scores
export type ScoreValue = {
  score: number;
  percentile: number;
  // Other properties as needed
};

export type AssessmentScores = {
  [key: string]: ScoreValue;
};

/**
 * Main function to parse all kinds of placeholders in text
 */
export function parseAdvancedText(text: string, scores: AssessmentScores): string {
  if (!text) return "";
  
  // First handle property placeholders [[field:property]] or [[field.property]]
  let processedText = text.replace(/\[\[([^\]:]*)(?:[:\.])?([^\]]*)\]\]/g, (match, fieldName, property) => {
    // If no property specified, just return the score
    if (!property) {
      return replaceScoreValue(fieldName, scores);
    }
    
    // Handle property-specific replacements
    return replacePropertyValue(fieldName, property, scores);
  });
  
  return processedText;
}

/**
 * Helper to replace a score value
 */
function replaceScoreValue(fieldName: string, scores: AssessmentScores): string {
  // Special case for "ex" field that seems to be causing issues
  if (fieldName === "ex") {
    // Look through all keys for any case of "ex"
    for (const key of Object.keys(scores)) {
      if (key.toLowerCase() === "ex") {
        return scores[key].score.toString();
      }
    }
  }

  // Try direct match
  if (scores[fieldName]) {
    return scores[fieldName].score.toString();
  }
  
  // Try normalized version (lowercase with underscores)
  const normalizedFieldName = fieldName.trim().toLowerCase().replace(/\s+/g, '_');
  if (scores[normalizedFieldName]) {
    return scores[normalizedFieldName].score.toString();
  }
  
  // Try finding a case-insensitive match
  const caseInsensitiveMatch = Object.keys(scores).find(
    key => key.toLowerCase() === fieldName.toLowerCase()
  );
  
  if (caseInsensitiveMatch) {
    return scores[caseInsensitiveMatch].score.toString();
  }
  
  return `[[${fieldName}]]`; // Return original placeholder if not found
}

/**
 * Helper to replace a property value
 */
function replacePropertyValue(fieldName: string, property: string, scores: AssessmentScores): string {
  property = property.trim();
  
  // Handle common property types
  if (property === "interpretation" || property === "interpret") {
    const scoreValue = findScoreValue(fieldName, scores);
    if (scoreValue) {
      return getInterpretation(scoreValue.percentile);
    }
  } else {
    const scoreValue = findScoreValue(fieldName, scores);
    if (scoreValue && property in scoreValue) {
      return scoreValue[property as keyof ScoreValue].toString();
    }
  }
  
  return `[[${fieldName}]]`; // Return just the field placeholder if property not found
}

/**
 * Helper to find a score value with flexible matching
 */
function findScoreValue(fieldName: string, scores: AssessmentScores): ScoreValue | null {
  // Special case for "ex" field that seems to be causing issues
  if (fieldName === "ex") {
    // Look through all keys for any case of "ex"
    for (const key of Object.keys(scores)) {
      if (key.toLowerCase() === "ex") {
        return scores[key];
      }
    }
  }
  
  // Try direct match
  if (scores[fieldName]) {
    return scores[fieldName];
  }
  
  // Try normalized version
  const normalizedFieldName = fieldName.trim().toLowerCase().replace(/\s+/g, '_');
  if (scores[normalizedFieldName]) {
    return scores[normalizedFieldName];
  }
  
  // Try case-insensitive match
  const caseInsensitiveMatch = Object.keys(scores).find(
    key => key.toLowerCase() === fieldName.toLowerCase()
  );
  
  if (caseInsensitiveMatch) {
    return scores[caseInsensitiveMatch];
  }
  
  return null;
}

/**
 * Returns interpretation text based on percentile scores
 */
function getInterpretation(percentile: number): string {
  if (percentile <= 8) return "very low";
  if (percentile <= 24) return "low average";
  if (percentile <= 74) return "average";
  return "high average";
}
