/**
 * HER TURN - Demo & Mock Data Module
 * 
 * Persona: Priya Sharma, 29 years old, IT Consultant living in Bangalore / NCR.
 * Diagnosed with Polycystic Ovary Syndrome (PCOS) and Subclinical Hypothyroidism.
 * 
 * Provides rich, medically realistic demo data across all system features.
 */

import type {
  UserProfile,
  MedicalDocument,
  Medicine,
  Reminder,
  Appointment,
  TrustedPerson,
  ChatMessage,
  CycleLog,
  LabTrend,
} from '@/lib/types';

export const DEMO_USER_ID = '00000000-0000-4000-a000-000000000001';

/**
 * Demo User Profile
 */
export const mockUser: UserProfile = {
  id: DEMO_USER_ID,
  user_id: DEMO_USER_ID,
  email: 'priya.sharma@example.com',
  name: 'Priya Sharma',
  full_name: 'Priya Sharma',
  avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
  age_range: '25-34',
  language: 'English',
  health_conditions: [
    'Polycystic Ovary Syndrome (PCOS)',
    'Hypothyroidism',
    'Vitamin D Deficiency',
  ],
  created_at: '2026-01-15T09:00:00.000Z',
  updated_at: '2026-09-15T14:30:00.000Z',
};

/**
 * 6 Realistic Medical Documents
 */
