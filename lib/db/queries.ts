import { MedicalDocument, ExtractedField, Medicine, LabTrend } from '@/lib/types'

// ─── Widget / Component shared types ─────────────────────────────────────────

export interface AdherenceDay {
  dayName: string
  fullDate: string
  status: 'full' | 'partial' | 'missed' | 'today' | 'none'
  percent: number
  totalDoses: number
  takenDoses: number
}

export interface ReadinessItem {
  id: string
  title: string
  description: string
  isComplete: boolean
  category: string
  statusText?: string
}

export interface HealthReadinessData {
  score: number
  maxScore: number
  summary: string
  items: ReadinessItem[]
}

export interface DocumentGlossaryItem {
  term: string
  definition: string
  category?: 'condition' | 'medication' | 'lab' | 'anatomy'
}

export interface FlaggedItem {
  id: string
  name: string
  value: string
  referenceRange: string
  status: 'critical' | 'abnormal_high' | 'abnormal_low' | 'warning'
  explanation: string
}

export interface DetailedDocument extends MedicalDocument {
  glossary?: DocumentGlossaryItem[]
  flaggedItems?: FlaggedItem[]
  hospitalOrClinic?: string
  department?: string
  confidenceScore?: number
}

export interface ConfirmationMedicineItem {
  id: string
  document_id: string
  name: string
  nameConfidence: number
  strength: string
  strengthConfidence: number
  dose: string
  doseConfidence: number
  frequency: string
  frequencyConfidence: number
  duration: string
  durationConfidence: number
  instructions: string
  instructionsConfidence: number
  isConfirmed: boolean
  setReminder: boolean
  plainLanguageExplanation: string
  category: string
  potentialInteractions?: string[]
}

// -------------------------------------------------------------
// MOCK DATA STORE
// -------------------------------------------------------------

