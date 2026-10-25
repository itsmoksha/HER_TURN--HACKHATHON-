-- =============================================================================
-- HER TURN - Seed SQL Script
-- Persona: Priya Sharma (29y, PCOS & Hypothyroidism)
-- Seeds realistic clinical documents, confirmed medicines, reminders,
-- appointments, care network, and AI clinical assistant chat history.
-- =============================================================================

-- 1. SEED AUTH USER (Safe upsert into auth.users for Supabase local/hosted)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      invited_at,
      confirmation_token,
      confirmation_sent_at,
      recovery_token,
      recovery_sent_at,
      email_change_token_new,
      email_change,
      email_change_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      phone,
      phone_confirmed_at,
      phone_change,
      phone_change_token,
      phone_change_sent_at,
      email_change_token_current,
      email_change_confirm_status,
      banned_until,
      reauthentication_token,
      reauthentication_sent_at,
      is_sso_user,
      deleted_at
    )
    VALUES (
      '00000000-0000-4000-a000-000000000001',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'priya.sharma@example.com',
      crypt('DemoPassword123!', gen_salt('bf')),
      NOW(),
      NULL,
      '',
      NULL,
      '',
      NULL,
      '',
      '',
      NULL,
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Priya Sharma", "name": "Priya Sharma"}',
      FALSE,
      NOW(),
      NOW(),
      NULL,
      NULL,
      '',
      '',
      NULL,
      '',
      0,
      NULL,
      '',
      NULL,
      FALSE,
      NULL
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- 2. PUBLIC USERS TABLE ENTRY
INSERT INTO public.users (id, email, created_at, updated_at)
VALUES (
  '00000000-0000-4000-a000-000000000001',
  'priya.sharma@example.com',
  '2026-01-15 09:00:00+00',
  '2026-09-15 14:30:00+00'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- 3. PROFILES ENTRY (1 User Profile)
INSERT INTO public.profiles (
  id,
  user_id,
  full_name,
  age_range,
  language,
  health_conditions,
  avatar_url,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-4000-b000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  'Priya Sharma',
  '25-34',
  'English',
  '["Polycystic Ovary Syndrome (PCOS)", "Hypothyroidism", "Vitamin D Deficiency"]'::jsonb,
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
  '2026-01-15 09:00:00+00',
  '2026-09-15 14:30:00+00'
)
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  age_range = EXCLUDED.age_range,
  health_conditions = EXCLUDED.health_conditions,
  avatar_url = EXCLUDED.avatar_url;

-- 4. MEDICAL DOCUMENTS (6 Documents)
INSERT INTO public.documents (
  id,
  user_id,
  title,
  type,
  file_url,
  file_name,
  file_size,
  extracted_text,
  ai_summary,
  tags,
  doctor_name,
  document_date,
  created_at
)
VALUES
-- Document 1: Dr. Anita Rao Prescription
(
  '11111111-1111-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  'Endocrine Prescription - Levothyroxine & Metformin',
  'prescription',
  '/mock-files/prescription-dr-anita-rao-sep-2026.pdf',
  'Prescription_DrAnitaRao_15Sep2026.pdf',
  245800,
  'DR. ANITA RAO, MD (Endocrinology), DM\nFortis Memorial Research Institute, Sector 44, Gurugram\nDate: 15-09-2026\nPatient: Priya Sharma | Age: 29 | Female\nDiagnosis: Subclinical Hypothyroidism, PCOS\nRx:\n1. Tab. Levothyroxine Sodium 50 mcg - 1 tab daily empty stomach 45m before breakfast.\n2. Tab. Metformin Hydrochloride 500 mg (SR) - 1 tab twice daily with meals.',
  'Prescription renewal following your improved thyroid lab tests. Dr. Anita Rao adjusted your management plan: continue Levothyroxine 50mcg strictly on an empty stomach every morning, and continue Metformin 500mg twice daily with meals to stabilize insulin levels and support ovarian health.',
  '["Thyroid", "PCOS", "Endocrinology", "Prescription", "Active"]'::jsonb,
  'Dr. Anita Rao',
  '2026-09-15',
  '2026-09-15 11:45:00+00'
),
-- Document 2: Thyrocare Lab Report (September 2026)
(
  '11111111-1111-4000-a000-000000000002',
  '00000000-0000-4000-a000-000000000001',
  'Comprehensive Metabolic & Thyroid Panel (Thyrocare)',
  'lab_report',
  '/mock-files/thyrocare-blood-panel-sep-2026.pdf',
  'Thyrocare_Report_10Sep2026.pdf',
  412900,
  'THYROCARE TECHNOLOGIES LIMITED\nDate: 10-Sep-2026\nPatient: PRIYA SHARMA | Age: 29 / F\nTSH: 4.20 mIU/L (Ref: 0.40 - 4.20)\nTotal T3: 98.0 ng/dL (Ref: 70.0 - 180.0)\nTotal T4: 7.8 ug/dL (Ref: 4.8 - 11.6)\nHbA1c: 5.7 % (Ref: < 5.7 Normal)\n25-OH Vitamin D: 18.2 ng/mL (Deficient < 20)',
  'Key Findings: Your TSH has successfully dropped from 6.8 to 4.2 mIU/L, right at the borderline threshold, demonstrating that your Levothyroxine therapy is effective. Your HbA1c is 5.7% (borderline prediabetic, well targeted by Metformin and lifestyle). Your Vitamin D has climbed to 18.2 ng/mL (up from 12.0 in June), but remains clinically deficient (<20 ng/mL), warranting continued weekly high-dose supplementation.',
  '["Lab Report", "Thyroid", "HbA1c", "Vitamin D", "Blood Work"]'::jsonb,
  'Dr. Anita Rao (Referral)',
  '2026-09-10',
  '2026-09-10 19:00:00+00'
),
-- Document 3: Thyrocare Baseline Lab Report (June 2026)
(
  '11111111-1111-4000-a000-000000000003',
  '00000000-0000-4000-a000-000000000001',
  'Baseline Thyroid & Micronutrient Profile (Thyrocare)',
  'lab_report',
  '/mock-files/thyrocare-baseline-jun-2026.pdf',
  'Thyrocare_Report_15Jun2026.pdf',
  388100,
  'THYROCARE TECHNOLOGIES LIMITED\nDate: 15-Jun-2026\nPatient: PRIYA SHARMA | Age: 29 / F\nTSH: 6.82 mIU/L (ELEVATED)\nTotal T3: 84.0 ng/dL\nTotal T4: 6.2 ug/dL\n25-OH Vitamin D: 12.1 ng/mL (SEVERE DEFICIENCY)\nSerum Iron: 45.0 ug/dL\nHb: 11.2 g/dL',
  'Baseline report from June 2026 prior to thyroid medication dosage optimization. Demonstrated elevated TSH of 6.82 mIU/L accompanied by severe Vitamin D deficiency (12.1 ng/mL) and mild microcytic anemia (Hb 11.2 g/dL), leading to symptoms of chronic fatigue and cycle irregularities.',
  '["Lab Report", "Baseline", "Thyroid", "Vitamin D", "Iron"]'::jsonb,
  'Dr. Anita Rao (Referral)',
  '2026-06-15',
  '2026-06-15 18:30:00+00'
),
-- Document 4: Dr. Kavya Reddy Prescription
(
  '11111111-1111-4000-a000-000000000004',
  '00000000-0000-4000-a000-000000000001',
  'Gynecology Prescription - Micronutrient & Folate Support',
  'prescription',
  '/mock-files/prescription-dr-kavya-reddy-aug-2026.pdf',
  'Prescription_DrKavyaReddy_20Aug2026.pdf',
  215400,
  'DR. KAVYA REDDY, MBBS, MS (OBG)\nApollo Cradle & Children''s Hospital, Koramangala\nDate: 20-08-2026\nPatient: Priya Sharma | Age: 29 | Female\nRx:\n1. Tab. Folic Acid 5 mg - 1 tab daily after breakfast.\n2. Cap. Cholecalciferol (Vit D3) 60,000 IU - 1 cap once weekly on Sundays with milk.\n3. Tab. Ferrous Ascorbate + Folic Acid - 1 tab daily at 9:00 PM with water.',
  'Prescription from Dr. Kavya Reddy focusing on nutritional optimization for PCOS symptom control and mild anemia correction: Folic acid 5mg daily, high-dose Vitamin D3 60k IU weekly, and iron supplementation in the evenings. Advised clear timing rules to avoid absorption interference.',
  '["Gynecology", "Prescription", "PCOS", "Supplements", "Vitamins"]'::jsonb,
  'Dr. Kavya Reddy',
  '2026-08-20',
  '2026-08-20 16:15:00+00'
),
-- Document 5: Ultrasound Scan Report
(
  '11111111-1111-4000-a000-000000000005',
  '00000000-0000-4000-a000-000000000001',
  'Pelvic & Transvaginal Ultrasound Assessment',
  'scan',
  '/mock-files/pelvic-ultrasound-jul-2026.pdf',
  'USG_Pelvis_PriyaSharma_05Jul2026.pdf',
  524000,
  'DEPARTMENT OF ULTRASONOGRAPHY\nCity Diagnostic Imaging Center\nDate: 05-July-2026\nPatient: PRIYA SHARMA | Age: 29\nUterus: Normal anteverted, 7.6 x 3.8 x 4.2 cm. Endometrial thickness 6.8 mm.\nRight Ovary: 11.4 cc with >12 peripheral small follicles ("string of pearls").\nLeft Ovary: 10.8 cc with >12 peripheral follicles.\nImpression: Bilateral Polycystic Ovarian Morphology (PCOM).',
  'Ultrasound confirmed Bilateral Polycystic Ovarian Morphology (enlarged ovaries with classic peripheral "string-of-pearls" follicles). Uterine structure and endometrial lining are healthy and within normal limits with no cysts or fibroids detected.',
  '["Ultrasound", "PCOS", "Pelvis", "Gynecology", "Radiology"]'::jsonb,
  'Dr. S. K. Mahajan',
  '2026-07-05',
  '2026-07-05 14:00:00+00'
),
-- Document 6: Annual Checkup Summary
(
  '11111111-1111-4000-a000-000000000006',
  '00000000-0000-4000-a000-000000000001',
  'Annual Executive Health Checkup Summary',
  'summary',
  '/mock-files/annual-health-checkup-may-2026.pdf',
  'Annual_Health_Summary_May2026.pdf',
  310500,
  'MAX HEALTHCARE INSTITUTE\nDate: 01-May-2026\nPatient: Priya Sharma | Age: 29 | Height: 162 cm | Weight: 68.8 kg | BMI: 26.2\nBP: 118/76 mmHg | Resting Pulse: 72 bpm\nVitals normal. Advised hormonal workup for chronic fatigue and oligomenorrhea.',
  'Annual wellness screening establishing clean cardiovascular and vital baseline (BP 118/76). Flagged desk-related sedentary patterns, BMI 26.2, and persistent lethargy, which initiated the targeted hormonal investigations leading to PCOS and thyroid care management.',
  '["Annual Checkup", "Wellness", "Vitals", "Preventative Care"]'::jsonb,
  'Dr. Vivek Mehra',
  '2026-05-01',
  '2026-05-01 15:20:00+00'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  ai_summary = EXCLUDED.ai_summary;

-- 5. MEDICINES (5 Confirmed Prescribed Medicines)
INSERT INTO public.medicines (
  id,
  user_id,
  document_id,
  name,
  strength,
  dose,
  frequency,
  duration,
  instructions,
  start_date,
  end_date,
  is_confirmed,
  plain_language_explanation,
  created_at
)
VALUES
(
  '22222222-2222-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  '11111111-1111-4000-a000-000000000001',
  'Levothyroxine Sodium',
  '50 mcg',
  '1 tablet',
  'Once daily (Empty Stomach)',
  'Ongoing (90-day renewal cycle)',
  'Take early morning with a full glass of water, 45 minutes before breakfast or tea/coffee.',
  '2026-06-20',
  NULL,
  TRUE,
  'Replaces the thyroid hormone your body is underproducing. Taking it strictly on an empty stomach ensures your digestive tract absorbs the full therapeutic dose.',
  '2026-06-20 08:00:00+00'
),
(
  '22222222-2222-4000-a000-000000000002',
  '00000000-0000-4000-a000-000000000001',
  '11111111-1111-4000-a000-000000000001',
  'Metformin Hydrochloride (Sustained Release)',
  '500 mg',
  '1 tablet twice daily',
  'Twice daily (With meals)',
  'Ongoing (90-day renewal cycle)',
  'Take during or immediately following breakfast and dinner with a glass of water.',
  '2026-07-10',
  NULL,
  TRUE,
  'Improves insulin sensitivity, helping your cells use glucose properly. This lowers circulating androgen levels in PCOS, fostering more predictable menstrual cycles and metabolic stability.',
  '2026-07-10 09:00:00+00'
),
(
  '22222222-2222-4000-a000-000000000003',
  '00000000-0000-4000-a000-000000000001',
  '11111111-1111-4000-a000-000000000004',
  'Folic Acid (Vitamin B9)',
  '5 mg',
  '1 tablet daily',
  'Once daily (Morning)',
  '90 days',
  'Take once daily after morning meal.',
  '2026-08-21',
  '2026-11-20',
  TRUE,
  'Supports healthy cell renewal, reduces homocysteine levels, and promotes optimal ovarian function.',
  '2026-08-21 09:30:00+00'
),
(
  '22222222-2222-4000-a000-000000000004',
  '00000000-0000-4000-a000-000000000001',
  '11111111-1111-4000-a000-000000000004',
  'Cholecalciferol (Vitamin D3)',
  '60,000 IU',
  '1 capsule weekly',
  'Once weekly (Sundays)',
  '8 weeks loading phase, then monthly',
  'Take every Sunday morning with milk or a meal containing dietary fats.',
  '2026-08-24',
  '2026-10-26',
  TRUE,
  'A high-potency weekly dose formulated to replenish critically low Vitamin D levels, critical for bone strength, mood, and immune system equilibrium.',
  '2026-08-24 10:00:00+00'
),
(
  '22222222-2222-4000-a000-000000000005',
  '00000000-0000-4000-a000-000000000001',
  '11111111-1111-4000-a000-000000000004',
  'Ferrous Ascorbate + Folic Acid',
  '100 mg elemental iron',
  '1 tablet daily',
  'Once daily (Evening)',
  '60 days',
  'Take at night before bed with water or citrus juice. Avoid taking near tea, coffee, or dairy.',
  '2026-08-21',
  '2026-10-20',
  TRUE,
  'Restores depleted iron stores and raises hemoglobin to overcome fatigue and brain fog caused by mild anemia.',
  '2026-08-21 21:00:00+00'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  instructions = EXCLUDED.instructions;

-- 6. REMINDERS (5+ Reminders with times matching prescription instructions)
INSERT INTO public.reminders (
  id,
  user_id,
  medicine_id,
  type,
  title,
  scheduled_time,
  days_of_week,
  is_active,
  created_at
)
VALUES
(
  '33333333-3333-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  '22222222-2222-4000-a000-000000000001',
  'medicine',
  'Morning Thyroid Dose (Empty Stomach)',
  '07:00:00',
  '["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]'::jsonb,
  TRUE,
  '2026-06-20 08:05:00+00'
),
(
  '33333333-3333-4000-a000-000000000002',
  '00000000-0000-4000-a000-000000000001',
  '22222222-2222-4000-a000-000000000002',
  'medicine',
  'Metformin with Breakfast',
  '08:30:00',
  '["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]'::jsonb,
  TRUE,
  '2026-07-10 09:10:00+00'
),
(
  '33333333-3333-4000-a000-000000000003',
  '00000000-0000-4000-a000-000000000003',
  'medicine',
  'Folic Acid with Breakfast',
  '09:00:00',
  '["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]'::jsonb,
  TRUE,
  '2026-08-21 09:35:00+00'
),
(
  '33333333-3333-4000-a000-000000000004',
  '00000000-0000-4000-a000-000000000002',
  'medicine',
  'Metformin with Dinner',
  '20:30:00',
  '["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]'::jsonb,
  TRUE,
  '2026-07-10 09:15:00+00'
),
(
  '33333333-3333-4000-a000-000000000005',
  '00000000-0000-4000-a000-000000000005',
  'medicine',
  'Evening Iron Dose (Water only)',
  '21:30:00',
  '["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]'::jsonb,
  TRUE,
  '2026-08-21 21:05:00+00'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  scheduled_time = EXCLUDED.scheduled_time;

-- 7. APPOINTMENTS (2 Clinical Appointments)
INSERT INTO public.appointments (
  id,
  user_id,
  doctor_name,
  specialty,
  location,
  appointment_date,
  notes,
  document_ids,
  created_at
)
VALUES
(
  '44444444-4444-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  'Dr. Anita Rao',
  'Endocrinologist',
  'Fortis Memorial Research Institute, Sector 44, Gurugram (Room 304)',
  '2026-11-05 10:30:00+00',
  'Thyroid follow-up and review of September Thyrocare lab panel. Discuss whether to maintain Levothyroxine 50mcg or adjust.',
  '["11111111-1111-4000-a000-000000000001", "11111111-1111-4000-a000-000000000002"]'::jsonb,
  '2026-09-15 12:00:00+00'
),
(
  '44444444-4444-4000-a000-000000000002',
  '00000000-0000-4000-a000-000000000001',
  'Dr. Kavya Reddy',
  'Gynecologist',
  'Apollo Cradle & Children''s Hospital, Koramangala, Bengaluru',
  '2026-11-18 14:00:00+00',
  '3-month PCOS clinical review. Evaluate menstrual frequency post-lifestyle modifications, Metformin tolerance, and repeat pelvic ultrasound findings.',
  '["11111111-1111-4000-a000-000000000004", "11111111-1111-4000-a000-000000000005"]'::jsonb,
  '2026-08-20 17:00:00+00'
)
ON CONFLICT (id) DO UPDATE SET
  doctor_name = EXCLUDED.doctor_name,
  appointment_date = EXCLUDED.appointment_date;

-- 8. TRUSTED PEOPLE & ACCESS PERMISSIONS (1 Trusted Person: Sunita Sharma / Maa)
INSERT INTO public.trusted_people (
  id,
  user_id,
  trusted_name,
  relation,
  email,
  invite_token,
  status,
  created_at
)
VALUES (
  '55555555-5555-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  'Sunita Sharma (Maa)',
  'Mother',
  'sunita.sharma@example.com',
  'tok_care_sunita_mother_2026',
  'active',
  '2026-07-01 10:00:00+00'
)
ON CONFLICT (id) DO UPDATE SET
  trusted_name = EXCLUDED.trusted_name,
  status = EXCLUDED.status;

INSERT INTO public.access_permissions (
  id,
  trusted_person_id,
  user_id,
  resource_type,
  resource_ids,
  can_edit,
  created_at
)
VALUES
(
  gen_random_uuid(),
  '55555555-5555-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  'appointments',
  '[]'::jsonb,
  FALSE,
  '2026-07-01 10:05:00+00'
),
(
  gen_random_uuid(),
  '55555555-5555-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  'medicines',
  '[]'::jsonb,
  FALSE,
  '2026-07-01 10:05:00+00'
);

-- 9. CHAT SESSIONS & MESSAGES (1 Session, 4 Messages on TSH Results)
INSERT INTO public.chat_sessions (
  id,
  user_id,
  title,
  created_at
)
VALUES (
  '66666666-6666-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  'Understanding My Thyroid & Vitamin D Results',
  '2026-09-12 10:14:00+00'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.chat_messages (
  id,
  session_id,
  user_id,
  role,
  content,
  citations,
  triage_level,
  safety_flagged,
  created_at
)
VALUES
(
  '77777777-7777-4000-a000-000000000001',
  '66666666-6666-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  'user',
  'Hi! Can you explain what my latest TSH level of 4.2 means compared to my last test in June?',
  NULL,
  'normal',
  FALSE,
  '2026-09-12 10:14:22+00'
),
(
  '77777777-7777-4000-a000-000000000002',
  '66666666-6666-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  'assistant',
  'Hello Priya! Looking at your latest lab report from Thyrocare dated September 10, 2026, your TSH is currently **4.20 mIU/L**.\n\nThis is a noticeable improvement compared to your June 15, 2026 test, when your TSH was **6.82 mIU/L**.\n\n**What this means:**\n- When TSH is high, the brain is signaling harder for the thyroid to work. A drop toward normal indicates that your **Levothyroxine (50 mcg)** is being absorbed and restoring balance.\n- While standard laboratory normal ranges top out between 4.0 and 4.2 mIU/L, many endocrinologists prefer a tighter target (between 1.0 and 2.5 mIU/L) for optimal reproductive vitality.\n- Dr. Anita Rao will assess whether your current 50 mcg dose is sufficient at your upcoming visit on **November 5, 2026**.\n\nAre you continuing to take your Levothyroxine strictly on an empty stomach with plain water?',
  '[{"document_id": "11111111-1111-4000-a000-000000000002", "title": "Thyrocare Report (10-Sep-2026)", "snippet": "Thyroid Stimulating Hormone (TSH): 4.20 mIU/L. Reference range: 0.40 - 4.20"}]'::jsonb,
  'normal',
  FALSE,
  '2026-09-12 10:14:48+00'
),
(
  '77777777-7777-4000-a000-000000000003',
  '66666666-6666-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  'user',
  'Yes, I take it at 7:00 AM every single morning. But why is my Vitamin D still only 18.2?',
  NULL,
  'normal',
  FALSE,
  '2026-09-12 10:16:05+00'
),
(
  '77777777-7777-4000-a000-000000000004',
  '66666666-6666-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  'assistant',
  'That discipline with your 7:00 AM routine makes a huge clinical difference — keep that up!\n\nRegarding your Vitamin D:\n- In June, your level was **12.1 ng/mL** (severe deficiency).\n- By September 10, it rose to **18.2 ng/mL**.\n\nWhile 18.2 ng/mL is still clinically deficient (< 20 ng/mL), it proves your weekly **60,000 IU Cholecalciferol** is replenishing your stores. Because Vitamin D is a fat-soluble hormone stored deep in adipose tissue, rebuilding baseline reserves can take 8 to 12 weeks of consistent intake.\n\n**Practical Tips:**\n1. Always take your Sunday 60k capsule with your heaviest meal or with whole milk/yogurt, as dietary fat enhances absorption by up to 30%.\n2. Ensure you do not take iron tablets or antacids in the same hour.',
  '[{"document_id": "11111111-1111-4000-a000-000000000002", "title": "Thyrocare Report (10-Sep-2026)", "snippet": "25-Hydroxy Vitamin D: 18.2 ng/mL. Reference: < 20 Deficient, > 30 Sufficient"}]'::jsonb,
  'normal',
  FALSE,
  '2026-09-12 10:16:39+00'
)
ON CONFLICT (id) DO NOTHING;

-- 10. MENSTRUAL CYCLE LOGS (Last 3 Months)
INSERT INTO public.cycle_logs (
  id,
  user_id,
  start_date,
  end_date,
  flow_level,
  symptoms,
  notes,
  created_at
)
VALUES
(
  '88888888-8888-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  '2026-08-02',
  '2026-08-07',
  'medium',
  '["Lower back cramps", "Bloating", "Fatigue", "Acne flare on chin"]'::jsonb,
  'Cycle length was 41 days. Flow was heaviest on Day 2 and 3.',
  '2026-08-07 12:00:00+00'
),
(
  '88888888-8888-4000-a000-000000000002',
  '00000000-0000-4000-a000-000000000001',
  '2026-09-06',
  '2026-09-11',
  'light',
  '["Mild mood fluctuations", "Breast tenderness", "Headache"]'::jsonb,
  'Cycle length improved to 35 days! Significantly less cramping compared to August.',
  '2026-09-11 12:00:00+00'
),
(
  '88888888-8888-4000-a000-000000000003',
  '00000000-0000-4000-a000-000000000001',
  '2026-10-12',
  '2026-10-17',
  'medium',
  '["Mild pelvic discomfort", "Afternoon tiredness"]'::jsonb,
  'Cycle length steady at 36 days. Much better energy throughout cycle.',
  '2026-10-17 12:00:00+00'
)
ON CONFLICT (id) DO NOTHING;
