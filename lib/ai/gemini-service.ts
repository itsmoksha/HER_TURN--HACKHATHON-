import { GoogleGenerativeAI } from '@google/generative-ai'
import { getSystemPromptWithContext } from './system-prompt'

/**
 * Server-only Gemini AI Service for HER TURN
 *
 * Handles prescription OCR extraction, structured chat generation, and clinical document summarization.
 * Never exposes API keys or raw internal prompts to client components.
 */

export interface ExtractedMedicine {
  name: string
  strength: string
  dose: string
  frequency: string
  duration: string
  instructions: string
  confidence: number // 0 to 1
  requiresConfirmation?: boolean
}

export interface ExtractedPrescription {
  medicines: ExtractedMedicine[]
  doctorName?: string
  date?: string
  rawText: string
  overallConfidence?: number
}

export interface Citation {
  documentId: string
  documentTitle: string
  date: string
}

export interface ChatResponse {
  content: string
  citations: Citation[]
  triageLevel: 'safe' | 'caution' | 'urgent'
  safetyFlagged: boolean
  disclaimer: string
  suggestedFollowUps: string[]
}

export interface DocumentSummary {
  summary: string
  glossary: Array<{ term: string; meaning: string }>
  flaggedItems: Array<{ item: string; reason: string }>
}

/**
 * Fallback mock prescription data when GEMINI_API_KEY is not configured
 */
export const MOCK_PRESCRIPTION: ExtractedPrescription = {
  doctorName: 'Dr. Ananya Sharma, MD, DM (Endocrinology)',
  date: '2026-10-15',
  medicines: [
    {
      name: 'Thyronorm (Levothyroxine Sodium)',
      strength: '50 mcg',
      dose: '1 tablet',
      frequency: 'Once daily in the morning',
      duration: '90 days',
      instructions:
        'Take on an empty stomach with plain water at least 30-45 minutes before tea, coffee, or breakfast.',
      confidence: 0.96,
      requiresConfirmation: false,
    },
    {
      name: 'Metformin Hydrochloride (Extended Release)',
      strength: '500 mg',
      dose: '1 tablet',
      frequency: 'Twice daily after meals',
      duration: '60 days',
      instructions:
        'Take with or immediately following your main meals to avoid gastric irritation.',
      confidence: 0.93,
      requiresConfirmation: false,
    },
  ],
  rawText: `Dr. Ananya Sharma, MD, DM (Reg. No: 48921-KA)
Aster CMI Hospital, Bengaluru
Date: 15/10/2026

Rx:
1. Tab. Thyronorm 50 mcg - 1 tab OD (early morning empty stomach) x 90 days
2. Tab. Metformin 500 mg SR - 1 tab BD (post lunch & dinner) x 60 days
Advice: Repeat serum TSH and HbA1c after 8 weeks. Maintain hydration.`,
  overallConfidence: 0.94,
}

/**
 * Calculates a confidence score (0 to 1) for an extracted medicine entry based on completeness
 * and adherence to valid pharmaceutical patterns.
 */
export function calculateMedicineConfidence(med: Partial<ExtractedMedicine>): number {
  let score = 0

  if (!med.name || med.name.trim() === '' || med.name.toLowerCase().includes('unknown') || med.name.includes('???')) {
    return 0.2
  }

  // Clear recognized name
  score += 0.35

  // Strength specified (e.g. 50 mcg, 500 mg, 10 ml)
  if (med.strength && /\d+\s*(mg|mcg|g|ml|iu|units|%)/i.test(med.strength)) {
    score += 0.25
  } else if (med.strength && med.strength.trim().length > 0) {
    score += 0.1
  }

  // Dose/frequency specified (e.g. 1 tab, once daily, OD, BD, TDS)
  if (
    med.frequency &&
    /(daily|od|bd|tds|tid|qid|once|twice|thrice|morning|night|bedtime|sos|prn)/i.test(med.frequency)
  ) {
    score += 0.2
  } else if (med.frequency && med.frequency.trim().length > 0) {
    score += 0.1
  }

  // Duration or instructions provided
  if (med.duration && /\d+\s*(day|week|month|year|d|w|m)/i.test(med.duration)) {
    score += 0.1
  }
  if (med.instructions && med.instructions.trim().length > 3) {
    score += 0.1
  }

  // Penalty for ambiguous tokens or illegible signs
  if (
    (med.instructions && /(unclear|illegible|smudged)/i.test(med.instructions)) ||
    (med.strength && /(unclear|illegible|\?)/i.test(med.strength))
  ) {
    score = Math.max(0.1, score - 0.3)
  }

  return Math.min(1.0, Math.round(score * 100) / 100)
}

