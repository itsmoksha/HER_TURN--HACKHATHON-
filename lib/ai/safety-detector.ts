/**
 * HER TURN Clinical AI Safety & Red-Flag Detector
 *
 * Scans user messages for acute clinical emergencies, pregnancy complications,
 * self-harm ideation, and symptoms warranting urgent or cautionary medical attention.
 */

export interface SafetyAssessment {
  isSafe: boolean
  triageLevel: 'safe' | 'caution' | 'urgent'
  flaggedKeywords: string[]
  urgentCareMessage?: string
  recommendedAction?: string
}

/**
 * Standard red flag keyword groups, categorized by clinical urgency.
 * Includes English terms, clinical abbreviations, and common Hindi transliterations.
 */
export const RED_FLAG_KEYWORDS: Record<string, string[]> = {
  critical: [
    'chest pain',
    'heart attack',
    'severe bleeding',
    'heavy bleeding',
    'massive bleeding',
    'difficulty breathing',
    "can't breathe",
    'cannot breathe',
    'shortness of breath',
    'struggling to breathe',
    'unconscious',
    'passed out',
    'loss of consciousness',
    'stroke',
    'face drooping',
    'slurred speech',
    'seizure',
    'convulsions',
    'fits',
    'severe abdominal pain',
    'acute abdominal pain',
    'severe stomach pain',
    'eclampsia',
    'preeclampsia',
    'suicidal',
    'want to die',
    'kill myself',
    'want to hurt myself',
    'end my life',
    'harm myself',
    'self harm',
    'severe head injury',
    'head trauma',
    'high fever',
    '>104f',
    '>104 f',
    '104f',
    '104 f',
    '40c',
    '40 c',
    '>40c',
    // Hindi Transliterations
    'seene me dard',
    'chhati me dard',
    'dil ka daura',
    'khoon beh raha hai',
    'bahut jyada bleeding',
    'saas lene me takleef',
    'saans lene me takleef',
    'saans nahi aa rahi',
    'behosh',
    'hosh kho baithna',
    'daura padna',
    'pet me bahut tez dard',
    'pet me asahaniya dard',
    'marne ka man',
    'jaan dena',
    'khudkushi',
    'sar me chot',
    'sir par chot',
    'tez bukhar',
  ],
  pregnancy: [
    'reduced fetal movement',
    'decreased fetal movement',
    'baby not moving',
    'no fetal movement',
    'less fetal movement',
    'water breaking before term',
    'water breaking',
    'water broke',
    'leaking amniotic fluid',
    'severe swelling during pregnancy',
    'sudden swelling pregnancy',
    'blurred vision during pregnancy',
    'vision changes pregnancy',
    'bleeding during pregnancy',
    'vaginal bleeding during pregnancy',
    'spotting during pregnancy',
    'heavy bleeding during pregnancy',
    'severe abdominal pain during pregnancy',
    'severe cramping during pregnancy',
    // Hindi Transliterations
    'bachhe ki halchal kam',
    'shishu ki halchal band',
    'pregnancy me bleeding',
    'garbhavastha me dard',
    'paani girna',
    'pregnancy me sujan',
  ],
  caution: [
    'prolonged fever',
    'persistent fever',
    'fever for 5 days',
    'fever for several days',
    'fever for days',
    'persistent vomiting',
    'continuous vomiting',
    'cannot keep food down',
    'unusual discharge',
    'foul smelling discharge',
    'abnormal vaginal discharge',
    'missed period',
    'period delayed',
    'severe mood changes',
    'extreme mood swings',
    'unexplained weight loss',
    'sudden weight loss',
    'lump in breast',
    'breast lump',
    // Hindi Transliterations
    'kayi din se bukhar',
    'paanch din se bukhar',
    '5 din se bukhar',
    'baar baar ulti',
    'lagatar ulti',
    'aswabhavik discharge',
    'safed paani',
    'vajan kam hona',
  ],
}

/**
 * Regex patterns for nuances like dynamic day counters ('fever for 4 days') or fever temperature degrees
 */
const URGENT_REGEX_PATTERNS = [
  /chest\s+pain/i,
  /heart\s+attack/i,
  /heavy\s+bleeding/i,
  /severe\s+bleeding/i,
  /difficul(ty|t)\s+(in\s+)?breathing/i,
  /can'?t\s+breathe/i,
  /cannot\s+breathe/i,
  /unconscious/i,
  /seizure|convulsion/i,
  /stroke/i,
  /severe\s+abdominal\s+pain/i,
  /eclampsia|preeclampsia/i,
  /suicid(e|al)/i,
  /want\s+to\s+die/i,
  /kill\s+myself/i,
  /want\s+to\s+hurt\s+myself/i,
  /harm\s+myself/i,
  /severe\s+head\s+injury/i,
  /(fever|temperature).*(>|over|above)?\s*(104\s*°?\s*f|40\s*°?\s*c)/i,
  /reduced\s+fetal\s+movement/i,
  /decreased\s+fetal\s+movement/i,
  /baby\s+not\s+moving/i,
  /water\s+breaking/i,
  /water\s+broke/i,
  /swelling\s+during\s+pregnancy/i,
  /blurred\s+vision\s+during\s+pregnancy/i,
  /bleeding\s+during\s+pregnancy/i,
  /severe\s+abdominal\s+pain\s+during\s+pregnancy/i,
]

