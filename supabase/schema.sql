-- =============================================================================
-- HER TURN - Comprehensive Database Schema
-- Architecture: PostgreSQL on Supabase with Row Level Security (RLS)
-- Designed for Women's Health Data, OCR Prescriptions, Lab Tracking & Trusted Care Circles
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. USERS (Public shadow / extensions table for auth.users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. PROFILES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age_range TEXT,
  language TEXT DEFAULT 'English',
  health_conditions JSONB DEFAULT '[]'::jsonb,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_profiles_user_id UNIQUE (user_id)
);

-- =============================================================================
-- 3. MEDICAL DOCUMENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('prescription', 'lab_report', 'scan', 'summary', 'other')),
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT DEFAULT 0,
  extracted_text TEXT,
  ai_summary TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  doctor_name TEXT,
  document_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. EXTRACTED FIELDS (Fine-grained OCR/LLM key-value extractions)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.extracted_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_value TEXT NOT NULL,
  confidence NUMERIC(4, 3) DEFAULT 0.950,
  is_confirmed BOOLEAN DEFAULT FALSE,
  user_edited_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 5. MEDICINES (Extracted and validated prescription medications)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  strength TEXT,
  dose TEXT,
  frequency TEXT,
  duration TEXT,
  instructions TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  is_confirmed BOOLEAN DEFAULT TRUE,
  plain_language_explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 6. REMINDERS (Dosing alarms and notifications)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'medicine',
  title TEXT NOT NULL,
  scheduled_time TIME NOT NULL,
  days_of_week JSONB DEFAULT '["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 7. REMINDER LOGS (Adherence tracking: taken, skipped, missed)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID NOT NULL REFERENCES public.reminders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('taken', 'skipped', 'missed', 'pending')),
  acted_at TIMESTAMPTZ,
  notes TEXT
);

-- =============================================================================
-- 8. APPOINTMENTS (Clinical consultations & follow-ups)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_name TEXT NOT NULL,
  specialty TEXT,
  location TEXT,
  appointment_date TIMESTAMPTZ NOT NULL,
  notes TEXT,
  document_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 9. TRUSTED PEOPLE (Care Circle invitations & delegates)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.trusted_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trusted_name TEXT NOT NULL,
  relation TEXT NOT NULL,
  email TEXT NOT NULL,
  invite_token TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 10. ACCESS PERMISSIONS (Granular permissions granted to trusted delegates)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.access_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trusted_person_id UUID NOT NULL REFERENCES public.trusted_people(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('appointments', 'medicines', 'documents', 'all')),
  resource_ids JSONB DEFAULT '[]'::jsonb,
  can_edit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 11. ACCESS LOGS (Audit trail for HIPAA/data privacy compliance)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trusted_person_id UUID NOT NULL REFERENCES public.trusted_people(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 12. CHAT SESSIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 13. CHAT MESSAGES (AI Health Assistant conversations with clinical citations)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]'::jsonb,
  triage_level TEXT DEFAULT 'normal' CHECK (triage_level IN ('normal', 'caution', 'urgent')),
  safety_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 14. SYMPTOM LOGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
  severity TEXT DEFAULT 'moderate' CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 15. CYCLE LOGS (Menstrual and reproductive health tracker)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.cycle_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  flow_level TEXT DEFAULT 'medium' CHECK (flow_level IN ('light', 'medium', 'heavy', 'spotting')),
  symptoms JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 16. CONSENT RECORDS (Explicit user consent records for AI and data processing)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  consented_at TIMESTAMPTZ DEFAULT NOW(),
  ip_hash TEXT,
  version TEXT DEFAULT '1.0'
);

-- =============================================================================
-- INDEXES ON user_id AND COMMONLY QUERIED COLUMNS
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_date ON public.documents(document_date DESC);
CREATE INDEX IF NOT EXISTS idx_extracted_fields_doc_id ON public.extracted_fields(document_id);
CREATE INDEX IF NOT EXISTS idx_medicines_user_id ON public.medicines(user_id);
CREATE INDEX IF NOT EXISTS idx_medicines_document_id ON public.medicines(document_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_medicine_id ON public.reminders(medicine_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_user_id ON public.reminder_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_reminder_id ON public.reminder_logs(reminder_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_scheduled ON public.reminder_logs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date ASC);
CREATE INDEX IF NOT EXISTS idx_trusted_people_user_id ON public.trusted_people(user_id);
CREATE INDEX IF NOT EXISTS idx_trusted_people_token ON public.trusted_people(invite_token);
CREATE INDEX IF NOT EXISTS idx_access_permissions_user_id ON public.access_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_access_permissions_tp ON public.access_permissions(trusted_person_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON public.access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_user_id ON public.symptom_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_cycle_logs_user_id ON public.cycle_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_user_id ON public.consent_records(user_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict isolation: Authenticated users may ONLY read/write their own records.
-- =============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- 1. users
CREATE POLICY "Users can view and manage their own user record"
  ON public.users
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. profiles
CREATE POLICY "Users can view and manage their own profile"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. documents
CREATE POLICY "Users can view their own documents"
  ON public.documents
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. extracted_fields
CREATE POLICY "Users can view and edit fields of their documents"
  ON public.extracted_fields
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = extracted_fields.document_id AND d.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = extracted_fields.document_id AND d.user_id = auth.uid()
    )
  );

-- 5. medicines
CREATE POLICY "Users can manage their medicines"
  ON public.medicines
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. reminders
CREATE POLICY "Users can manage their reminders"
  ON public.reminders
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. reminder_logs
CREATE POLICY "Users can manage their reminder logs"
  ON public.reminder_logs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 8. appointments
CREATE POLICY "Users can manage their appointments"
  ON public.appointments
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 9. trusted_people
CREATE POLICY "Users can manage their trusted people network"
  ON public.trusted_people
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 10. access_permissions
CREATE POLICY "Users can manage permissions granted to trusted delegates"
  ON public.access_permissions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 11. access_logs
CREATE POLICY "Users can view their own access logs"
  ON public.access_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can record access logs"
  ON public.access_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 12. chat_sessions
CREATE POLICY "Users can manage their chat sessions"
  ON public.chat_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 13. chat_messages
CREATE POLICY "Users can manage their chat messages"
  ON public.chat_messages
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 14. symptom_logs
CREATE POLICY "Users can manage their symptom logs"
  ON public.symptom_logs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 15. cycle_logs
CREATE POLICY "Users can manage their cycle logs"
  ON public.cycle_logs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 16. consent_records
CREATE POLICY "Users can manage their consent records"
  ON public.consent_records
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- AUTO PROFILE TRIGGER ON NEW AUTH REGISTRATION
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (user_id, full_name, language)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'),
    'English'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