export const mockDocuments: MedicalDocument[] = [
  {
    id: '11111111-1111-4000-a000-000000000001',
    user_id: DEMO_USER_ID,
    title: 'Endocrine Prescription - Levothyroxine & Metformin',
    type: 'prescription',
    file_url: '/mock-files/prescription-dr-anita-rao-sep-2026.pdf',
    file_name: 'Prescription_DrAnitaRao_15Sep2026.pdf',
    file_size: 245800,
    extracted_text: `DR. ANITA RAO, MD (Endocrinology), DM
Fortis Memorial Research Institute, Sector 44, Gurugram
Reg No: MCI-2012-39821
Date: 15-09-2026

Patient Name: Ms. Priya Sharma | Age: 29 Yrs | Gender: Female
Diagnosis: Subclinical Hypothyroidism (improving), PCOS with mild insulin resistance.

Rx:
1. Tab. Levothyroxine Sodium 50 mcg (Thyronorm / Eltroxin)
   - Dose: 1 tablet daily
   - Timing: Early morning, empty stomach with full glass of water, at least 45 minutes before breakfast or tea/coffee.
   - Duration: 90 days.

2. Tab. Metformin Hydrochloride 500 mg (SR)
   - Dose: 1 tablet twice daily
   - Timing: With meals (breakfast and dinner) to reduce gastrointestinal discomfort.
   - Duration: 90 days.

Advice:
- Repeat Thyroid Profile (TSH, FT4) after 8 weeks.
- Low glycemic index diet, regular 30 mins brisk walking.
- Review in OPD with fresh lab reports on 05-11-2026.`,
    ai_summary:
      'Prescription renewal following your improved thyroid lab tests. Dr. Anita Rao adjusted your management plan: continue Levothyroxine 50mcg strictly on an empty stomach every morning, and continue Metformin 500mg twice daily with meals to stabilize insulin levels and support ovarian health.',
    tags: ['Thyroid', 'PCOS', 'Endocrinology', 'Prescription', 'Active'],
    doctor_name: 'Dr. Anita Rao',
    document_date: '2026-09-15',
    created_at: '2026-09-15T11:45:00.000Z',
    extracted_fields: [
      {
        id: 'ef-101',
        document_id: '11111111-1111-4000-a000-000000000001',
        field_name: 'Medication 1',
        field_value: 'Levothyroxine Sodium 50mcg - 1 tab daily empty stomach',
        confidence: 0.98,
        is_confirmed: true,
      },
      {
        id: 'ef-102',
        document_id: '11111111-1111-4000-a000-000000000001',
        field_name: 'Medication 2',
        field_value: 'Metformin Hydrochloride 500mg SR - twice daily with meals',
        confidence: 0.96,
        is_confirmed: true,
      },
      {
        id: 'ef-103',
        document_id: '11111111-1111-4000-a000-000000000001',
        field_name: 'Follow Up Date',
        field_value: '2026-11-05',
        confidence: 0.94,
        is_confirmed: true,
      },
    ],
  },
  {
    id: '11111111-1111-4000-a000-000000000002',
    user_id: DEMO_USER_ID,
    title: 'Comprehensive Metabolic & Thyroid Panel (Thyrocare)',
    type: 'lab_report',
    file_url: '/mock-files/thyrocare-blood-panel-sep-2026.pdf',
    file_name: 'Thyrocare_Report_10Sep2026.pdf',
    file_size: 412900,
    extracted_text: `THYROCARE TECHNOLOGIES LIMITED
NABL & CAP Accredited Laboratory
Barcode: TCY-8829410 | Specimen: Serum & EDTA Blood
Patient: PRIYA SHARMA | Age: 29 Yrs / F | Collected: 10-Sep-2026 07:30 AM | Reported: 10-Sep-2026 06:15 PM

INVESTIGATION                    RESULT       UNIT          BIOLOGICAL REFERENCE RANGE
Thyroid Stimulating Hormone (TSH)  4.20         mIU/L         0.40 - 4.20 (Optimal: 1.0 - 2.5)
Total Triiodothyronine (T3)       98.0         ng/dL         70.0 - 180.0
Total Thyroxine (T4)             7.8          ug/dL         4.8 - 11.6
Glycated Hemoglobin (HbA1c)      5.7          %             < 5.7 Normal, 5.7 - 6.4 Prediabetes
Average Blood Glucose (eAG)      117          mg/dL         70 - 126
25-Hydroxy Vitamin D             18.2         ng/mL         < 20 Deficient, 20-30 Insufficient, > 30 Suff.
Serum Ferritin                   22.4         ng/mL         13 - 150 (Optimal > 40 for women)`,
    ai_summary:
      'Key Findings: Your TSH has successfully dropped from 6.8 to 4.2 mIU/L, right at the borderline threshold, demonstrating that your Levothyroxine therapy is effective. Your HbA1c is 5.7% (borderline prediabetic, well targeted by Metformin and lifestyle). Your Vitamin D has climbed to 18.2 ng/mL (up from 12.0 in June), but remains clinically deficient (<20 ng/mL), warranting continued weekly high-dose supplementation.',
    tags: ['Lab Report', 'Thyroid', 'HbA1c', 'Vitamin D', 'Blood Work'],
    doctor_name: 'Dr. Anita Rao (Referral)',
    document_date: '2026-09-10',
    created_at: '2026-09-10T19:00:00.000Z',
    extracted_fields: [
      {
        id: 'ef-201',
        document_id: '11111111-1111-4000-a000-000000000002',
        field_name: 'TSH',
        field_value: '4.20 mIU/L',
        confidence: 0.99,
        is_confirmed: true,
      },
      {
        id: 'ef-202',
        document_id: '11111111-1111-4000-a000-000000000002',
        field_name: 'Vitamin D (25-OH)',
        field_value: '18.2 ng/mL (Deficient)',
        confidence: 0.98,
        is_confirmed: true,
      },
      {
        id: 'ef-203',
        document_id: '11111111-1111-4000-a000-000000000002',
        field_name: 'HbA1c',
        field_value: '5.7 %',
        confidence: 0.99,
        is_confirmed: true,
      },
      {
        id: 'ef-204',
        document_id: '11111111-1111-4000-a000-000000000002',
        field_name: 'T3 / T4',
        field_value: 'T3: 98 ng/dL, T4: 7.8 ug/dL (Normal)',
        confidence: 0.97,
        is_confirmed: true,
      },
    ],
  },
  {
    id: '11111111-1111-4000-a000-000000000003',
    user_id: DEMO_USER_ID,
    title: 'Baseline Thyroid & Micronutrient Profile (Thyrocare)',
    type: 'lab_report',
    file_url: '/mock-files/thyrocare-baseline-jun-2026.pdf',
    file_name: 'Thyrocare_Report_15Jun2026.pdf',
    file_size: 388100,
    extracted_text: `THYROCARE TECHNOLOGIES LIMITED
Specimen: Serum | Date: 15-Jun-2026
Patient: PRIYA SHARMA | Age: 29 / Female

INVESTIGATION                    RESULT       UNIT          BIOLOGICAL REFERENCE RANGE
Thyroid Stimulating Hormone (TSH)  6.82         mIU/L (HIGH)  0.40 - 4.20
Total Triiodothyronine (T3)       84.0         ng/dL         70.0 - 180.0
Total Thyroxine (T4)             6.2          ug/dL         4.8 - 11.6
25-OH Vitamin D Total            12.1         ng/mL (LOW)   < 20 Deficient
Serum Iron                       45.0         ug/dL         60 - 170
Hemoglobin                       11.2         g/dL (LOW)    12.0 - 15.0
Fasting Blood Sugar              104          mg/dL         70 - 99`,
    ai_summary:
      'Baseline report from June 2026 prior to thyroid medication dosage optimization. Demonstrated elevated TSH of 6.82 mIU/L accompanied by severe Vitamin D deficiency (12.1 ng/mL) and mild microcytic anemia (Hb 11.2 g/dL), leading to symptoms of chronic fatigue and cycle irregularities.',
    tags: ['Lab Report', 'Baseline', 'Thyroid', 'Vitamin D', 'Iron'],
    doctor_name: 'Dr. Anita Rao (Referral)',
    document_date: '2026-06-15',
    created_at: '2026-06-15T18:30:00.000Z',
    extracted_fields: [
      {
        id: 'ef-301',
        document_id: '11111111-1111-4000-a000-000000000003',
        field_name: 'TSH (Baseline)',
        field_value: '6.82 mIU/L (Elevated)',
        confidence: 0.99,
        is_confirmed: true,
      },
      {
        id: 'ef-302',
        document_id: '11111111-1111-4000-a000-000000000003',
        field_name: 'Vitamin D',
        field_value: '12.1 ng/mL (Severe Deficiency)',
        confidence: 0.98,
        is_confirmed: true,
      },
    ],
  },
  {
    id: '11111111-1111-4000-a000-000000000004',
    user_id: DEMO_USER_ID,
    title: 'Gynecology Prescription - Micronutrient & Folate Support',
    type: 'prescription',
    file_url: '/mock-files/prescription-dr-kavya-reddy-aug-2026.pdf',
    file_name: 'Prescription_DrKavyaReddy_20Aug2026.pdf',
    file_size: 215400,
    extracted_text: `DR. KAVYA REDDY, MBBS, MS (OBG)
Consultant Obstetrician & Gynecologist
Apollo Cradle & Children's Hospital, Koramangala
Reg No: KMC-58219
Date: 20-08-2026

Patient: Priya Sharma | Age: 29 | Female
Chief Complaints: Oligomenorrhea (38-45 day cycle intervals), hair thinning, mild fatigue.

Rx:
1. Tab. Folic Acid 5 mg (Folvite)
   - 1 tab daily every morning after breakfast. For 90 days.
2. Cap. Cholecalciferol (Vitamin D3) 60,000 IU (Uprise D3 / D-Rise)
   - 1 capsule once weekly on Sunday mornings with a glass of milk. For 8 weeks, then monthly.
3. Tab. Ferrous Ascorbate + Folic Acid (Autrin / Orofer XT)
   - 1 tablet once daily in the evening at 9:00 PM with water. (Avoid dairy or tea/coffee within 2 hours of dose). For 60 days.

Notes:
- Continue Metformin and Levothyroxine as advised by Endocrinologist.
- Follow up in 3 months with pelvic ultrasound report review on 18-11-2026.`,
    ai_summary:
      'Prescription from Dr. Kavya Reddy focusing on nutritional optimization for PCOS symptom control and mild anemia correction: Folic acid 5mg daily, high-dose Vitamin D3 60k IU weekly, and iron supplementation in the evenings. Advised clear timing rules to avoid absorption interference.',
    tags: ['Gynecology', 'Prescription', 'PCOS', 'Supplements', 'Vitamins'],
    doctor_name: 'Dr. Kavya Reddy',
    document_date: '2026-08-20',
    created_at: '2026-08-20T16:15:00.000Z',
    extracted_fields: [
      {
        id: 'ef-401',
        document_id: '11111111-1111-4000-a000-000000000004',
        field_name: 'Folic Acid',
        field_value: '5mg daily after breakfast',
        confidence: 0.97,
        is_confirmed: true,
      },
      {
        id: 'ef-402',
        document_id: '11111111-1111-4000-a000-000000000004',
        field_name: 'Vitamin D3',
        field_value: '60000 IU weekly on Sundays with milk',
        confidence: 0.99,
        is_confirmed: true,
      },
      {
        id: 'ef-403',
        document_id: '11111111-1111-4000-a000-000000000004',
        field_name: 'Iron Supplement',
        field_value: 'Ferrous Ascorbate daily in the evening',
        confidence: 0.96,
        is_confirmed: true,
      },
    ],
  },
  {
    id: '11111111-1111-4000-a000-000000000005',
    user_id: DEMO_USER_ID,
    title: 'Pelvic & Transvaginal Ultrasound Assessment',
    type: 'scan',
    file_url: '/mock-files/pelvic-ultrasound-jul-2026.pdf',
    file_name: 'USG_Pelvis_PriyaSharma_05Jul2026.pdf',
    file_size: 524000,
    extracted_text: `DEPARTMENT OF RADIODIAGNOSIS & ULTRASONOGRAPHY
City Diagnostic Imaging & Research Center
Patient: PRIYA SHARMA | Age: 29 Yrs / Female | Ref By: Dr. Kavya Reddy
Date of Examination: 05-July-2026

ULTRASOUND OF PELVIS (TAS & TVS)
Uterus: Normal in position (anteverted). Measures 7.6 x 3.8 x 4.2 cm. Myometrial echotexture is uniform. No focal leiomyoma or adenomyosis.
Endometrial Thickness: 6.8 mm (normal proliferative phase appearance). Central echogenic line is intact.

Right Ovary: Enlarged in volume (11.4 cc). Demonstrates peripheral arrangement of >12 tiny subcentimetric follicles (2-8 mm diameter) arranged along the periphery with echogenic central stroma (classical "string of pearls" appearance).
Left Ovary: Enlarged in volume (10.8 cc). Shows similar morphological pattern with >12 peripherally oriented small follicles and dense central stroma.
Cervix: Unremarkable.
Pouch of Douglas: No free fluid or pelvic collection noted.

IMPRESSION:
Sonographic findings are characteristic of Bilateral Polycystic Ovarian Morphology (PCOM), consistent with Rotterdam Diagnostic Criteria for PCOS. Correlate clinically with endocrine/hormonal profile.`,
    ai_summary:
      'Ultrasound confirmed Bilateral Polycystic Ovarian Morphology (enlarged ovaries with classic peripheral "string-of-pearls" follicles). Uterine structure and endometrial lining are healthy and within normal limits with no cysts or fibroids detected.',
    tags: ['Ultrasound', 'PCOS', 'Pelvis', 'Gynecology', 'Radiology'],
    doctor_name: 'Dr. S. K. Mahajan (Radiologist)',
    document_date: '2026-07-05',
    created_at: '2026-07-05T14:00:00.000Z',
    extracted_fields: [
      {
        id: 'ef-501',
        document_id: '11111111-1111-4000-a000-000000000005',
        field_name: 'Impression',
        field_value: 'Bilateral Polycystic Ovarian Morphology (PCOM)',
        confidence: 0.98,
        is_confirmed: true,
      },
      {
        id: 'ef-502',
        document_id: '11111111-1111-4000-a000-000000000005',
        field_name: 'Endometrial Thickness',
        field_value: '6.8 mm (Normal)',
        confidence: 0.99,
        is_confirmed: true,
      },
      {
        id: 'ef-503',
        document_id: '11111111-1111-4000-a000-000000000005',
        field_name: 'Ovarian Volumes',
        field_value: 'Right: 11.4 cc, Left: 10.8 cc (Mildly enlarged)',
        confidence: 0.95,
        is_confirmed: true,
      },
    ],
  },
  {
    id: '11111111-1111-4000-a000-000000000006',
    user_id: DEMO_USER_ID,
    title: 'Annual Executive Health Checkup Summary',
    type: 'summary',
    file_url: '/mock-files/annual-health-checkup-may-2026.pdf',
    file_name: 'Annual_Health_Summary_May2026.pdf',
    file_size: 310500,
    extracted_text: `MAX HEALTHCARE INSTITUTE
Comprehensive Executive Health Checkup Report
Date: 01-May-2026
Patient: Priya Sharma | Age: 29 | Height: 162 cm | Weight: 68.8 kg | BMI: 26.2 (Overweight category for Asian adult standard)
Blood Pressure: 118/76 mmHg | Resting Pulse: 72 bpm | SpO2: 99% on room air

VITAL METRICS & SUMMARY:
- Cardiovascular: Normal heart sounds, ECG within normal limits (Sinus rhythm).
- Respiratory: Chest clear, normal vesicular breath sounds.
- Abdomen: Soft, non-tender, no hepatosplenomegaly.
- Visual Acuity: 6/6 corrected with spectacles.
- Lifestyle Review: High desk-job hours (8-10 hours sitting), disrupted sleep pattern (6 hours avg), afternoon fatigue slumps.

PHYSICIAN RECOMMENDATIONS:
1. Workup for thyroid dysregulation and hormonal PCOS evaluation due to persistent fatigue and irregular menses.
2. Aim for moderate weight reduction of 4-5% over next 6 months to improve insulin sensitivity.
3. Ergonomic posture adjustments and daily physical activity of minimum 7,000 steps.`,
    ai_summary:
      'Annual wellness screening establishing clean cardiovascular and vital baseline (BP 118/76). Flagged desk-related sedentary patterns, BMI 26.2, and persistent lethargy, which initiated the targeted hormonal investigations leading to PCOS and thyroid care management.',
    tags: ['Annual Checkup', 'Wellness', 'Vitals', 'Preventative Care'],
    doctor_name: 'Dr. Vivek Mehra',
    document_date: '2026-05-01',
    created_at: '2026-05-01T15:20:00.000Z',
    extracted_fields: [
      {
        id: 'ef-601',
        document_id: '11111111-1111-4000-a000-000000000006',
        field_name: 'Blood Pressure',
        field_value: '118/76 mmHg',
        confidence: 0.99,
        is_confirmed: true,
      },
      {
        id: 'ef-602',
        document_id: '11111111-1111-4000-a000-000000000006',
        field_name: 'BMI',
        field_value: '26.2 kg/m²',
        confidence: 0.99,
        is_confirmed: true,
      },
    ],
  },
];

