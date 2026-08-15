/**
 * Farm Record Analyzer Service
 * Handles document validation, OCR simulation, and field extraction
 * from government land records (PDF, JPG, JPEG, PNG)
 */

export type FarmRecord = {
  ownerName: string | null;
  farmName: string | null;
  surveyNumber: string | null;
  subSurveyNumber: string | null;
  village: string | null;
  taluk: string | null;
  district: string | null;
  state: string | null;
  area: string | null;
  areaUnit: string | null;
  landClassification: string | null;
  crop: string | null;
  ownership: string | null;
  landUseInfo: string | null;
  documentType: string;
  extractionConfidence: number;
  sourceDocument: string;
  extractedAt: string;
};

export type AnalysisResult = {
  success: boolean;
  record: FarmRecord | null;
  errors: string[];
  warnings: string[];
};

// Supported MIME types
const SUPPORTED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

// Keywords indicating a document is a land record
const LAND_RECORD_KEYWORDS = [
  'survey',
  'revenue',
  'land',
  'taluk',
  'district',
  'village',
  'area',
  'field',
  'plot',
  'record',
  'government',
  'land record',
  'mutakhta',
  'landbooklet',
  'patta',
  'chitta',
];

/**
 * Validate that the uploaded file appears to be a land record
 */
export async function validateLandRecord(file: File): Promise<{ valid: boolean; error: string | null }> {
  // Check file size
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  // Check MIME type
  const mimeType = file.type.toLowerCase();
  if (!SUPPORTED_MIME_TYPES.includes(mimeType)) {
    return { valid: false, error: `Unsupported file type: ${file.type}. Supported: PDF, PNG, JPG, JPEG` };
  }

  // For images, try basic validation
  if (mimeType.startsWith('image/')) {
    try {
      await validateImageFile(file);
    } catch (error) {
      return { valid: false, error: 'Invalid or corrupted image file' };
    }
  }

  return { valid: true, error: null };
}

/**
 * Validate image file integrity
 */
async function validateImageFile(file: File): Promise<void> {
  const buffer = await file.arrayBuffer();
  const view = new Uint8Array(buffer);

  // Check for image magic numbers
  const png = [0x89, 0x50, 0x4e, 0x47]; // PNG
  const jpeg = [0xff, 0xd8, 0xff]; // JPEG

  const matches =
    png.every((byte, i) => view[i] === byte) || jpeg.every((byte, i) => view[i] === byte);

  if (!matches) {
    throw new Error('Invalid image format');
  }
}

/**
 * Simulate OCR extraction from land record document
 * In production, this would call a real OCR service like Tesseract, AWS Textract, or Google Vision
 */
async function extractTextFromDocument(file: File): Promise<string> {
  // Simulate OCR processing with a delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real implementation, this would:
  // 1. Send file to OCR service (Tesseract, Textract, Vision API)
  // 2. Get back extracted text with confidence scores
  // 3. Handle different document formats and languages

  // For now, return simulated text based on file name to support testing
  const simulatedTexts: Record<string, string> = {
    'land_record.pdf':
      'Government Land Record Survey Number SR-104/12 Village Bharuch Taluk Bharuch District Bharuch State Gujarat Owner Name Ramesh Patel Area 24 acres Land Classification Dryland Crop Groundnut',
    'farm_survey.pdf':
      'Survey Number MB-221/9 Village Sangli Taluk Sangli District Sangli State Maharashtra Owner Anil Sharma Area 18 acres Classification Irrigated Crop Sugarcane',
    'land_document.pdf':
      'Land Record Sub-Survey 45-A Village Nashik Taluk Nashik District Nashik State Maharashtra Farmer Name Vikram Singh Area 12 acres Classification Mixed Crop Wheat Sugarcane',
  };

  const fileName = file.name.toLowerCase();
  for (const [key, text] of Object.entries(simulatedTexts)) {
    if (fileName.includes(key.replace('.pdf', ''))) {
      return text;
    }
  }

  // Default simulated extraction
  return `Government Land Record
         Survey Number: SR-104/12
         Village: Village Name
         Taluk: Taluk Name
         District: District Name
         State: State Name
         Owner Name: Farm Owner
         Area: 20 acres
         Land Classification: Agricultural
         Crop: Cereals`;
}

/**
 * Extract structured fields from OCR text
 */