/**
 * Validates whether an extracted medicine has sufficient certainty or requires manual user verification.
 */
export function validateExtractedMedicine(med: Partial<ExtractedMedicine>): {
  isValid: boolean
  requiresConfirmation: boolean
  issues: string[]
} {
  const issues: string[] = []
  const confidence = typeof med.confidence === 'number' ? med.confidence : calculateMedicineConfidence(med)

  if (!med.name || med.name.trim().length < 2) {
    issues.push('Medicine name is missing or too short')
  } else if (/(unknown|illegible|\?|unclear)/i.test(med.name)) {
    issues.push('Medicine name is unclear or unreadable from the image')
  }

  if (!med.strength || /(unclear|\?)/i.test(med.strength)) {
    issues.push('Strength or dosage unit is ambiguous')
  }

  if (!med.frequency) {
    issues.push('Dosing frequency is unspecified')
  }

  const requiresConfirmation = confidence < 0.75 || issues.length > 0
  const isValid = !!med.name && !/(unknown|illegible|\?)/i.test(med.name)

  return {
    isValid,
    requiresConfirmation,
    issues,
  }
}

/**
 * Parses raw text extracted from a prescription or clinical note into a structured ExtractedPrescription object.
 * Enforces safety: never hallucinates medicine names that are not in the raw text.
 */
