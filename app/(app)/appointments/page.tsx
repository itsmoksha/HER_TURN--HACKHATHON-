'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  FileText,
  Plus,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Edit2,
  Trash2,
  X,
  Upload,
  Check,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ClipboardList
} from 'lucide-react'

export interface DocumentRef {
  id: string
  title: string
  date: string
}

export interface AppointmentItem {
  id: string
  doctorName: string
  specialty: string
  date: string // e.g. "2026-11-04"
  formattedDate: string // e.g. "Wed, 4 Nov 2026"
  time: string // e.g. "10:30 AM"
  location: string
  notes: string
  attachedDocs: string[] // Document titles or IDs
  isPast?: boolean
  prescriptionAdded?: boolean
}

const AVAILABLE_DOCS: DocumentRef[] = [
  { id: 'doc-1', title: 'Thyroid Function Test (TSH: 4.2)', date: '14 Oct 2026' },
  { id: 'doc-2', title: 'Pelvic Ultrasound (PCOS Follow-up)', date: '28 Sep 2026' },
  { id: 'doc-3', title: 'Vitamin D3 & B12 Profile', date: '14 Oct 2026' },
  { id: 'doc-4', title: 'Previous Prescription (Dr. Neha Rao)', date: '15 Aug 2026' },
]

const INITIAL_UPCOMING: AppointmentItem[] = [
  {
    id: 'apt-1',
    doctorName: 'Dr. Neha Rao',
    specialty: 'Obstetrician & Gynecologist',
    date: '2026-11-04',
    formattedDate: 'Wed, 4 Nov 2026',
    time: '10:30 AM',
    location: 'Cloudnine Hospital, Old Airport Road, Bengaluru',
    notes: 'Follow-up on cycle irregularity, ultrasound review, and discussion of inositol response.',
    attachedDocs: ['Pelvic Ultrasound (PCOS Follow-up)', 'Previous Prescription (Dr. Neha Rao)'],
    isPast: false,
  },
  {
    id: 'apt-2',
    doctorName: 'Dr. Anand Raman',
    specialty: 'Consultant Endocrinologist',
    date: '2026-11-18',
    formattedDate: 'Wed, 18 Nov 2026',
    time: '04:00 PM',
    location: 'Manipal Hospital, HAL Airport Road / Room 204',
    notes: '6-month thyroid evaluation. Review TSH 4.2 level and assess whether Levothyroxine dose should adjust from 50 mcg.',
    attachedDocs: ['Thyroid Function Test (TSH: 4.2)', 'Vitamin D3 & B12 Profile'],
    isPast: false,
  },
]

const INITIAL_PAST: AppointmentItem[] = [
  {
    id: 'apt-3',
    doctorName: 'Dr. Neha Rao',
    specialty: 'Obstetrician & Gynecologist',
    date: '2026-08-15',
    formattedDate: 'Sat, 15 Aug 2026',
    time: '11:00 AM',
    location: 'Cloudnine Hospital, Bengaluru',
    notes: 'Initiated Myo-Inositol supplement. Recommended 30-minute daily brisk walking for PCOS insulin regulation.',
    attachedDocs: ['Previous Prescription (Dr. Neha Rao)'],
    isPast: true,
    prescriptionAdded: true,
  },
  {
    id: 'apt-4',
    doctorName: 'Dr. Rajeshwari K.',
    specialty: 'Dermatologist',
    date: '2026-06-20',
    formattedDate: 'Sat, 20 Jun 2026',
    time: '02:30 PM',
    location: 'Skin & Cure Clinic, Indiranagar',
    notes: 'Hormonal acne consultation linked to PCOS. Prescribed topical azelaic acid and gentle barrier support cream.',
    attachedDocs: [],
    isPast: true,
    prescriptionAdded: true,
  },
]