/**
 * 5 Confirmed Medicines from Prescriptions
 */
export const mockMedicines: Medicine[] = [
  {
    id: '22222222-2222-4000-a000-000000000001',
    user_id: DEMO_USER_ID,
    document_id: '11111111-1111-4000-a000-000000000001',
    name: 'Levothyroxine Sodium',
    strength: '50 mcg',
    dose: '1 tablet',
    frequency: 'Once daily (Empty Stomach)',
    duration: 'Ongoing (90-day renewal cycle)',
    instructions: 'Take early morning with a full glass of water, 45 minutes before breakfast or tea/coffee.',
    start_date: '2026-06-20',
    end_date: null,
    is_confirmed: true,
    plain_language_explanation:
      'Replaces the thyroid hormone your body is underproducing. Taking it strictly on an empty stomach ensures your digestive tract absorbs the full therapeutic dose.',
    created_at: '2026-06-20T08:00:00.000Z',
  },
  {
    id: '22222222-2222-4000-a000-000000000002',
    user_id: DEMO_USER_ID,
    document_id: '11111111-1111-4000-a000-000000000001',
    name: 'Metformin Hydrochloride (Sustained Release)',
    strength: '500 mg',
    dose: '1 tablet twice daily',
    frequency: 'Twice daily (With meals)',
    duration: 'Ongoing (90-day renewal cycle)',
    instructions: 'Take during or immediately following breakfast and dinner with a glass of water.',
    start_date: '2026-07-10',
    end_date: null,
    is_confirmed: true,
    plain_language_explanation:
      'Improves insulin sensitivity, helping your cells use glucose properly. This lowers circulating androgen levels in PCOS, fostering more predictable menstrual cycles and metabolic stability.',
    created_at: '2026-07-10T09:00:00.000Z',
  },
  {
    id: '22222222-2222-4000-a000-000000000003',
    user_id: DEMO_USER_ID,
    document_id: '11111111-1111-4000-a000-000000000004',
    name: 'Folic Acid (Vitamin B9)',
    strength: '5 mg',
    dose: '1 tablet daily',
    frequency: 'Once daily (Morning)',
    duration: '90 days',
    instructions: 'Take once daily after morning meal.',
    start_date: '2026-08-21',
    end_date: '2026-11-20',
    is_confirmed: true,
    plain_language_explanation:
      'Supports healthy cell renewal, reduces homocysteine levels, and promotes optimal ovarian function.',
    created_at: '2026-08-21T09:30:00.000Z',
  },
  {
    id: '22222222-2222-4000-a000-000000000004',
    user_id: DEMO_USER_ID,
    document_id: '11111111-1111-4000-a000-000000000004',
    name: 'Cholecalciferol (Vitamin D3)',
    strength: '60,000 IU',
    dose: '1 capsule weekly',
    frequency: 'Once weekly (Sundays)',
    duration: '8 weeks loading phase, then monthly',
    instructions: 'Take every Sunday morning with milk or a meal containing dietary fats.',
    start_date: '2026-08-24',
    end_date: '2026-10-26',
    is_confirmed: true,
    plain_language_explanation:
      'A high-potency weekly dose formulated to replenish critically low Vitamin D levels, critical for bone strength, mood, and immune system equilibrium.',
    created_at: '2026-08-24T10:00:00.000Z',
  },
  {
    id: '22222222-2222-4000-a000-000000000005',
    user_id: DEMO_USER_ID,
    document_id: '11111111-1111-4000-a000-000000000004',
    name: 'Ferrous Ascorbate + Folic Acid',
    strength: '100 mg elemental iron',
    dose: '1 tablet daily',
    frequency: 'Once daily (Evening)',
    duration: '60 days',
    instructions: 'Take at night before bed with water or citrus juice. Avoid taking near tea, coffee, or dairy.',
    start_date: '2026-08-21',
    end_date: '2026-10-20',
    is_confirmed: true,
    plain_language_explanation:
      'Restores depleted iron stores and raises hemoglobin to overcome fatigue and brain fog caused by mild anemia.',
    created_at: '2026-08-21T21:00:00.000Z',
  },
];