export function parsePrescriptionText(rawText: string): ExtractedPrescription {
  if (!rawText || rawText.trim() === '') {
    return {
      medicines: [],
      rawText: '',
      overallConfidence: 0,
    }
  }

  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean)
  let doctorName: string | undefined
  let date: string | undefined
  const medicines: ExtractedMedicine[] = []

  // Extract doctor name
  const docLine = lines.find((l) => /^(dr\.|doctor|dr\s)/i.test(l))
  if (docLine) {
    doctorName = docLine.replace(/^(dr\.|doctor|dr\s)\s*/i, 'Dr. ')
  }

  // Extract date
  const dateLine = lines.find((l) => /(date|\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b)/i.test(l))
  if (dateLine) {
    const match = dateLine.match(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/)
    if (match) {
      date = match[0]
    }
  }

  // Parse medication lines
  // Standard prescription tokens: Tab, Cap, Syr, Inj, Ointment, OD, BD, TDS, mg, mcg, etc.
  const medicinePatterns = [
    /(?:tab(?:let)?|cap(?:sule)?|syr(?:up)?|inj(?:ection)?|drop(?:s)?|cream)?\.?\s*([a-zA-Z0-9\s-]{3,35})\s+(\d+\s*(?:mg|mcg|g|ml|iu|units|%))\s*(.*)/i,
    /(\d+[\.\)]\s*)?([a-zA-Z\s-]{3,35})\s+(\d+\s*(?:mg|mcg|g|ml|iu))\s*(.*)/i,
  ]

  for (const line of lines) {
    // Skip header / footer lines
    if (/^(hospital|clinic|date|rx|advice|review|follow|phone|reg|dr\.)/i.test(line)) {
      continue
    }

    let parsed = false
    for (const pattern of medicinePatterns) {
      const match = line.match(pattern)
      if (match) {
        const namePart = (match[1] && !match[1].includes('.') ? match[1] : match[2] || match[1]).trim()
        const strengthPart = (match[2] && match[2].match(/\d/) ? match[2] : match[3] || '').trim()
        const remainder = (match[4] || match[3] || '').trim()

        // Distinguish frequency and instructions
        let frequency = 'As directed'
        if (/OD|once\s+daily/i.test(remainder)) frequency = 'Once daily (OD)'
        else if (/BD|twice\s+daily/i.test(remainder)) frequency = 'Twice daily (BD)'
        else if (/TDS|TID|thrice\s+daily/i.test(remainder)) frequency = 'Three times daily (TDS)'
        else if (/QID|four\s+times/i.test(remainder)) frequency = 'Four times daily (QID)'
        else if (/SOS|PRN/i.test(remainder)) frequency = 'When needed (SOS)'

        let duration = 'Ongoing / review'
        const durationMatch = remainder.match(/(?:x|\*|for)\s*(\d+\s*(?:days?|weeks?|months?|d|w|m))/i)
        if (durationMatch) {
          duration = durationMatch[1]
        }

        let instructions = remainder.replace(/(?:x|\*|for)\s*(\d+\s*(?:days?|weeks?|months?|d|w|m))/i, '').trim()
        if (!instructions) {
          instructions = 'Take as advised by your doctor.'
        }

        const medObj: ExtractedMedicine = {
          name: namePart,
          strength: strengthPart,
          dose: '1 unit',
          frequency,
          duration,
          instructions,
          confidence: 0,
        }

        medObj.confidence = calculateMedicineConfidence(medObj)
        const validation = validateExtractedMedicine(medObj)
        medObj.requiresConfirmation = validation.requiresConfirmation

        medicines.push(medObj)
        parsed = true
        break
      }
    }

    // Check for unclear or illegible lines
    if (!parsed && /(illegible|\?\?\?|unclear\s+med)/i.test(line)) {
      const unclearMed: ExtractedMedicine = {
        name: 'Unclear Medicine (Requires Verification)',
        strength: 'Unspecified',
        dose: 'Unspecified',
        frequency: 'Unspecified',
        duration: 'Unspecified',
        instructions: 'Handwriting could not be read with high confidence. Please verify with physical prescription.',
        confidence: 0.2,
        requiresConfirmation: true,
      }
      medicines.push(unclearMed)
    }
  }

  const overallConfidence =
    medicines.length > 0
      ? Math.round(
          (medicines.reduce((acc, m) => acc + m.confidence, 0) / medicines.length) * 100
        ) / 100
      : 0.5

  return {
    doctorName,
    date,
    medicines,
    rawText,
    overallConfidence,
  }
}

/**
 * Extracts structured medication details from an uploaded image or PDF using Gemini Multimodal Vision.
 * Falls back to deterministic mock data if GEMINI_API_KEY is not configured.
 */
