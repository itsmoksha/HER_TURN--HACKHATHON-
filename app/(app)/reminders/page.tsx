'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Flame, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Pill, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Stethoscope, 
  ShieldCheck, 
  X,
  BellRing
} from 'lucide-react'
import { ReminderCard, ReminderItem } from '@/components/reminders/reminder-card'

interface ScreeningNudge {
  id: string
  title: string
  statusText: string
  dueBadge: string
  badgeVariant: 'warning' | 'info' | 'success' | 'urgent'
  specialty: string
  description: string
}

// Initial reminders for Priya Sharma (29, PCOS & Hypothyroidism)
const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    medicineName: 'Levothyroxine',
    dose: '50 mcg',
    instructions: 'Take 30 mins before breakfast with water',
    scheduledTime: '07:00 AM',
    status: 'taken',
    medicineCategory: 'Thyroid',
    lastTakenAt: '06:55 AM',
  },
  {
    id: 'rem-2',
    medicineName: 'Metformin SR',
    dose: '500 mg',
    instructions: 'Take immediately after lunch',
    scheduledTime: '01:30 PM',
    status: 'upcoming',
    medicineCategory: 'PCOS / Insulin Sensitizer',
  },
  {
    id: 'rem-3',
    medicineName: 'Vitamin D3 (Cholecalciferol)',
    dose: '60,000 IU',
    instructions: 'Weekly dose with a fatty meal or milk',
    scheduledTime: '02:00 PM',
    status: 'upcoming',
    medicineCategory: 'Bone & Immune Health',
  },
  {
    id: 'rem-4',
    medicineName: 'Myo-Inositol & D-Chiro Inositol',
    dose: '2000 mg / 50 mg',
    instructions: 'Dissolve in water, drink after dinner',
    scheduledTime: '08:30 PM',
    status: 'upcoming',
    medicineCategory: 'PCOS / Ovulatory Support',
  },
]

const SCREENING_NUDGES: ScreeningNudge[] = [
  {
    id: 'nudge-1',
    title: 'Thyroid Function Test (TSH, Free T4)',
    statusText: 'Crucial for Priya: every 6 months to calibrate Levothyroxine dose',
    dueBadge: 'Due in 2 weeks',
    badgeVariant: 'urgent',
    specialty: 'Endocrinologist',
    description: 'Last tested at 4.2 mIU/L. Keep monitoring progress towards < 2.5 goal.',
  },
  {
    id: 'nudge-2',
    title: 'Vitamin D3 Retest',
    statusText: 'Monitoring response to 8-week weekly supplementation',
    dueBadge: 'Due next month',
    badgeVariant: 'warning',
    specialty: 'General Physician',
    description: 'Target level is > 30 ng/mL. Currently at 28.2 ng/mL.',
  },
  {
    id: 'nudge-3',
    title: 'Comprehensive Annual Well-Woman Checkup',
    statusText: 'Last completed: 6 months ago (April 2026)',
    dueBadge: 'Due in 6 months',
    badgeVariant: 'info',
    specialty: 'Gynecologist',
    description: 'Includes blood pressure, lipid panel, fasting insulin, and pelvic health.',
  },
  {
    id: 'nudge-4',
    title: 'Cervical Cancer Screening (Pap Smear)',
    statusText: 'Last test normal. Recommended every 3 years for age 29',
    dueBadge: 'Due in 2 years',
    badgeVariant: 'success',
    specialty: 'Gynecologist',
    description: 'Routine cervical cytology. Up to date.',
  },
  {
    id: 'nudge-5',
    title: 'Clinical Breast Examination & Monthly Self-Check',
    statusText: 'Self-check recommended monthly post-menstruation',
    dueBadge: 'Monthly routine',
    badgeVariant: 'info',
    specialty: 'Self-Care / Clinical',
    description: 'Routine screening for age 29. Mammography begins at age 40 or upon risk indication.',
  },
]