const CAUTION_REGEX_PATTERNS = [
  /fever\s+(for|lasting)\s+(\d+|several|many|a\s+few)\s+days/i,
  /prolonged\s+fever/i,
  /persistent\s+vomiting/i,
  /unusual\s+discharge/i,
  /missed\s+period/i,
  /severe\s+mood\s+changes/i,
  /unexplained\s+weight\s+loss/i,
]

/**
 * Standard urgent care escalation text for acute symptoms
 */
export const URGENT_CARE_MESSAGE =
  'This sounds like it may need immediate medical attention. Please call emergency services (102/112 in India) or go to your nearest emergency room NOW. Do not wait.'

/**
 * Standard caution message for non-emergency concerning symptoms
 */
export const CAUTION_CARE_MESSAGE =
  'This is worth discussing with your doctor soon. Please book an appointment within the next few days.'

/**
 * Assesses an incoming user message against clinical red flags and safety rules.
 *
 * @param message The user prompt or symptom description
 * @returns SafetyAssessment containing triage level, flags, and recommended immediate actions
 */
export function assessSafety(message: string): SafetyAssessment {
  if (!message || typeof message !== 'string') {
    return {
      isSafe: true,
      triageLevel: 'safe',
      flaggedKeywords: [],
      recommendedAction: 'Enter a valid health query to receive guidance.',
    }
  }

  const normalized = message.toLowerCase().trim()
  const flaggedKeywords: string[] = []

  // 1. Check CRITICAL & PREGNANCY WARNING red flags (URGENT)
  const urgentKeywords = [...RED_FLAG_KEYWORDS.critical, ...RED_FLAG_KEYWORDS.pregnancy]

  for (const keyword of urgentKeywords) {
    if (normalized.includes(keyword.toLowerCase())) {
      if (!flaggedKeywords.includes(keyword)) {
        flaggedKeywords.push(keyword)
      }
    }
  }

  for (const pattern of URGENT_REGEX_PATTERNS) {
    const match = normalized.match(pattern)
    if (match) {
      const matchedText = match[0].trim()
      if (!flaggedKeywords.some((k) => k.toLowerCase() === matchedText.toLowerCase())) {
        flaggedKeywords.push(matchedText)
      }
    }
  }

  if (flaggedKeywords.length > 0) {
    return {
      isSafe: false,
      triageLevel: 'urgent',
      flaggedKeywords,
      urgentCareMessage: URGENT_CARE_MESSAGE,
      recommendedAction:
        'Seek emergency medical evaluation immediately. Call 102 / 112 (India) or proceed to the nearest emergency department right away.',
    }
  }

  // 2. Check CAUTION symptoms (non-emergency but needs doctor visit soon)
  const cautionKeywords = RED_FLAG_KEYWORDS.caution

  for (const keyword of cautionKeywords) {
    if (normalized.includes(keyword.toLowerCase())) {
      if (!flaggedKeywords.includes(keyword)) {
        flaggedKeywords.push(keyword)
      }
    }
  }

  for (const pattern of CAUTION_REGEX_PATTERNS) {
    const match = normalized.match(pattern)
    if (match) {
      const matchedText = match[0].trim()
      if (!flaggedKeywords.some((k) => k.toLowerCase() === matchedText.toLowerCase())) {
        flaggedKeywords.push(matchedText)
      }
    }
  }

  if (flaggedKeywords.length > 0) {
    return {
      isSafe: false,
      triageLevel: 'caution',
      flaggedKeywords,
      recommendedAction: CAUTION_CARE_MESSAGE,
    }
  }

  // 3. SAFE (General questions, normal lab values, mild headaches, routine checks)
  return {
    isSafe: true,
    triageLevel: 'safe',
    flaggedKeywords: [],
    recommendedAction:
      'Continue standard care and health tracking. Always review ongoing health decisions with your doctor.',
  }
}

/**
 * Returns UI-friendly card metadata based on the safety assessment result.
 */
export function getTriageCard(assessment: SafetyAssessment): {
  title: string
  message: string
  action: string
  color: string
} {
  switch (assessment.triageLevel) {
    case 'urgent':
      return {
        title: 'Seek Immediate Care',
        message: assessment.urgentCareMessage || URGENT_CARE_MESSAGE,
        action: 'Call Emergency 102 / 112',
        color: 'red',
      }
    case 'caution':
      return {
        title: 'Book a Doctor Visit Soon',
        message: assessment.recommendedAction || CAUTION_CARE_MESSAGE,
        action: 'Book Doctor Appointment',
        color: 'amber',
      }
    case 'safe':
    default:
      return {
        title: 'Informational & Routine Care',
        message:
          'Your question appears informational. Your health records provide context, but always verify medical choices with your physician.',
        action: 'Continue Exploring Records',
        color: 'green',
      }
  }
}