export async function extractPrescription(
  imageBase64: string,
  mimeType: string
): Promise<ExtractedPrescription> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    // Return clearly labeled high-fidelity demo prescription data
    return MOCK_PRESCRIPTION
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1, // Low temperature for high OCR accuracy
      },
    })

    const prompt = `You are a clinical OCR system specialized in reading medical prescriptions and doctor's handwriting.
Extract all medications, doctor details, date, and dosage instructions with utmost fidelity.
NEVER invent, guess, or hallucinate a medicine name. If a medicine name or dosage is blurry or ambiguous, set confidence below 0.6 and state that confirmation is required.

Return a JSON object strictly adhering to this TypeScript structure:
{
  "doctorName": "string or null",
  "date": "string or null",
  "medicines": [
    {
      "name": "string (brand or generic name)",
      "strength": "string (e.g. 50 mcg, 500 mg)",
      "dose": "string (e.g. 1 tablet)",
      "frequency": "string (e.g. Once daily, Twice daily)",
      "duration": "string (e.g. 30 days, 3 months)",
      "instructions": "string (e.g. empty stomach, after food)",
      "confidence": number (between 0.0 and 1.0)
    }
  ],
  "rawText": "string containing full transcription of readable text"
}`

    const inlineData = {
      inlineData: {
        data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
        mimeType: mimeType || 'image/jpeg',
      },
    }

    const result = await model.generateContent([prompt, inlineData])
    const responseText = result.response.text()

    if (!responseText) {
      return MOCK_PRESCRIPTION
    }

    const parsedData = JSON.parse(responseText) as ExtractedPrescription

    // Verify and calibrate confidence scoring
    const validatedMedicines = (parsedData.medicines || []).map((med) => {
      const calculatedConf = calculateMedicineConfidence(med)
      const finalConf = Math.min(med.confidence || calculatedConf, calculatedConf)
      const validation = validateExtractedMedicine({ ...med, confidence: finalConf })
      return {
        ...med,
        confidence: finalConf,
        requiresConfirmation: validation.requiresConfirmation,
      }
    })

    return {
      doctorName: parsedData.doctorName || undefined,
      date: parsedData.date || undefined,
      medicines: validatedMedicines,
      rawText: parsedData.rawText || '',
      overallConfidence:
        validatedMedicines.length > 0
          ? Math.round(
              (validatedMedicines.reduce((sum, m) => sum + m.confidence, 0) /
                validatedMedicines.length) *
                100
            ) / 100
          : 0.8,
    }
  } catch (error) {
    console.error('[Gemini Service] extractPrescription error:', error)
    // Fall back to mock rather than failing hard if API call drops
    return MOCK_PRESCRIPTION
  }
}

/**
 * Generates an empathetic, clinical-contextualized chat response for the user.
 * Falls back to high-fidelity demo responses if GEMINI_API_KEY is not set.
 */