export default function RemindersPage() {
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS)
  const [showAddModal, setShowAddModal] = useState(false)
  
  // New Reminder Form State
  const [newMedName, setNewMedName] = useState('')
  const [newDose, setNewDose] = useState('')
  const [newTime, setNewTime] = useState('08:00 AM')
  const [newInstructions, setNewInstructions] = useState('')

  // Calendar State (October 2026)
  // Mock adherence status for 31 days of October
  // 1-18: green, 19: amber, 20-24: green, 25: today (in progress), 26-31: future
  const daysInMonth = 31
  const todayDate = 25

  const getDayAdherence = (day: number) => {
    if (day > todayDate) return 'future'
    if (day === 19) return 'partial' // amber
    if (day === 12) return 'missed' // red
    if (day === todayDate) return 'today' // today
    return 'complete' // green
  }

  const handleMarkTaken = (id: string) => {
    setReminders(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'taken' } : item))
    )
  }

  const handleSnooze = (id: string, minutes: number) => {
    setReminders(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: 'snoozed',
              snoozedUntil: `Snoozed (${minutes}m)`,
            }
          : item
      )
    )
  }

  const handleSkip = (id: string) => {
    setReminders(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'skipped' } : item))
    )
  }

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMedName.trim() || !newDose.trim()) return

    const newReminder: ReminderItem = {
      id: `rem-${Date.now()}`,
      medicineName: newMedName.trim(),
      dose: newDose.trim(),
      scheduledTime: newTime,
      instructions: newInstructions.trim() || 'Take with water',
      status: 'upcoming',
      medicineCategory: 'Custom',
    }

    setReminders(prev => [...prev, newReminder])
    setNewMedName('')
    setNewDose('')
    setNewInstructions('')
    setShowAddModal(false)
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1 text-plum-900 dark:text-plum-300">
            <BellRing className="w-5 h-5 text-plum-700 dark:text-plum-300" />
            <span className="text-xs font-semibold tracking-wider uppercase font-sans">
              Daily Wellness Protocol
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Reminders & Medicines
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 font-sans">
            Personalized schedule, streak tracking, and preventative checkup nudges.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-plum-950 hover:bg-plum-900 text-white shadow-sm transition-all focus-ring self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Custom Reminder
        </button>
      </div>

      {/* Main Grid: Today's Schedule on Left, Adherence Calendar on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Today's Schedule (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Today&apos;s Schedule
              </h2>
              <p className="text-xs text-muted-foreground">
                Sunday, 25 October 2026 • 4 doses planned
              </p>
            </div>

            {/* Quick stats counter */}
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {reminders.filter(r => r.status === 'taken').length} of {reminders.length} taken
              </span>
            </div>
          </div>

          {/* List of Reminder Cards */}
          <div className="space-y-3.5">
            {reminders.map(reminder => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onMarkTaken={handleMarkTaken}
                onSnooze={handleSnooze}
                onSkip={handleSkip}
              />
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-sand-100/60 dark:bg-plum-950/20 border border-sand-200 dark:border-plum-900/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-plum-900 dark:text-plum-300 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
              <strong>Gentle Care Reminder:</strong> Levothyroxine absorbs best when taken on an empty stomach with a full glass of water. Wait 30–60 minutes before taking morning tea, coffee, or calcium supplements.
            </p>
          </div>
        </div>

        {/* Right Column: Adherence Calendar & Streak (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-5">
            {/* Header & Streak */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Medicine Adherence
                </h3>
                <p className="text-xs text-muted-foreground">October 2026</p>
              </div>

              {/* Encouraging Streak Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-plum-950 dark:bg-plum-900/50 dark:text-rose-200 border border-rose-200/80 dark:border-plum-800 shadow-sm">
                <span className="text-base">🌸</span>
                <span className="text-xs font-bold tracking-tight">7-day streak!</span>
              </div>
            </div>

            {/* Encouraging copy */}
            <p className="text-xs text-muted-foreground leading-normal">
              You&apos;re taking gentle, consistent steps for your health every single day. Keep blooming!
            </p>

            {/* Month Grid */}
            <div className="space-y-2">
              <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-muted-foreground py-1">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>

              {/* Day dots */}
              <div className="grid grid-cols-7 gap-2">
                {/* 3 offset days for October 2026 starting on Thursday */}
                <div className="aspect-square opacity-0" />
                <div className="aspect-square opacity-0" />
                <div className="aspect-square opacity-0" />

                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1
                  const adherence = getDayAdherence(day)
                  const isToday = day === todayDate

                  let indicatorClass = 'bg-muted text-muted-foreground/60'
                  let dotColor = 'bg-stone-300'

                  if (adherence === 'complete') {
                    indicatorClass = 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                    dotColor = 'bg-emerald-500'
                  } else if (adherence === 'partial') {
                    indicatorClass = 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                    dotColor = 'bg-amber-500'
                  } else if (adherence === 'missed') {
                    indicatorClass = 'bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                    dotColor = 'bg-rose-500'
                  } else if (adherence === 'today') {
                    indicatorClass = 'bg-plum-100 dark:bg-plum-950 text-plum-950 dark:text-plum-100 border-2 border-plum-950 dark:border-plum-400 font-bold'
                    dotColor = 'bg-plum-600 animate-pulse'
                  }

                  return (
                    <div
                      key={day}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center relative p-1 transition-all ${indicatorClass}`}
                      title={`Day ${day}: ${adherence}`}
                    >
                      <span className="text-[11px] leading-none">{day}</span>
                      <span className={`w-1.5 h-1.5 rounded-full mt-1 ${dotColor}`} />
                      {isToday && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-plum-600" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Adherence Legend */}
            <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between text-[11px] text-muted-foreground gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>All taken</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Partially taken</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Missed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
                <span>Upcoming</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Checkup Nudges Section */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Recurring Checkup Nudges
            </h2>
            <p className="text-sm text-muted-foreground">
              Preventative health screenings recommended for your health profile
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-plum-50 dark:bg-plum-950 text-plum-900 dark:text-plum-200 border border-plum-200 dark:border-plum-800 self-start">
            Personalized for Priya (Age 29)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCREENING_NUDGES.map(nudge => {
            let badgeBg = 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200'
            if (nudge.badgeVariant === 'urgent') {
              badgeBg = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200'
            } else if (nudge.badgeVariant === 'warning') {
              badgeBg = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200'
            } else if (nudge.badgeVariant === 'info') {
              badgeBg = 'bg-plum-100 text-plum-900 dark:bg-plum-950 dark:text-plum-200 border border-plum-200'
            } else if (nudge.badgeVariant === 'success') {
              badgeBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
            }

            return (
              <div
                key={nudge.id}
                className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between hover:border-plum-300 dark:hover:border-plum-700 transition-all shadow-sm group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badgeBg}`}>
                      {nudge.dueBadge}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {nudge.specialty}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-foreground leading-snug">
                    {nudge.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {nudge.statusText}
                  </p>
                  <p className="text-[11px] text-foreground/75 bg-muted/40 p-2.5 rounded-xl border border-border/50">
                    {nudge.description}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-between">
                  <a
                    href="/appointments"
                    className="text-xs font-semibold text-plum-900 dark:text-plum-300 hover:underline flex items-center gap-1"
                  >
                    <span>Schedule visit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => alert(`Reminder set for: ${nudge.title}`)}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium px-2 py-1 rounded-lg hover:bg-muted"
                  >
                    Set reminder
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Custom Reminder Modal */}
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
              className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-plum-50 dark:bg-plum-950 text-plum-900 dark:text-plum-200 flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    Add Reminder
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddReminder} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Medicine or Supplement Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Iron & Folic Acid"
                    value={newMedName}
                    onChange={e => setNewMedName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Dose / Strength
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1 Tablet / 100mg"
                      value={newDose}
                      onChange={e => setNewDose(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Scheduled Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 09:00 AM"
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Special Instructions (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Take with warm milk at night"
                    value={newInstructions}
                    onChange={e => setNewInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
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
                    className="px-5 py-2 rounded-xl text-sm font-semibold bg-plum-950 hover:bg-plum-900 text-white shadow-sm"
                  >
                    Save Reminder
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