export default function AppointmentsPage() {
  const [upcomingList, setUpcomingList] = useState<AppointmentItem[]>(INITIAL_UPCOMING)
  const [pastList, setPastList] = useState<AppointmentItem[]>(INITIAL_PAST)
  const [showPast, setShowPast] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [visitPrepAppointment, setVisitPrepAppointment] = useState<AppointmentItem | null>(null)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState<AppointmentItem | null>(null)

  // New Appointment Form State
  const [doctorName, setDoctorName] = useState('')
  const [specialty, setSpecialty] = useState('Gynecologist')
  const [date, setDate] = useState('2026-11-25')
  const [time, setTime] = useState('11:00 AM')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])

  const SPECIALTIES = [
    'Gynecologist',
    'Obstetrician & Gynecologist',
    'Endocrinologist',
    'General Physician',
    'Dermatologist',
    'Nutritionist / Dietitian',
    'Cardiologist',
    'Mental Health / Counselor',
    'Other Specialist',
  ]

  const handleDelete = (id: string, isPast = false) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      if (isPast) {
        setPastList(prev => prev.filter(a => a.id !== id))
      } else {
        setUpcomingList(prev => prev.filter(a => a.id !== id))
      }
    }
  }

  const toggleDocAttachment = (title: string) => {
    setSelectedDocs(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!doctorName.trim() || !location.trim()) return

    const newApt: AppointmentItem = {
      id: `apt-${Date.now()}`,
      doctorName: doctorName.trim(),
      specialty,
      date,
      formattedDate: new Date(date).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      time,
      location: location.trim(),
      notes: notes.trim() || 'General follow-up visit.',
      attachedDocs: selectedDocs,
      isPast: false,
    }

    setUpcomingList(prev => [newApt, ...prev])
    setDoctorName('')
    setLocation('')
    setNotes('')
    setSelectedDocs([])
    setShowAddModal(false)
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1 text-plum-900 dark:text-plum-300">
            <Stethoscope className="w-5 h-5 text-plum-700 dark:text-plum-300" />
            <span className="text-xs font-semibold tracking-wider uppercase font-sans">
              Care Team & Visits
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Doctor Appointments
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 font-sans">
            Prepare for visits, attach relevant diagnostic files, and log follow-up prescriptions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-plum-950 hover:bg-plum-900 text-white shadow-sm transition-all focus-ring self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Appointment
        </button>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Upcoming Visits ({upcomingList.length})
          </h2>
          <span className="text-xs text-muted-foreground">
            Syncs automatically with your trusted care circle
          </span>
        </div>

        {upcomingList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-muted/10">
            <CalendarIcon className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="font-serif text-lg font-bold text-foreground">No Upcoming Appointments</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Schedule your next visit or checkup to get proactive reminders and preparation guides.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-plum-950 text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              Schedule First Visit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcomingList.map(apt => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-plum-300 dark:hover:border-plum-800 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  {/* Top row: Specialty & Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-plum-100 text-plum-900 dark:bg-plum-950 dark:text-plum-200 border border-plum-200 dark:border-plum-800">
                      {apt.specialty}
                    </span>

                    <div className="flex items-center gap-1 text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => alert(`Edit appointment with ${apt.doctorName}`)}
                        className="p-1.5 hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                        title="Edit appointment"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(apt.id)}
                        className="p-1.5 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete appointment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Doctor & Timing */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      {apt.doctorName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1.5 font-medium text-foreground/90">
                        <CalendarIcon className="w-3.5 h-3.5 text-plum-700 dark:text-plum-300" />
                        {apt.formattedDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-plum-700 dark:text-plum-300" />
                        {apt.time}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-plum-700 dark:text-plum-300 shrink-0 mt-0.5" />
                      <span>{apt.location}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {apt.notes && (
                    <div className="p-3 rounded-xl bg-sand-100/50 dark:bg-plum-950/20 border border-sand-200 dark:border-plum-900/40 text-xs text-foreground/80">
                      <span className="font-semibold text-plum-950 dark:text-plum-200">Notes: </span>
                      {apt.notes}
                    </div>
                  )}

                  {/* Attached Documents */}
                  {apt.attachedDocs.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Attached Records ({apt.attachedDocs.length}):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {apt.attachedDocs.map((doc, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-muted/60 text-foreground border border-border"
                          >
                            <FileText className="w-3 h-3 text-plum-700" />
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={() => setVisitPrepAppointment(apt)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-soft/20 text-plum-950 dark:text-rose-200 hover:bg-rose-soft/30 border border-rose-soft/40 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-plum-800 dark:text-rose-300" />
                    Prepare for Visit
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPrescriptionModal(apt)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Add Prescription
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments Collapsible Section */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setShowPast(!showPast)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Past Appointments & History
              </h3>
              <p className="text-xs text-muted-foreground">
                {pastList.length} previous visits on record
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span>{showPast ? 'Collapse' : 'View history'}</span>
            {showPast ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        <AnimatePresence>
          {showPast && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border px-6 py-5 space-y-4"
            >
              <div className="space-y-3">
                {pastList.map(apt => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-background transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-foreground text-base">
                          {apt.doctorName}
                        </span>
                        <span className="text-xs text-muted-foreground">• {apt.specialty}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {apt.formattedDate} at {apt.time} • {apt.location}
                      </p>
                      <p className="text-xs text-foreground/80 italic mt-0.5">
                        &quot;{apt.notes}&quot;
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      {apt.prescriptionAdded && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Prescription on File
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(apt.id, true)}
                        className="p-1.5 text-muted-foreground hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Prepare for Visit Modal */}
      <AnimatePresence>
        {visitPrepAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVisitPrepAppointment(null)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto p-6 space-y-5"
            >
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2 text-plum-900 dark:text-plum-300 mb-1">
                    <Sparkles className="w-4 h-4 text-plum-700" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Visit Prep Companion
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    Preparing for {visitPrepAppointment.doctorName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {visitPrepAppointment.specialty} • {visitPrepAppointment.formattedDate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setVisitPrepAppointment(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Suggested Questions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-plum-700" />
                  Key Questions to Ask
                </h4>
                <div className="space-y-2 text-xs">
                  {visitPrepAppointment.specialty.includes('Endo') ? (
                    <>
                      <div className="p-3 rounded-xl bg-plum-50/50 dark:bg-plum-950/30 border border-plum-200/60 text-foreground">
                        • &quot;My TSH improved from 6.8 to 4.2. Should we continue on 50 mcg Levothyroxine or aim for under 2.5?&quot;
                      </div>
                      <div className="p-3 rounded-xl bg-plum-50/50 dark:bg-plum-950/30 border border-plum-200/60 text-foreground">
                        • &quot;Could my afternoon fatigue be connected to my Vitamin D levels (28.2 ng/mL)?&quot;
                      </div>
                      <div className="p-3 rounded-xl bg-plum-50/50 dark:bg-plum-950/30 border border-plum-200/60 text-foreground">
                        • &quot;When should we retest thyroid antibodies (Anti-TPO)?&quot;
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 rounded-xl bg-plum-50/50 dark:bg-plum-950/30 border border-plum-200/60 text-foreground">
                        • &quot;My cycle length averaged 29 days this quarter. Has the Inositol supplement helped stabilize ovulation?&quot;
                      </div>
                      <div className="p-3 rounded-xl bg-plum-50/50 dark:bg-plum-950/30 border border-plum-200/60 text-foreground">
                        • &quot;Based on my latest pelvic ultrasound, are the ovarian follicle counts improving?&quot;
                      </div>
                      <div className="p-3 rounded-xl bg-plum-50/50 dark:bg-plum-950/30 border border-plum-200/60 text-foreground">
                        • &quot;Are there dietary tweaks to manage mild luteal phase bloating?&quot;
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Items to bring */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Checklist Before Leaving Home
                </h4>
                <div className="space-y-1.5 text-xs text-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Download or share attached reports directly via HER TURN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>List all current medicines & exact morning timing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Note down cycle start date: Last period was 14 days ago</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setVisitPrepAppointment(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-plum-950 hover:bg-plum-900 text-white"
                >
                  Got It, Ready for Visit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Appointment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Schedule Doctor Visit
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAppointment} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Suniti Sengupta"
                    value={doctorName}
                    onChange={e => setDoctorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Specialty
                  </label>
                  <select
                    value={specialty}
                    onChange={e => setSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {SPECIALTIES.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 11:30 AM"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Clinic / Hospital Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apollo Cradle, Koramangala or Teleconsult link"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Visit Purpose / Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Thyroid checkup, routine ultrasound discussion"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Attach Documents */}
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Attach Relevant Documents
                  </label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {AVAILABLE_DOCS.map(doc => {
                      const isAttached = selectedDocs.includes(doc.title)
                      return (
                        <div
                          key={doc.id}
                          onClick={() => toggleDocAttachment(doc.title)}
                          className={`p-2.5 rounded-xl border cursor-pointer text-xs flex items-center justify-between transition-colors ${
                            isAttached
                              ? 'bg-plum-50/60 dark:bg-plum-950/40 border-plum-300'
                              : 'bg-card border-border hover:bg-muted/40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-plum-700" />
                            <span className="font-medium text-foreground">{doc.title}</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground">{doc.date}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-plum-950 hover:bg-plum-900 text-white shadow-sm"
                  >
                    Save Appointment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Prescription After Visit Modal */}
      <AnimatePresence>
        {showPrescriptionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrescriptionModal(null)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl z-10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Add Post-Visit Prescription
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(null)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Upload prescription photo or scan from your visit with {showPrescriptionModal.doctorName}. Our OCR and Gemini AI will parse your dosages into active reminders.
              </p>

              <div className="border-2 border-dashed border-border hover:border-plum-400 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-muted/20">
                <Upload className="w-8 h-8 text-plum-700 mx-auto mb-2" />
                <p className="text-xs font-semibold text-foreground">Click to upload prescription or drag file</p>
                <p className="text-[11px] text-muted-foreground mt-1">PNG, JPG, or PDF up to 15MB</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-border hover:bg-muted"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Prescription successfully queued for AI processing!')
                    setShowPrescriptionModal(null)
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-plum-950 text-white"
                >
                  Confirm Upload
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