export const MOCK_DOCUMENTS: DetailedDocument[] = [
  {
    id: 'doc-1',
    user_id: 'user-priya-01',
    title: 'Endocrinology Prescription & Thyroid Protocol',
    type: 'prescription',
    file_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    file_name: 'prescription_thyroid_oct2026.pdf',
    file_size: 1420000,
    extracted_text: `DR. ANANYA SHARMA, MD (Endocrinology)
Apollo Hospitals, Greams Road, Chennai
Reg. No: 64892/TN

Patient: Priya Venkataraman | Age: 32 | Date: 12 Oct 2026
Diagnosis: Subclinical Hypothyroidism + Mild Vitamin D Deficiency

Rx:
1. Tab. Thyronorm (Levothyroxine Sodium) 50 mcg
   Sig: 1 tab daily, early morning on empty stomach with plain water.
   Wait 45 minutes before tea, coffee, or breakfast.
   Duration: 90 days.
   
2. Cap. D-Rise (Cholecalciferol) 60,000 IU
   Sig: 1 cap once weekly after Sunday lunch.
   Duration: 8 weeks.
   
3. Tab. Shelcal-500 (Calcium carbonate + Vit D3)
   Sig: 1 tab daily at bedtime.
   Duration: 60 days.

Advice:
- Repeat fasting TSH, Free T3, Free T4 after 8 weeks.
- Keep 4 hours gap between Levothyroxine and Calcium supplements.`,
    ai_summary:
      'Prescription from Dr. Ananya Sharma for managing mild underactive thyroid (hypothyroidism) and low Vitamin D. Key instruction: Take your thyroid medication (Thyronorm 50mcg) first thing in the morning with plain water, and wait at least 45 minutes before having coffee, tea, or food. Also keep calcium supplements 4 hours apart from thyroid medicine so they absorb properly.',
    tags: ['Thyroid', 'Endocrinology', 'Levothyroxine', 'Vitamin D', 'Daily Routine'],
    doctor_name: 'Dr. Ananya Sharma',
    hospitalOrClinic: 'Apollo Speciality Hospitals, Chennai',
    department: 'Endocrinology & Metabolic Disorders',
    document_date: '2026-10-12',
    created_at: '2026-10-12T09:45:00Z',
    confidenceScore: 0.94,
    extracted_fields: [
      {
        id: 'ef-1-1',
        document_id: 'doc-1',
        field_name: 'Primary Medication',
        field_value: 'Levothyroxine (Thyronorm) 50 mcg',
        confidence: 0.98,
        is_confirmed: true,
      },
      {
        id: 'ef-1-2',
        document_id: 'doc-1',
        field_name: 'Dosage Schedule',
        field_value: '1 tablet daily at 06:30 AM (Empty stomach)',
        confidence: 0.95,
        is_confirmed: true,
      },
      {
        id: 'ef-1-3',
        document_id: 'doc-1',
        field_name: 'Weekly Vitamin D Supplement',
        field_value: 'Cholecalciferol 60,000 IU once weekly (Sundays)',
        confidence: 0.91,
        is_confirmed: true,
      },
      {
        id: 'ef-1-4',
        document_id: 'doc-1',
        field_name: 'Critical Interaction Note',
        field_value: 'Separate Calcium and Thyronorm by at least 4 hours',
        confidence: 0.94,
        is_confirmed: true,
      },
      {
        id: 'ef-1-5',
        document_id: 'doc-1',
        field_name: 'Follow-up Evaluation',
        field_value: 'Repeat fasting TSH + Free T4 in 8 weeks (Dec 2026)',
        confidence: 0.88,
        is_confirmed: false,
      },
    ],
    glossary: [
      {
        term: 'Subclinical Hypothyroidism',
        definition:
          'A condition where your thyroid gland is slightly underactive. Your TSH is mildly elevated, but free thyroid hormones are still within normal levels.',
        category: 'condition',
      },
      {
        term: 'Levothyroxine (Thyronorm)',
        definition:
          'A synthetic copy of the natural thyroid hormone thyroxine (T4) that restores healthy hormone balance in your body.',
        category: 'medication',
      },
      {
        term: 'Cholecalciferol',
        definition:
          'Vitamin D3 in concentrated form, used to quickly rebuild bone-strengthening vitamin D stores.',
        category: 'medication',
      },
    ],
    flaggedItems: [
      {
        id: 'flag-1',
        name: 'Supplements Absorption Interaction',
        value: 'Calcium & Levothyroxine co-prescribed',
        referenceRange: 'Separate by >= 4 hours',
        status: 'warning',
        explanation: 'Calcium binds to thyroid hormones in the stomach, preventing absorption if taken together.',
      },
    ],
  },
  {
    id: 'doc-2',
    user_id: 'user-priya-01',
    title: 'Comprehensive Metabolic & Thyroid Blood Panel',
    type: 'lab_report',
    file_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    file_name: 'thyrocare_lab_report_sep2026.pdf',
    file_size: 2150000,
    extracted_text: `LAL PATHLABS / THYROCARE ACCREDITED DIAGNOSTICS
Patient: Priya Venkataraman | Ref by: Dr. Ananya Sharma | Date: 28 Sep 2026

TEST RESULTS:
1. TSH (Ultrasensitive 3rd Gen): 6.84 uIU/mL [Normal: 0.45 - 4.50] -> HIGH
2. Free T4 (FT4): 1.12 ng/dL [Normal: 0.80 - 1.80] -> NORMAL
3. Free T3 (FT3): 2.9 pg/mL [Normal: 2.3 - 4.2] -> NORMAL
4. 25-Hydroxy Vitamin D: 16.2 ng/mL [Normal: 30 - 100] -> DEFICIENT
5. Serum Ferritin: 19 ng/mL [Normal: 20 - 200] -> BORDERLINE LOW
6. Hemoglobin: 11.4 g/dL [Normal: 12.0 - 15.5] -> MILD ANEMIA
7. HbA1c: 5.4% [Normal: < 5.7%] -> NORMAL`,
    ai_summary:
      'Your latest blood test shows elevated TSH (6.84 uIU/mL), confirming that your thyroid requires support. Vitamin D is low at 16.2 ng/mL, and ferritin/hemoglobin are on the lower threshold. Your blood sugar markers (HbA1c) are completely healthy.',
    tags: ['Thyroid Panel', 'Vitamin D', 'Iron Deficiency', 'Lal PathLabs', 'Blood Test'],
    doctor_name: 'Dr. Ananya Sharma',
    hospitalOrClinic: 'Dr. Lal PathLabs, Adyar',
    department: 'Pathology & Biochemistry',
    document_date: '2026-09-28',
    created_at: '2026-09-28T14:20:00Z',
    confidenceScore: 0.97,
    extracted_fields: [
      {
        id: 'ef-2-1',
        document_id: 'doc-2',
        field_name: 'TSH Level',
        field_value: '6.84 uIU/mL (High)',
        confidence: 0.99,
        is_confirmed: true,
      },
      {
        id: 'ef-2-2',
        document_id: 'doc-2',
        field_name: '25-OH Vitamin D',
        field_value: '16.2 ng/mL (Deficient)',
        confidence: 0.98,
        is_confirmed: true,
      },
      {
        id: 'ef-2-3',
        document_id: 'doc-2',
        field_name: 'Hemoglobin',
        field_value: '11.4 g/dL (Mild low)',
        confidence: 0.96,
        is_confirmed: true,
      },
      {
        id: 'ef-2-4',
        document_id: 'doc-2',
        field_name: 'Glycated Hb (HbA1c)',
        field_value: '5.4% (Optimal)',
        confidence: 0.98,
        is_confirmed: true,
      },
    ],
    glossary: [
      {
        term: 'TSH (Thyroid Stimulating Hormone)',
        definition:
          'A hormone produced by your pituitary gland that tells your thyroid to make hormones. Higher TSH means your pituitary is shouting because your thyroid is slightly sluggish.',
        category: 'lab',
      },
      {
        term: 'Serum Ferritin',
        definition:
          'A blood protein containing iron. It measures how much iron your body has stored for making red blood cells and sustaining energy.',
        category: 'lab',
      },
    ],
    flaggedItems: [
      {
        id: 'flag-2-1',
        name: 'TSH (Ultrasensitive)',
        value: '6.84 uIU/mL',
        referenceRange: '0.45 - 4.50 uIU/mL',
        status: 'abnormal_high',
        explanation: 'Elevated TSH indicates mild thyroid underactivity; prompted initiation of 50mcg Levothyroxine.',
      },
      {
        id: 'flag-2-2',
        name: '25-Hydroxy Vitamin D',
        value: '16.2 ng/mL',
        referenceRange: '30.0 - 100.0 ng/mL',
        status: 'critical',
        explanation: 'Vitamin D is deficient, which can contribute to fatigue, hair thinning, and bone ache.',
      },
      {
        id: 'flag-2-3',
        name: 'Hemoglobin',
        value: '11.4 g/dL',
        referenceRange: '12.0 - 15.5 g/dL',
        status: 'abnormal_low',
        explanation: 'Mild anemia; consider iron-rich diet and review with physician.',
      },
    ],
  },
  {
    id: 'doc-3',
    user_id: 'user-priya-01',
    title: 'Pelvic & Ovarian Ultrasound Imaging Report',
    type: 'scan',
    file_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    file_name: 'pelvic_ultrasound_june2026.pdf',
    file_size: 3400000,
    extracted_text: `MEDALL HEALTHCARE ULTRASONOGRAPHY DEPT
Patient: Priya Venkataraman | Age: 32 | Date: 14 Jun 2026
Scan: Transabdominal & Pelvic Sonography

Findings:
- Uterus: Normal in size (7.6 x 3.8 x 4.2 cm), anteverted, regular contours.
- Endometrial thickness: 7.2 mm, homogeneous and secretory phase compatible.
- Right Ovary: Volume 8.2 cc. Multiple peripherally arranged tiny subcentimeter follicles (>12 follicles, 'string-of-pearls' appearance).
- Left Ovary: Volume 7.9 cc. Similar polycystic ovarian morphology noted.
- Pouch of Douglas: No free fluid or masses seen.

Impression:
Bilateral polycystic ovarian morphology (PCOM) in correlation with clinical features. No adnexal cyst or mass.`,
    ai_summary:
      'Pelvic ultrasound confirms classic Polycystic Ovarian Morphology (PCOM), meaning both ovaries display tiny peripheral follicles often seen in PCOS. The uterus and lining are normal and healthy, with no abnormal cysts or growths.',
    tags: ['Ultrasound', 'Gynecology', 'PCOS', 'Pelvic Sonography', 'Ovarian Health'],
    doctor_name: 'Dr. Meenakshi Sundaram',
    hospitalOrClinic: 'Medall Scan & Diagnostics',
    department: 'Radiology & Women Imaging',
    document_date: '2026-06-14',
    created_at: '2026-06-14T11:15:00Z',
    confidenceScore: 0.93,
    extracted_fields: [
      {
        id: 'ef-3-1',
        document_id: 'doc-3',
        field_name: 'Endometrial Thickness',
        field_value: '7.2 mm (Normal secretory)',
        confidence: 0.95,
        is_confirmed: true,
      },
      {
        id: 'ef-3-2',
        document_id: 'doc-3',
        field_name: 'Ovarian Findings',
        field_value: 'Bilateral Polycystic Ovarian Morphology (>12 peripheral follicles)',
        confidence: 0.94,
        is_confirmed: true,
      },
      {
        id: 'ef-3-3',
        document_id: 'doc-3',
        field_name: 'Adnexal Masses',
        field_value: 'None detected',
        confidence: 0.97,
        is_confirmed: true,
      },
    ],
    glossary: [
      {
        term: 'Polycystic Ovarian Morphology (PCOM)',
        definition:
          'The visual ultrasound appearance where ovaries have many tiny egg sacs (follicles) lined up like pearls. It is very common and a key indicator of PCOS.',
        category: 'anatomy',
      },
      {
        term: 'Endometrial Thickness',
        definition:
          'The measurement of the inner lining of the womb. It naturally changes thickness during different stages of your monthly cycle.',
        category: 'anatomy',
      },
    ],
    flaggedItems: [
      {
        id: 'flag-3-1',
        name: 'Ovarian Follicle Pattern',
        value: '>12 peripheral follicles / ovary',
        referenceRange: '< 10 follicles',
        status: 'warning',
        explanation: 'Typical PCOS pattern. Hormone balance and lifestyle tracking recommended.',
      },
    ],
  },
  {
    id: 'doc-4',
    user_id: 'user-priya-01',
    title: 'Gynecological Consultation & PCOS Care Plan',
    type: 'prescription',
    file_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    file_name: 'gynecology_pcos_presc_may2026.pdf',
    file_size: 1680000,
    extracted_text: `DR. PRIYA RAMACHANDRAN, DGO, DNB (OBGYN)
Motherhood Women & Child Hospital, Bengaluru

Patient: Priya Venkataraman | Date: 19 May 2026
Diagnosis: PCOS with oligomenorrhea + insulin resistance suspicion

Rx:
1. Tab. Myo-Inositol + D-Chiro Inositol (40:1) with L-Methylfolate (Ovasave)
   Sig: 1 sachet / chewable tab twice daily after meals.
   Duration: 6 months.

2. Tab. Metformin Hydrochloride 500 mg Extended Release
   Sig: 1 tab with dinner daily for 2 weeks, then escalate to 1 tab twice daily with meals.
   Instructions: Take strictly with food to minimize tummy upset.

3. Lifestyle: 30 minutes brisk walking or resistance training 5x/week.
   Reduce high-glycemic carbohydrates; increase fiber and protein.`,
    ai_summary:
      'Care plan prescribed by Dr. Priya Ramachandran for regulating cycles and improving insulin sensitivity in PCOS. Includes Inositol supplement twice daily and extended-release Metformin with dinner to support metabolic health.',
    tags: ['Gynecology', 'PCOS', 'Inositol', 'Metformin', 'Lifestyle Plan'],
    doctor_name: 'Dr. Priya Ramachandran',
    hospitalOrClinic: 'Motherhood Hospital, Indiranagar',
    department: 'Obstetrics & Gynecology',
    document_date: '2026-05-19',
    created_at: '2026-05-19T16:00:00Z',
    confidenceScore: 0.92,
    extracted_fields: [
      {
        id: 'ef-4-1',
        document_id: 'doc-4',
        field_name: 'Cycle Support Compound',
        field_value: 'Myo-Inositol + D-Chiro Inositol 40:1 ratio',
        confidence: 0.94,
        is_confirmed: true,
      },
      {
        id: 'ef-4-2',
        document_id: 'doc-4',
        field_name: 'Metabolic Support',
        field_value: 'Metformin ER 500mg with evening meal',
        confidence: 0.91,
        is_confirmed: true,
      },
      {
        id: 'ef-4-3',
        document_id: 'doc-4',
        field_name: 'Special Administration Rule',
        field_value: 'Take Metformin with food to protect gastric lining',
        confidence: 0.96,
        is_confirmed: true,
      },
    ],
    glossary: [
      {
        term: 'Myo-Inositol',
        definition:
          'A vitamin-like nutrient that enhances your body’s insulin sensitivity and supports healthy ovarian egg maturation and regular ovulation.',
        category: 'medication',
      },
      {
        term: 'Extended Release (ER)',
        definition:
          'A tablet designed to slowly release the active ingredient into your bloodstream over hours, reducing digestive side effects.',
        category: 'medication',
      },
    ],
    flaggedItems: [],
  },
  {
    id: 'doc-5',
    user_id: 'user-priya-01',
    title: 'Hospital Discharge Summary — Laparoscopic Appendectomy',
    type: 'summary',
    file_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    file_name: 'discharge_summary_fortis_2025.pdf',
    file_size: 4800000,
    extracted_text: `FORTIS HOSPITAL, BANNERGHATTA ROAD
DEPARTMENT OF GENERAL & MINIMAL ACCESS SURGERY
DISCHARGE SUMMARY

Patient: Priya Venkataraman | UHID: FT-2025-99812
Admission: 12 Jan 2025 | Discharge: 14 Jan 2025
Procedure: Laparoscopic Appendectomy under General Anesthesia
Operating Surgeon: Dr. Rajesh K. Rao, MS, FRCS

Clinical Course:
Patient presented with acute right iliac fossa pain and mild leukocytosis. Ultrasound showed inflamed appendix without perforation. Laparoscopic appendectomy performed uneventfully. Port sites clean and healthy. Patient tolerated oral feeds on Post-Op Day 1.

Discharge Advice:
- Keep surgical incisions dry for 7 days.
- Avoid heavy lifting (>5 kg) for 4 weeks.
- Normal diet resumed with high fiber.`,
    ai_summary:
      'Discharge summary from your routine laparoscopic appendix surgery in January 2025 by Dr. Rajesh K. Rao. Surgery went smoothly with no complications. All incisions healed well. Retained as part of your permanent surgical history.',
    tags: ['Surgical History', 'Laparoscopy', 'Discharge Summary', 'Fortis Hospital'],
    doctor_name: 'Dr. Rajesh K. Rao',
    hospitalOrClinic: 'Fortis Hospital, Bannerghatta',
    department: 'Minimal Access Surgery',
    document_date: '2025-01-14',
    created_at: '2025-01-14T10:00:00Z',
    confidenceScore: 0.98,
    extracted_fields: [
      {
        id: 'ef-5-1',
        document_id: 'doc-5',
        field_name: 'Surgical Procedure',
        field_value: 'Laparoscopic Appendectomy',
        confidence: 0.99,
        is_confirmed: true,
      },
      {
        id: 'ef-5-2',
        document_id: 'doc-5',
        field_name: 'Post-Op Complications',
        field_value: 'None; Uneventful recovery',
        confidence: 0.98,
        is_confirmed: true,
      },
    ],
    glossary: [
      {
        term: 'Laparoscopic Appendectomy',
        definition:
          'Minimally invasive keyhole surgery using tiny cameras and instruments to remove an inflamed appendix through small abdominal incisions.',
        category: 'condition',
      },
    ],
    flaggedItems: [],
  },
  {
    id: 'doc-6',
    user_id: 'user-priya-01',
    title: 'Annual Gynecological Cervical Screening (Pap Smear)',
    type: 'lab_report',
    file_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    file_name: 'pap_smear_cytology_2025.pdf',
    file_size: 1100000,
    extracted_text: `MANIPAL HOSPITAL CYTOPATHOLOGY LABORATORY
LIQUID BASED CYTOLOGY (LBC) CERVICAL SMEAR

Patient: Priya Venkataraman | Age: 31 | Date: 18 Nov 2025
Specimen Adequacy: Satisfactory for evaluation. Endocervical component present.
Interpretation: Negative for Intraepithelial Lesion or Malignancy (NILM).
Microscopic Description: Superficial and intermediate squamous cells, reactive cellular changes associated with inflammation. High-risk HPV DNA testing: Negative.

Recommendation: Routine screening in 3 years.`,
    ai_summary:
      'Liquid-based Pap smear and HPV screening report shows completely normal, benign results (NILM). No pre-cancerous or abnormal cells found. Next routine screening is recommended in 3 years.',
    tags: ['Pap Smear', 'Preventive Care', 'Cytology', 'Women Screening', 'Normal Result'],
    doctor_name: 'Dr. Priya Ramachandran',
    hospitalOrClinic: 'Manipal Hospital Diagnostics',
    department: 'Cytopathology',
    document_date: '2025-11-18',
    created_at: '2025-11-18T12:00:00Z',
    confidenceScore: 0.99,
    extracted_fields: [
      {
        id: 'ef-6-1',
        document_id: 'doc-6',
        field_name: 'Cytology Result',
        field_value: 'Negative for Intraepithelial Lesion (Normal)',
        confidence: 0.99,
        is_confirmed: true,
      },
      {
        id: 'ef-6-2',
        document_id: 'doc-6',
        field_name: 'HPV DNA High Risk',
        field_value: 'Negative',
        confidence: 0.99,
        is_confirmed: true,
      },
    ],
    glossary: [
      {
        term: 'NILM',
        definition:
          'Negative for Intraepithelial Lesion or Malignancy — the gold standard clinical phrase meaning your cervical cells are completely healthy and free of disease.',
        category: 'lab',
      },
    ],
    flaggedItems: [],
  },
]