/**
 * Reminders with scheduled times and next due dates
 */
export const mockReminders: Reminder[] = [
  {
    id: '33333333-3333-4000-a000-000000000001',
    user_id: DEMO_USER_ID,
    medicine_id: '22222222-2222-4000-a000-000000000001',
    medicine_name: 'Levothyroxine Sodium 50mcg',
    type: 'medicine',
    title: 'Morning Thyroid Dose (Empty Stomach)',
    scheduled_time: '07:00:00',
    days_of_week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    is_active: true,
    nextDue: '2026-10-26T07:00:00.000Z',
    created_at: '2026-06-20T08:05:00.000Z',
  },
  {
    id: '33333333-3333-4000-a000-000000000002',
    user_id: DEMO_USER_ID,
    medicine_id: '22222222-2222-4000-a000-000000000002',
    medicine_name: 'Metformin 500mg (Morning)',
    type: 'medicine',
    title: 'Metformin with Breakfast',
    scheduled_time: '08:30:00',
    days_of_week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    is_active: true,
    nextDue: '2026-10-26T08:30:00.000Z',
    created_at: '2026-07-10T09:10:00.000Z',
  },
  {
    id: '33333333-3333-4000-a000-000000000003',
    user_id: DEMO_USER_ID,
    medicine_id: '22222222-2222-4000-a000-000000000003',
    medicine_name: 'Folic Acid 5mg',
    type: 'medicine',
    title: 'Folic Acid with Breakfast',
    scheduled_time: '09:00:00',
    days_of_week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    is_active: true,
    nextDue: '2026-10-26T09:00:00.000Z',
    created_at: '2026-08-21T09:35:00.000Z',
  },
  {
    id: '33333333-3333-4000-a000-000000000004',
    user_id: DEMO_USER_ID,
    medicine_id: '22222222-2222-4000-a000-000000000002',
    medicine_name: 'Metformin 500mg (Evening)',
    type: 'medicine',
    title: 'Metformin with Dinner',
    scheduled_time: '20:30:00',
    days_of_week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    is_active: true,
    nextDue: '2026-10-26T20:30:00.000Z',
    created_at: '2026-07-10T09:15:00.000Z',
  },
  {
    id: '33333333-3333-4000-a000-000000000005',
    user_id: DEMO_USER_ID,
    medicine_id: '22222222-2222-4000-a000-000000000005',
    medicine_name: 'Ferrous Ascorbate (Iron)',
    type: 'medicine',
    title: 'Evening Iron Dose (Water only)',
    scheduled_time: '21:30:00',
    days_of_week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    is_active: true,
    nextDue: '2026-10-26T21:30:00.000Z',
    created_at: '2026-08-21T21:05:00.000Z',
  },
  {
    id: '33333333-3333-4000-a000-000000000006',
    user_id: DEMO_USER_ID,
    medicine_id: '22222222-2222-4000-a000-000000000004',
    medicine_name: 'Vitamin D3 60,000 IU',
    type: 'medicine',
    title: 'Weekly Sunday Vitamin D3 Capsule',
    scheduled_time: '10:00:00',
    days_of_week: ['Sun'],
    is_active: true,
    nextDue: '2026-11-01T10:00:00.000Z',
    created_at: '2026-08-24T10:05:00.000Z',
  },
];