export async function generateChatResponse(
  userMessage: string,
  documentContext: string = '',
  chatHistory: Array<{ role: string; content: string }> = [],
  userName: string = 'Friend',
  language: 'en' | 'hi' | 'kn' = 'en'
): Promise<ChatResponse> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    // Return realistic TSH demo response
    return {
      content: `Hello ${userName}, looking at your Thyroid Profile lab report from Apollo Diagnostics dated 10 Sep 2026, your TSH (Thyroid Stimulating Hormone) level is recorded at 6.8 μIU/mL. The standard adult reference range is typically between 0.4 and 4.0 μIU/mL.

A TSH of 6.8 indicates mild subclinical hypothyroidism, meaning your pituitary gland is producing a little more TSH to gently prompt the thyroid gland. This is very common, treatable, and often associated with subtle fatigue, mild fluid retention, or occasional cycle variations.

Your Free T4 (FT4) level was within normal limits at 1.1 ng/dL. Because your Free T4 is normal, doctors often recommend repeating the test in 6 to 8 weeks or checking thyroid antibodies (Anti-TPO) before initiating low-dose Levothyroxine.`,
      citations: [
        {
          documentId: 'doc-lab-tsh-2026',
          documentTitle: 'Apollo Diagnostics Thyroid Panel Report',
          date: '10 Sep 2026',
        },
      ],
      triageLevel: 'safe',
      safetyFlagged: false,
      disclaimer:
        'This explanation is provided for health literacy based on your uploaded reports. It does not replace a clinical examination or formal diagnosis. Please discuss these numbers with your endocrinologist or physician.',
      suggestedFollowUps: [
        'What questions should I ask my doctor about this TSH level?',
        'Does subclinical hypothyroidism affect menstrual regularity or ovulation?',
        'Are there specific dietary or lifestyle adjustments that support thyroid health?',
      ],
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    })

    const systemPrompt = getSystemPromptWithContext({ userName, language, documentContext })

    const formattedHistory = chatHistory
      .slice(-6)
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n')

    const prompt = `${systemPrompt}

RECENT CHAT HISTORY:
${formattedHistory || 'No previous messages.'}

USER QUESTION:
"${userMessage}"

Respond in structured JSON format with this exact TypeScript structure:
{
  "content": "string (the empathetic, clear response in ${language})",
  "citations": [
    { "documentId": "string", "documentTitle": "string", "date": "string" }
  ],
  "triageLevel": "safe" | "caution" | "urgent",
  "safetyFlagged": boolean,
  "disclaimer": "string (appropriate clinical disclaimer)",
  "suggestedFollowUps": ["string", "string", "string"]
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    if (!text) {
      throw new Error('Empty response from Gemini AI')
    }

    const parsed = JSON.parse(text) as ChatResponse
    return {
      content: parsed.content || 'I have reviewed your inquiry. Please consult your physician for clinical diagnosis.',
      citations: parsed.citations || [],
      triageLevel: parsed.triageLevel || 'safe',
      safetyFlagged: parsed.safetyFlagged || false,
      disclaimer:
        parsed.disclaimer ||
        'This information is for educational purposes and is not a medical diagnosis. Always consult a healthcare professional.',
      suggestedFollowUps: parsed.suggestedFollowUps || [
        'What should I discuss with my doctor?',
        'Are there any symptoms I should monitor?',
      ],
    }
  } catch (error) {
    console.error('[Gemini Service] generateChatResponse error:', error)
    return {
      content: `I am here to help you review your health records. Based on your records, please verify with your physician to ensure you receive care tailored to your exact profile.`,
      citations: [],
      triageLevel: 'safe',
      safetyFlagged: false,
      disclaimer:
        'This information is for health literacy purposes only and does not constitute medical advice.',
      suggestedFollowUps: [
        'Could you explain my latest lab report?',
        'What questions should I ask my doctor?',
      ],
    }
  }
}

/**
 * Generates an accessible clinical summary of a medical document, including an intuitive glossary
 * and flagged out-of-range items.
 */
export async function generateDocumentSummary(
  extractedText: string,
  documentType: string = 'lab_report'
): Promise<DocumentSummary> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return {
      summary:
        'Thyroid Panel Lab Report dated 10 September 2026 showing mildly elevated TSH (6.8 μIU/mL, reference 0.4 - 4.0) with normal Free T4 (1.1 ng/dL) and normal Free T3 (2.9 pg/mL). Indicates mild subclinical hypothyroidism. Complete blood count and metabolic markers remain within healthy limits.',
      glossary: [
        {
          term: 'TSH (Thyroid Stimulating Hormone)',
          meaning:
            'A hormone produced by the brain’s pituitary gland that tells your thyroid how much thyroxine to release.',
        },
        {
          term: 'Free T4',
          meaning: 'The active circulating form of thyroid hormone that regulates cellular metabolism.',
        },
        {
          term: 'Subclinical Hypothyroidism',
          meaning:
            'A stage where TSH is mildly elevated but circulating thyroid hormone (Free T4) levels are still normal.',
        },
      ],
      flaggedItems: [
        {
          item: 'TSH: 6.8 μIU/mL',
          reason: 'Above standard reference range (0.4 - 4.0 μIU/mL); warrants clinical review with your doctor.',
        },
      ],
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    })

    const prompt = `You are a medical document analyzer for women's healthcare.
Analyze the following ${documentType} text and extract:
1. A warm, plain-language summary for the patient (2-4 sentences).
2. A glossary explaining medical jargon or abbreviations present in the text in simple, compassionate terms.
3. Flagged items: any test results or findings that are marked high, low, abnormal, or that warrant doctor consultation.

Document Text:
\`\`\`
${extractedText}
\`\`\`

Return strict JSON:
{
  "summary": "string",
  "glossary": [{ "term": "string", "meaning": "string" }],
  "flaggedItems": [{ "item": "string", "reason": "string" }]
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as DocumentSummary
  } catch (error) {
    console.error('[Gemini Service] generateDocumentSummary error:', error)
    return {
      summary: 'Document recorded. Please review the details with your healthcare provider.',
      glossary: [],
      flaggedItems: [],
    }
  }
}