// -------------------------------------------------------------
// HERO CONFIRMATION FLOW MOCK EXTRACTION
// -------------------------------------------------------------

export const MOCK_CONFIRMATION_MEDICINES: ConfirmationMedicineItem[] = [
  {
    id: 'conf-med-1',
    document_id: 'doc-1',
    name: 'Thyronorm (Levothyroxine Sodium)',
    nameConfidence: 0.97,
    strength: '50 mcg',
    strengthConfidence: 0.96,
    dose: '1 tablet',
    doseConfidence: 0.98,
    frequency: 'Once daily (Early Morning)',
    frequencyConfidence: 0.95,
    duration: '90 days',
    durationConfidence: 0.92,
    instructions: 'Take with plain water 45 mins before tea/coffee/breakfast',
    instructionsConfidence: 0.91,
    isConfirmed: true,
    setReminder: true,
    plainLanguageExplanation:
      'Restores healthy thyroid hormone levels to alleviate fatigue, sluggish metabolism, brain fog, and weight fluctuations.',
    category: 'Endocrinology / Thyroid Hormone',
    potentialInteractions: ['Wait 4 hours before taking Calcium or Iron tablets.'],
  },
  {
    id: 'conf-med-2',
    document_id: 'doc-1',
    name: 'D-Rise (Cholecalciferol)',
    nameConfidence: 0.92,
    strength: '60,000 IU',
    strengthConfidence: 0.89,
    dose: '1 capsule',
    doseConfidence: 0.94,
    frequency: 'Once weekly (Sundays)',
    frequencyConfidence: 0.88,
    duration: '8 weeks',
    durationConfidence: 0.85,
    instructions: 'Take after your heaviest meal (Sunday lunch) for best absorption',
    instructionsConfidence: 0.89,
    isConfirmed: true,
    setReminder: true,
    plainLanguageExplanation:
      'High-potency Vitamin D3 to replenish depleted bone and immune reserves. Taking it with dietary fats increases absorption by up to 50%.',
    category: 'Vitamin Supplement',
  },
  {
    id: 'conf-med-3',
    document_id: 'doc-1',
    name: 'Shelcal-500 (Calcium + Vit D3)',
    nameConfidence: 0.74, // Medium confidence
    strength: '500 mg',
    strengthConfidence: 0.81,
    dose: '1 tablet',
    doseConfidence: 0.79,
    frequency: 'Once daily (Bedtime)',
    frequencyConfidence: 0.72,
    duration: '60 days',
    durationConfidence: 0.68,
    instructions: 'Take at night after food. Separate from thyroid tablet.',
    instructionsConfidence: 0.75,
    isConfirmed: false,
    setReminder: false,
    plainLanguageExplanation:
      'Calcium supplement that supports bone density and cellular muscle contraction. Must NOT be taken at the same time as thyroid hormone.',
    category: 'Mineral Supplement',
  },
  {
    id: 'conf-med-4',
    document_id: 'doc-1',
    name: 'Orofer XT (?) [Ferrous Ascorbate]',
    nameConfidence: 0.52, // Low confidence alert!
    strength: '100 mg elemental iron',
    strengthConfidence: 0.48,
    dose: '1 tablet',
    doseConfidence: 0.55,
    frequency: 'Once daily after dinner',
    frequencyConfidence: 0.58,
    duration: '30 days',
    durationConfidence: 0.60,
    instructions: 'Handwriting smudged on margin — verify if doctor prescribed iron supplement',
    instructionsConfidence: 0.45,
    isConfirmed: false,
    setReminder: false,
    plainLanguageExplanation:
      'Iron supplement with Vitamin C for correcting low ferritin and hemoglobin. Can cause harmless dark stools or mild constipation.',
    category: 'Hematinic / Iron Supplement',
    potentialInteractions: ['Avoid taking with milk, tea, or antacids.'],
  },
]