/**
 * Confirmed Clinical Appointments
 */
export const mockAppointments: Appointment[] = [
  {
    id: '44444444-4444-4000-a000-000000000001',
    user_id: DEMO_USER_ID,
    doctor_name: 'Dr. Anita Rao',
    specialty: 'Endocrinologist',
    location: 'Fortis Memorial Research Institute, Sector 44, Gurugram (Room 304)',
    appointment_date: '2026-11-05T10:30:00.000Z',
    notes: 'Thyroid follow-up and review of September Thyrocare lab panel. Discuss whether to maintain Levothyroxine 50mcg or adjust.',
    document_ids: [
      '11111111-1111-4000-a000-000000000001',
      '11111111-1111-4000-a000-000000000002',
    ],
    created_at: '2026-09-15T12:00:00.000Z',
  },
  {
    id: '44444444-4444-4000-a000-000000000002',
    user_id: DEMO_USER_ID,
    doctor_name: 'Dr. Kavya Reddy',
    specialty: 'Gynecologist & Obstetrician',
    location: 'Apollo Cradle & Children\'s Hospital, Koramangala, Bengaluru',
    appointment_date: '2026-11-18T14:00:00.000Z',
    notes: '3-month PCOS clinical review. Evaluate menstrual frequency post-lifestyle modifications, Metformin tolerance, and repeat pelvic ultrasound findings.',
    document_ids: [
      '11111111-1111-4000-a000-000000000004',
      '11111111-1111-4000-a000-000000000005',
    ],
    created_at: '2026-08-20T17:00:00.000Z',
  },
];