function parseExtractedText(text: string): Partial<FarmRecord> {
  const lowerText = text.toLowerCase();

  // Helper function to extract value after a keyword
  const extractAfter = (keyword: string, maxWords: number = 2): string | null => {
    const regex = new RegExp(`${keyword}[:\\s]+([\\w\\s\\-/.,]+?)(?=[a-z]+[:\\s]|$)`, 'i');
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1]
        .trim()
        .split(/\s+/)
        .slice(0, maxWords)
        .join(' ')
        .replace(/[^\w\s\-/.,]/g, '')
        .trim();
    }
    return null;
  };

  // Confidence is higher if more keywords are found
  const foundKeywords = LAND_RECORD_KEYWORDS.filter((kw) => lowerText.includes(kw)).length;
  const confidence = Math.min(100, 60 + foundKeywords * 5);

  return {
    ownerName: extractAfter('owner name|farmer|proprietor', 3),
    farmName: extractAfter('farm name|name of farm', 3),
    surveyNumber: extractAfter('survey number|survey no|sr|plot no', 2),
    subSurveyNumber: extractAfter('sub.?survey|sub.?plot', 2),
    village: extractAfter('village|gram', 2),
    taluk: extractAfter('taluk|tehsil|tahsil', 2),
    district: extractAfter('district|dist', 2),
    state: extractAfter('state', 1),
    area: extractAfter('area|extent', 1),
    areaUnit: /acres?|hectares?|sqft|sq\s*ft|square\s*feet|ha/.exec(text)?.[0] || 'acres',
    landClassification: extractAfter('classification|class', 2),
    crop: extractAfter('crop|crops', 2),
    ownership: extractAfter('ownership|owner.?ship|tenancy', 2),
    landUseInfo: extractAfter('use|land.?use', 2),
    documentType: 'Government Land Record',
    extractionConfidence: confidence,
  };
}

/**
 * Validate extracted fields
 */
function validateExtractedFields(record: Partial<FarmRecord>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const requiredFields = ['ownerName', 'village', 'taluk', 'district', 'state', 'area'];

  requiredFields.forEach((field) => {
    if (!record[field as keyof FarmRecord]) {
      errors.push(`Field "${field}" could not be reliably extracted. Please review and correct.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Analyze an uploaded farm record document
 */
export async function analyzeFarmRecord(file: File): Promise<AnalysisResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Step 1: Validate document
    const validation = await validateLandRecord(file);
    if (!validation.valid) {
      return {
        success: false,
        record: null,
        errors: [validation.error || 'Document validation failed'],
        warnings: [],
      };
    }

    // Step 2: Check if document appears to be a land record
    const text = await extractTextFromDocument(file);
    const lowerText = text.toLowerCase();

    const relevantKeywordCount = LAND_RECORD_KEYWORDS.filter((kw) => lowerText.includes(kw)).length;
    if (relevantKeywordCount < 3) {
      return {
        success: false,
        record: null,
        errors: [
          'This document does not appear to be a land record.',
          'Please upload a valid government land record document.',
        ],
        warnings: [],
      };
    }

    // Step 3: Extract fields
    const extracted = parseExtractedText(text);

    // Step 4: Validate extracted fields
    const fieldValidation = validateExtractedFields(extracted);
    if (!fieldValidation.valid) {
      warnings.push(...fieldValidation.errors);
    }

    // Build final record
    const record: FarmRecord = {
      ownerName: extracted.ownerName || null,
      farmName: extracted.farmName || null,
      surveyNumber: extracted.surveyNumber || null,
      subSurveyNumber: extracted.subSurveyNumber || null,
      village: extracted.village || null,
      taluk: extracted.taluk || null,
      district: extracted.district || null,
      state: extracted.state || null,
      area: extracted.area || null,
      areaUnit: extracted.areaUnit || 'acres',
      landClassification: extracted.landClassification || null,
      crop: extracted.crop || null,
      ownership: extracted.ownership || null,
      landUseInfo: extracted.landUseInfo || null,
      documentType: extracted.documentType || 'Government Land Record',
      extractionConfidence: extracted.extractionConfidence || 65,
      sourceDocument: file.name,
      extractedAt: new Date().toISOString(),
    };

    return {
      success: true,
      record,
      errors,
      warnings: warnings.length > 0 ? warnings : [],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during analysis';
    return {
      success: false,
      record: null,
      errors: [errorMessage],
      warnings: [],
    };
  }
}

/**
 * Get confidence level as a percentage string
 */
export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 90) return '✓ High confidence';
  if (confidence >= 75) return '~ Medium confidence';
  return '⚠ Low confidence';
}

/**
 * Check if a field needs manual review
 */
export function fieldNeedsReview(value: string | null | undefined): boolean {
  return !value || value === 'Not detected';
}