// -------------------------------------------------------------
// QUERY HELPERS
// -------------------------------------------------------------

export async function getMedicalDocuments(): Promise<DetailedDocument[]> {
  // Simulates network latency
  await new Promise((res) => setTimeout(res, 60))
  return MOCK_DOCUMENTS
}

export async function getMedicalDocumentById(id: string): Promise<DetailedDocument | null> {
  await new Promise((res) => setTimeout(res, 40))
  const doc = MOCK_DOCUMENTS.find((d) => d.id === id)
  return doc || null
}

export async function getConfirmationMedicines(documentId: string): Promise<ConfirmationMedicineItem[]> {
  await new Promise((res) => setTimeout(res, 50))
  return MOCK_CONFIRMATION_MEDICINES.map((m) => ({
    ...m,
    document_id: documentId,
  }))
}

export async function getVisitPreparationData(patientName = 'Priya Venkataraman') {
  return {
    patientName,
    date: new Date().toISOString(),
    primaryDoctor: 'Dr. Ananya Sharma (MD, Endocrinology)',
    hospital: 'Apollo Hospitals, Chennai',
    currentMedicines: [
      { name: 'Thyronorm (Levothyroxine)', dose: '50 mcg', schedule: '1 tab daily 06:30 AM (Fasting)' },
      { name: 'D-Rise 60K (Cholecalciferol)', dose: '60,000 IU', schedule: '1 cap weekly on Sundays' },
      { name: 'Shelcal-500 (Calcium + D3)', dose: '500 mg', schedule: '1 tab nightly with dinner' },
      { name: 'Metformin ER', dose: '500 mg', schedule: '1 tab with dinner (PCOS metabolic)' },
    ],
    recentLabResults: [
      { test: 'TSH (Thyroid)', value: '6.84 uIU/mL', flag: 'High', date: '28 Sep 2026', range: '0.45 - 4.50' },
      { test: 'Vitamin D 25-OH', value: '16.2 ng/mL', flag: 'Low', date: '28 Sep 2026', range: '30 - 100' },
      { test: 'Hemoglobin', value: '11.4 g/dL', flag: 'Mild Low', date: '28 Sep 2026', range: '12.0 - 15.5' },
      { test: 'HbA1c', value: '5.4%', flag: 'Optimal', date: '28 Sep 2026', range: '< 5.7%' },
      { test: 'Pelvic Ultrasound', value: 'Bilateral PCOM', flag: 'Follow-up', date: '14 Jun 2026', range: 'Normal' },
    ],
    upcomingAppointment: {
      date: 'Thursday, 12 Nov 2026 at 10:30 AM',
      doctor: 'Dr. Ananya Sharma',
      location: 'Apollo Speciality Clinic, Adyar',
      purpose: '8-week thyroid dosage review & energy check',
    },
    suggestedQuestions: [
      'My TSH was 6.84 on 50mcg. Has this dose normalized my levels or do we need an adjustment to 62.5 / 75mcg?',
      'Since I take both Thyronorm and Calcium, can you confirm the exact hours of separation you recommend?',
      'I have noticed mild afternoon fatigue and hair shedding. Could this be related to my low ferritin (19 ng/mL) alongside my thyroid?',
    ],
  }
}

