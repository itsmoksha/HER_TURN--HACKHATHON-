/**
 * HER TURN - Core Healthcare Domain TypeScript Definitions
 * 
 * Production types for users, medical documents, extractions, prescriptions,
 * reminders, appointments, trusted care network, menstrual tracking, and AI chat.
 */

export type HealthCondition =
  | 'Polycystic Ovary Syndrome (PCOS)'
  | 'Hypothyroidism'
  | 'Hyperthyroidism'
  | 'Endometriosis'
  | 'Anemia'
  | 'Gestational Diabetes'
  | 'Hypertension'
  | 'Type 2 Diabetes'
  | 'Fibroids'
  | 'Migraine'
  | string;

export interface UserProfile {
  id: string;
  user_id?: string;
  email: string;
  name: string;
  full_name?: string;
  avatar_url: string | null;
  age_range: '18-24' | '25-34' | '35-44' | '45-54' | '55+' | string;
  language: string;
  health_conditions: string[];
  created_at: string;
  updated_at?: string;
}

export type DocumentType =
  | 'prescription'
  | 'lab_report'
  | 'scan'
  | 'summary'
  | 'discharge_summary'
  | 'test_result'
  | 'vaccination'
  | 'other';

export interface ExtractedField {
  id: string;
  document_id: string;
  field_name: string;
  field_value: string;
  confidence: number;
  is_confirmed: boolean;
  user_edited_value?: string | null;
  created_at?: string;
}

export interface MedicalDocument {
  id: string;
  user_id: string;
  title: string;
  type: DocumentType;
  file_url: string;
  file_name: string;
  file_size: number;
  extracted_text: string;
  ai_summary: string;
  tags: string[];
  doctor_name: string | null;
  document_date: string;
  created_at: string;
  extracted_fields?: ExtractedField[];
}

export interface Medicine {
  id: string;
  user_id?: string;
  document_id?: string | null;
  name: string;
  strength: string;
  dose: string;
  frequency: string;
  duration?: string;
  instructions: string;
  start_date?: string;
  end_date?: string | null;
  is_confirmed?: boolean;
  plain_language_explanation?: string;
  created_at?: string;
  // Dashboard & schedule fields
  scheduled_time?: string;
  scheduledTime?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | string;
  status?: 'taken' | 'upcoming' | 'missed' | 'snoozed';
  takenAt?: string;
  genericName?: string;
  dosage?: string;
}

export type ReminderType = 'medicine' | 'appointment' | 'refill' | 'custom';

export interface Reminder {
  id: string;
  user_id: string;
  medicine_id: string | null;
  medicine_name?: string;
  type: ReminderType;
  title: string;
  scheduled_time: string; // e.g. "07:30" or "07:30:00"
  days_of_week: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  is_active: boolean;
  nextDue?: string; // ISO string for quick UI rendering
  created_at: string;
}

export type ReminderLogStatus = 'taken' | 'skipped' | 'missed' | 'pending';

export interface ReminderLog {
  id: string;
  reminder_id: string;
  user_id: string;
  scheduled_at: string;
  status: ReminderLogStatus;
  acted_at?: string | null;
  notes?: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  doctor_name: string;
  specialty: string;
  location: string;
  appointment_date: string; // ISO timestamp
  notes: string;
  document_ids: string[];
  created_at: string;
}

export type TrustedPersonStatus = 'pending' | 'active' | 'revoked';

export interface TrustedPerson {
  id: string;
  user_id: string;
  name: string;
  trusted_name?: string;
  relation: string;
  email: string;
  invite_token?: string;
  status: TrustedPersonStatus;
  permissions: string[]; // ['appointments', 'medicines', 'documents']
  created_at: string;
}

export interface AccessPermission {
  id: string;
  trusted_person_id: string;
  user_id: string;
  resource_type: 'appointments' | 'medicines' | 'documents' | 'all';
  resource_ids: string[];
  can_edit: boolean;
  created_at: string;
}

export interface AccessLog {
  id: string;
  user_id: string;
  trusted_person_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  accessed_at: string;
}

export type ChatRole = 'user' | 'assistant' | 'system';
export type TriageLevel =
  | 'normal'
  | 'caution'
  | 'urgent'
  | 'self-care'
  | 'see-doctor'
  | 'seek-care-now';

export interface Citation {
  document_id: string;
  title: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  role: ChatRole;
  content: string;
  citations: Citation[] | null;
  triage_level: TriageLevel;
  safety_flagged: boolean;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export type FlowLevel = 'light' | 'medium' | 'heavy' | 'spotting';

export interface CycleLog {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  flow_level: FlowLevel;
  symptoms: string[];
  notes: string;
  created_at?: string;
}

export interface SymptomLog {
  id: string;
  user_id: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  notes: string;
  logged_at: string;
}

export interface ConsentRecord {
  id: string;
  user_id: string;
  consent_type: string;
  consented_at: string;
  ip_hash: string;
  version: string;
}

export interface LabTrend {
  date: string;
  tsh: number;
  vitamin_d: number;
  t3?: number;
  t4?: number;
  hba1c?: number;
  notes?: string;
}