/**
 * Trusted Care Circle Person
 */
export const mockTrustedPerson: TrustedPerson = {
  id: '55555555-5555-4000-a000-000000000001',
  user_id: DEMO_USER_ID,
  name: 'Sunita Sharma (Maa)',
  trusted_name: 'Sunita Sharma (Maa)',
  relation: 'Mother',
  email: 'sunita.sharma@example.com',
  invite_token: 'tok_care_sunita_mother_2026',
  status: 'active',
  permissions: ['appointments', 'medicines'],
  created_at: '2026-07-01T10:00:00.000Z',
};

export const mockTrustedPeople: TrustedPerson[] = [mockTrustedPerson];

/**
 * AI Healthcare Assistant Chat Messages
 */
export const mockChatHistory: ChatMessage[] = [
  {
    id: '77777777-7777-4000-a000-000000000001',
    session_id: '66666666-6666-4000-a000-000000000001',
    user_id: DEMO_USER_ID,
    role: 'user',
    content: 'Hi! Can you explain what my latest TSH level of 4.2 means compared to my last test in June?',
    citations: null,
    triage_level: 'normal',
    safety_flagged: false,
    created_at: '2026-09-12T10:14:22.000Z',
  },
  {
    id: '77777777-7777-4000-a000-000000000002',
    session_id: '66666666-6666-4000-a000-000000000001',
    user_id: DEMO_USER_ID,
    role: 'assistant',
    content:
      'Hello Priya! Looking at your latest lab report from Thyrocare dated September 10, 2026, your TSH is currently **4.20 mIU/L**. \n\nThis is a noticeable improvement compared to your June 15, 2026 test, when your TSH was **6.82 mIU/L**. \n\n**What this means:**\n- When TSH is high, the brain is signaling harder for the thyroid to work. A drop toward normal indicates that your **Levothyroxine (50 mcg)** is being absorbed and restoring balance.\n- While standard laboratory normal ranges top out between 4.0 and 4.2 mIU/L, many endocrinologists prefer a tighter target (between 1.0 and 2.5 mIU/L) for optimal reproductive vitality.\n- Dr. Anita Rao will assess whether your current 50 mcg dose is sufficient at your upcoming visit on **November 5, 2026**.\n\nAre you continuing to take your Levothyroxine strictly on an empty stomach with plain water?',
    citations: [
      {
        document_id: '11111111-1111-4000-a000-000000000002',
        title: 'Thyrocare Report (10-Sep-2026)',
        snippet: 'Thyroid Stimulating Hormone (TSH): 4.20 mIU/L. Reference range: 0.40 - 4.20',
      },
      {
        document_id: '11111111-1111-4000-a000-000000000003',
        title: 'Thyrocare Baseline (15-Jun-2026)',
        snippet: 'Thyroid Stimulating Hormone (TSH): 6.82 mIU/L (HIGH)',
      },
    ],
    triage_level: 'normal',
    safety_flagged: false,
    created_at: '2026-09-12T10:14:48.000Z',
  },
  {
    id: '77777777-7777-4000-a000-000000000003',
    session_id: '66666666-6666-4000-a000-000000000001',
    user_id: DEMO_USER_ID,
    role: 'user',
    content: 'Yes, I take it at 7:00 AM every single morning. But why is my Vitamin D still only 18.2?',
    citations: null,
    triage_level: 'normal',
    safety_flagged: false,
    created_at: '2026-09-12T10:16:05.000Z',
  },
  {
    id: '77777777-7777-4000-a000-000000000004',
    session_id: '66666666-6666-4000-a000-000000000001',
    role: 'assistant',
    content:
      'That discipline with your 7:00 AM routine makes a huge clinical difference — keep that up!\n\nRegarding your Vitamin D:\n- In June, your level was **12.1 ng/mL** (severe deficiency).\n- By September 10, it rose to **18.2 ng/mL**.\n\nWhile 18.2 ng/mL is still clinically deficient (< 20 ng/mL), it proves your weekly **60,000 IU Cholecalciferol** is replenishing your stores. Because Vitamin D is a fat-soluble hormone stored deep in adipose tissue, rebuilding baseline reserves can take 8 to 12 weeks of consistent intake.\n\n**Practical Tips:**\n1. Always take your Sunday 60k capsule with your heaviest meal or with whole milk/yogurt, as dietary fat enhances absorption by up to 30%.\n2. Ensure you do not take iron tablets or antacids in the same hour.',
    citations: [
      {
        document_id: '11111111-1111-4000-a000-000000000002',
        title: 'Thyrocare Report (10-Sep-2026)',
        snippet: '25-Hydroxy Vitamin D: 18.2 ng/mL. Reference: < 20 Deficient, > 30 Sufficient',
      },
      {
        document_id: '11111111-1111-4000-a000-000000000004',
        title: 'Dr. Kavya Reddy Prescription',
        snippet: 'Cap. Cholecalciferol 60,000 IU weekly on Sundays with milk',
      },
    ],
    triage_level: 'normal',
    safety_flagged: false,
    created_at: '2026-09-12T10:16:39.000Z',
  },
];