// ─── Dashboard data aggregation ───────────────────────────────────────────────

export type { Medicine }

export interface DashboardData {
  greeting: string
  user: { name: string; avatar_url?: string }
  todaysMedicines: Medicine[]
  upcomingAppointments: Array<{
    id: string; doctor_name: string; specialty: string;
    location: string; appointment_date: string; notes?: string
  }>
  recentDocuments: Array<{ id: string; title: string; type: string; document_date: string; doctor_name?: string }>
  weeklyAdherence: { percentage: number; streak: number; days: Array<{ day: string; taken: boolean; missed: boolean }> }
  healthReadiness: { score: number; items: Array<{ label: string; done: boolean }> }
}

export async function getDashboardData(): Promise<DashboardData> {
  const { mockUser, mockMedicines, mockAppointments, mockDocuments, mockReminders } = await import('@/lib/db/mock-data')

  const todaysMedicines: Medicine[] = mockMedicines.slice(0, 4).map((m, i) => ({
    ...m,
    scheduled_time: ['07:00 AM', '02:00 PM', '08:00 AM', '06:00 PM'][i] ?? '08:00 AM',
    scheduledTime: ['07:00 AM', '02:00 PM', '08:00 AM', '06:00 PM'][i] ?? '08:00 AM',
    timeOfDay: ['morning', 'afternoon', 'morning', 'evening'][i] ?? 'morning',
    genericName: m.name,
    dosage: m.dose,
    status: (i === 0 ? 'taken' : 'upcoming') as 'taken' | 'upcoming',
  }))

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weeklyAdherence = {
    percentage: 82,
    streak: 4,
    days: days.map((day, i) => ({
      day,
      taken: i < 4,
      missed: i === 5,
    })),
  }

  return {
    greeting: 'Good morning',
    user: { name: mockUser.name, avatar_url: mockUser.avatar_url ?? undefined },
    todaysMedicines,
    upcomingAppointments: mockAppointments.map((a) => ({
      id: a.id,
      doctor_name: a.doctor_name,
      specialty: a.specialty ?? '',
      location: a.location ?? '',
      appointment_date: a.appointment_date,
      notes: a.notes,
    })),
    recentDocuments: mockDocuments.slice(0, 3).map((d) => ({
      id: d.id,
      title: d.title,
      type: d.type,
      document_date: d.document_date ?? '',
      doctor_name: d.doctor_name ?? undefined,
    })),
    weeklyAdherence,
    healthReadiness: {
      score: 4,
      items: [
        { label: 'Medicines taken today', done: true },
        { label: 'Upcoming appointment booked', done: true },
        { label: 'Documents up to date', done: true },
        { label: 'Trusted person set up', done: true },
        { label: 'Reminders active', done: false },
      ],
    },
  }
}

/** Optimistically update medicine status (demo mode: just returns success) */
export async function updateMedicineStatus(
  medicineId: string,
  status: 'taken' | 'snoozed' | 'skipped'
): Promise<{ success: boolean }> {
  // In production: write to reminder_logs via Supabase
  // In demo mode: return success immediately
  console.info(`[Demo] Medicine ${medicineId} marked as ${status}`)
  return { success: true }
}

/** Reset all demo data stored in localStorage */
export function resetLocalDemoData(): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem('her_turn_demo_mode')
      window.localStorage.removeItem('her_turn_demo_state')
    } catch (e) {
      console.warn('Failed to reset demo data from storage', e)
    }
  }
}
