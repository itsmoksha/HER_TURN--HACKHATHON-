/**
 * HER TURN - Clinical & Application Constants
 * Design tokens, medical classifications, triage matrices, and validation limits.
 */

import { DocumentType, TriageLevel } from './types'

export const APP_NAME = 'HER TURN'
export const APP_TAGLINE = 'Her Health, In Her Hands'
export const APP_DESCRIPTION =
  'A dignified, AI-empowered personal health record and companion tailored for Indian women.'

/** Maximum allowed file size for document uploads (in Megabytes) */
export const MAX_FILE_SIZE_MB = 10
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

/** Supported MIME types and extensions for document uploads */
export const SUPPORTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/pdf',
]

export const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf']

/**
 * Standard Medical Document Types with human-readable labels and descriptions
 */
export interface DocumentTypeOption {
  value: DocumentType
  label: string
  description: string
  iconName: string
}

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  {
    value: 'prescription',
    label: 'Prescription',
    description: 'Doctor consultation notes, prescribed dosages, and follow-ups',
    iconName: 'FileText',
  },
  {
    value: 'lab_report',
    label: 'Lab Report',
    description: 'Blood work, pathology, hormone profiles, and biochemistry',
    iconName: 'FlaskConical',
  },
  {
    value: 'scan',
    label: 'Scan & Imaging',
    description: 'Ultrasound (USG), X-Ray, MRI, CT scans, and Mammograms',
    iconName: 'ScanLine',
  },
  {
    value: 'discharge_summary',
    label: 'Discharge Summary',
    description: 'Hospital admission records, procedures, and discharge instructions',
    iconName: 'Building2',
  },
  {
    value: 'test_result',
    label: 'Test Result',
    description: 'Home test kits, glucose monitoring, ECG strips, or biometrics',
    iconName: 'Activity',
  },
  {
    value: 'vaccination',
    label: 'Vaccination',
    description: 'Immunization certificates, HPV, Tdap, Rubella, Flu shots',
    iconName: 'Syringe',
  },
  {
    value: 'other',
    label: 'Other Document',
    description: 'Insurance cards, bills, lifestyle assessments, and wellness notes',
    iconName: 'File',
  },
]

/**
 * Chronic and physiological conditions common in women's health
 */
export const HEALTH_CONDITIONS = [
  'PCOS (Polycystic Ovary Syndrome)',
  'Thyroid (Hypothyroidism / Hyperthyroidism)',
  'Pregnancy (Antenatal Care)',
  'Postpartum (Postnatal Recovery)',
  'Anemia / Iron Deficiency',
  'Type 2 Diabetes / Gestational Diabetes',
  'Hypertension (High Blood Pressure)',
  'Endometriosis',
  'Fibroids',
  'Osteoporosis / Vitamin D Deficiency',
  'Perimenopause / Menopause',
  'None / General Wellness',
] as const

/**
 * Standard medication frequency schedules
 */
export const MEDICINE_FREQUENCIES = [
  'Once daily (Morning)',
  'Once daily (Night)',
  'Twice daily (Morning & Night)',
  'Three times daily (Morning, Noon & Night)',
  'Four times daily',
  'As needed (SOS / When required)',
  'Weekly (Once a week)',
  'Monthly',
] as const

/**
 * Red-flag symptoms and keywords triggering safety alerts and immediate triage escalation
 */
export const RED_FLAG_KEYWORDS = [
  'heavy bleeding',
  'soaking pad in an hour',
  'large blood clots',
  'chest pain',
  'difficulty breathing',
  'shortness of breath',
  'severe abdominal pain',
  'sudden severe headache',
  'worst headache of life',
  'sudden loss of vision',
  'blurred vision with high bp',
  'high fever with chills',
  'fainting',
  'loss of consciousness',
  'coughing blood',
  'severe dizziness',
  'calf pain and swelling',
  'decreased fetal movement',
  'fluid leaking pregnancy',
  'thoughts of self-harm',
  'suicidal thoughts',
  'anaphylaxis',
  'swelling of lips or throat',
] as const

/**
 * Triage level display mapping with color, background, and badge semantics
 */
export const TRIAGE_COLORS: Record<
  TriageLevel,
  {
    label: string
    color: string
    bgLight: string
    border: string
    badgeVariant: 'success' | 'warning' | 'urgent'
    description: string
  }
> = {
  'self-care': {
    label: 'Self-Care & Monitoring',
    color: '#2D7A4F',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    badgeVariant: 'success',
    description: 'Low-urgency symptoms. Rest, home measures, and routine tracking advised.',
  },
  'see-doctor': {
    label: 'See a Doctor',
    color: '#C47B2B',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    badgeVariant: 'warning',
    description: 'Clinical consultation recommended within 24-48 hours.',
  },
  'seek-care-now': {
    label: 'Seek Immediate Care',
    color: '#C0392B',
    bgLight: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-300 dark:border-rose-800',
    badgeVariant: 'urgent',
    description: 'Urgent red-flag markers detected. Visit an emergency room or call 112 now.',
  },
}

/**
 * Age range brackets for clinical context
 */
export const AGE_RANGES = [
  'Under 18',
  '18 - 24',
  '25 - 34',
  '35 - 44',
  '45 - 54',
  '55 - 64',
  '65 and above',
] as const

/**
 * Medical specialties relevant to women's primary and specialized healthcare
 */
export const SPECIALTIES = [
  'Obstetrician & Gynecologist (OB/GYN)',
  'Endocrinologist',
  'General Physician / Internal Medicine',
  'Pediatrician',
  'Dermatologist',
  'Cardiologist',
  'Psychiatrist / Mental Health',
  'Nutritionist / Dietitian',
  'Physiotherapist',
  'Oncologist',
  'Reproductive Endocrinologist',
] as const

/**
 * Relationship options for Circle of Trust
 */
export const RELATIONSHIPS = [
  { value: 'mother', label: 'Mother' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'sister', label: 'Sister' },
  { value: 'spouse', label: 'Spouse / Partner' },
  { value: 'friend', label: 'Trusted Friend' },
  { value: 'doctor', label: 'Personal Physician' },
  { value: 'caregiver', label: 'Caregiver / Nurse' },
  { value: 'other', label: 'Other Family Member' },
] as const

/**
 * Indian Emergency Helpline Numbers
 */
export const EMERGENCY_NUMBERS = {
  nationalEmergency: { number: '112', label: 'National All-in-One Emergency' },
  ambulance: { number: '108', label: 'Emergency Medical Service / Ambulance' },
  maternityCare: { number: '102', label: 'Free Pregnancy & Mother-Child Ambulance' },
  womenHelpline: { number: '1091', label: 'Women in Distress Helpline' },
  mentalHealth: { number: '14416', label: 'Tele-MANAS Mental Health Helpline' },
}

/**
 * Design system palette hex codes for direct inline SVGs or charts
 */
export const BRAND_COLORS = {
  plumDark: '#4A1C40',
  plumMedium: '#7B3F6E',
  plumLight: '#9B5A85',
  roseSoft: '#E8A0A0',
  sandSoft: '#F5E6D0',
  sandWarm: '#ead5b0',
  success: '#2D7A4F',
  warning: '#C47B2B',
  danger: '#C0392B',
}