/**
 * Menstrual Cycle Logs (Last 3 Months)
 */
export const mockCycleLogs: CycleLog[] = [
  {
    id: '88888888-8888-4000-a000-000000000001',
    user_id: DEMO_USER_ID,
    start_date: '2026-08-02',
    end_date: '2026-08-07',
    flow_level: 'medium',
    symptoms: ['Lower back cramps', 'Bloating', 'Fatigue', 'Acne flare on chin'],
    notes: 'Cycle length was 41 days. Flow was heaviest on Day 2 and 3.',
    created_at: '2026-08-07T12:00:00.000Z',
  },
  {
    id: '88888888-8888-4000-a000-000000000002',
    user_id: DEMO_USER_ID,
    start_date: '2026-09-06',
    end_date: '2026-09-11',
    flow_level: 'light',
    symptoms: ['Mild mood fluctuations', 'Breast tenderness', 'Headache'],
    notes: 'Cycle length improved to 35 days! Significantly less cramping compared to August.',
    created_at: '2026-09-11T12:00:00.000Z',
  },
  {
    id: '88888888-8888-4000-a000-000000000003',
    user_id: DEMO_USER_ID,
    start_date: '2026-10-12',
    end_date: '2026-10-17',
    flow_level: 'medium',
    symptoms: ['Mild pelvic discomfort', 'Afternoon tiredness'],
    notes: 'Cycle length steady at 36 days. Much better energy throughout cycle.',
    created_at: '2026-10-17T12:00:00.000Z',
  },
];

/**
 * 4 Longitudinal Data Points for Charting Lab Trends (TSH & Vitamin D)
 */
export const mockLabTrends: LabTrend[] = [
  {
    date: '2025-12-10',
    tsh: 7.4,
    vitamin_d: 10.2,
    t3: 80,
    t4: 5.9,
    hba1c: 5.9,
    notes: 'Initial checkup: diagnosed subclinical hypothyroidism & deficiency',
  },
  {
    date: '2026-03-20',
    tsh: 7.1,
    vitamin_d: 11.4,
    t3: 82,
    t4: 6.0,
    hba1c: 5.8,
    notes: 'Pre-treatment tracking before initiating medication protocol',
  },
  {
    date: '2026-06-15',
    tsh: 6.8,
    vitamin_d: 12.1,
    t3: 84,
    t4: 6.2,
    hba1c: 5.8,
    notes: 'Baseline tests with Dr. Anita Rao; commenced Levothyroxine 50mcg',
  },
  {
    date: '2026-09-10',
    tsh: 4.2,
    vitamin_d: 18.2,
    t3: 98,
    t4: 7.8,
    hba1c: 5.7,
    notes: 'Notable improvement: TSH dropped to 4.2 and Vitamin D rising',
  },
];

/**
 * Aggregate Mock Data Bundle Function
 */
export function getMockData() {
  return {
    user: mockUser,
    documents: mockDocuments,
    medicines: mockMedicines,
    reminders: mockReminders,
    appointments: mockAppointments,
    trustedPerson: mockTrustedPerson,
    trustedPeople: mockTrustedPeople,
    chatHistory: mockChatHistory,
    cycleLogs: mockCycleLogs,
    labTrends: mockLabTrends,
  };
}
