'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Heart,
  Bell,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back

  // Form state
  const [name, setName] = useState('')
  const [ageRange, setAgeRange] = useState<'18-24' | '25-34' | '35-44' | '45+' | ''>('25-34')
  const [language, setLanguage] = useState<'English' | 'हिन्दी' | 'ಕನ್ನಡ'>('English')

  const [selectedConditions, setSelectedConditions] = useState<string[]>([])

  const [medicineReminders, setMedicineReminders] = useState(true)
  const [appointmentReminders, setAppointmentReminders] = useState(true)
  const [monthlyNudges, setMonthlyNudges] = useState(true)
  const [preferredTime, setPreferredTime] = useState('08:00')

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-fill name from signup draft
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const draft = localStorage.getItem('her_turn_signup_draft')
        if (draft) {
          const parsed = JSON.parse(draft)
          if (parsed.name) setName(parsed.name)
        }
      } catch {
        // Fallback gracefully
      }
    }
  }, [])

  const healthConditions = [
    { id: 'pcos', label: 'PCOS / PCOD', desc: 'Irregular cycles, hormonal balance' },
    { id: 'thyroid', label: 'Thyroid condition', desc: 'Hypothyroid, Hashimoto, TSH tracking' },
    { id: 'pregnancy', label: 'Pregnancy / Postpartum', desc: 'Trimester care, vitals, postnatal recovery' },
    { id: 'anemia', label: 'Anemia', desc: 'Iron deficiency, hemoglobin levels' },
    { id: 'diabetes', label: 'Diabetes', desc: 'HbA1c, fasting glucose, insulin management' },
    { id: 'hypertension', label: 'Hypertension', desc: 'Blood pressure monitoring' },
    { id: 'none', label: 'None / Prefer not to say', desc: 'General preventative wellness' },
  ]

  const toggleCondition = (id: string) => {
    if (id === 'none') {
      setSelectedConditions(['none'])
      return
    }
    let updated = selectedConditions.filter((c) => c !== 'none')
    if (updated.includes(id)) {
      updated = updated.filter((c) => c !== id)
    } else {
      updated = [...updated, id]
    }
    setSelectedConditions(updated)
  }

  const handleNext = () => {
    if (currentStep === 1 && !name.trim()) {
      toast.error('Please let us know what to call you.')
      return
    }
    setDirection(1)
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setDirection(-1)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleFinish = async () => {
    setIsSubmitting(true)
    try {
      const userProfile = {
        name: name.trim() || 'Priya',
        ageRange,
        language,
        conditions: selectedConditions,
        reminders: {
          medicine: medicineReminders,
          appointment: appointmentReminders,
          monthly: monthlyNudges,
          preferredTime,
        },
        onboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('her_turn_user', JSON.stringify(userProfile))
        localStorage.setItem('her_turn_onboarding_completed', 'true')
        localStorage.removeItem('her_turn_signup_draft')
      }

      toast.success('Welcome to HER TURN!', {
        description: `Personalized sanctuary created for ${name.trim() || 'you'}.`,
      })

      router.push('/dashboard')
    } catch {
      toast.error('Could not save preferences. Taking you to dashboard.')
      router.push('/dashboard')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Slide transition animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
    }),
  }

  const stepTitles = [
    'Profile',
    'Health Focus',
    'Reminders',
    'Consent',
  ]

  return (
    <div className="w-full">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4A1C40] dark:text-[#E8A0A0]">
            Step {currentStep} of 4: {stepTitles[currentStep - 1]}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {Math.round((currentStep / 4) * 100)}% Complete
          </span>
        </div>

        {/* Progress Dots / Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStep >= step
                  ? 'bg-[#4A1C40] dark:bg-[#E8A0A0]'
                  : 'bg-muted dark:bg-plum-900/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content with AnimatePresence */}
      <div className="min-h-[380px] flex flex-col justify-between">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ================= STEP 1 ================= */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1C40] dark:text-sand-100">
                  What should we call you?
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
                  Let’s set up your profile so HER TURN feels like your own safe space.
                </p>
              </div>

              {/* Name field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-1.5">
                  Your Preferred Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya or Dr. Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#4A1C40] dark:focus:ring-[#E8A0A0]"
                  />
                </div>
              </div>

              {/* Age range */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                  Age Range
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['18-24', '25-34', '35-44', '45+'] as const).map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setAgeRange(range)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        ageRange === range
                          ? 'bg-[#4A1C40] text-white border-[#4A1C40] shadow-sm'
                          : 'bg-background hover:bg-muted/50 border-border text-foreground'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Preference */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                  Language Preference for Explanations
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['English', 'हिन्दी', 'ಕನ್ನಡ'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        language === lang
                          ? 'bg-[#4A1C40] text-white border-[#4A1C40] shadow-sm'
                          : 'bg-background hover:bg-muted/50 border-border text-foreground'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 2 ================= */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-2xl font-bold text-[#4A1C40] dark:text-sand-100">
                    Tell us a little about your health
                  </h2>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    Optional
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This helps personalize your biomarkers, cycle tracking, and lab insights. You can change this anytime.
                </p>
              </div>

              {/* Checkbox Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                {healthConditions.map((cond) => {
                  const isChecked = selectedConditions.includes(cond.id)
                  return (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => toggleCondition(cond.id)}
                      className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                        isChecked
                          ? 'bg-[#F5E6D0]/40 dark:bg-plum-950/60 border-[#4A1C40] dark:border-[#E8A0A0] shadow-sm'
                          : 'bg-background hover:bg-muted/40 border-border'
                      }`}
                    >
                      <div className="pr-2">
                        <div className="text-xs font-semibold text-foreground">
                          {cond.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                          {cond.desc}
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked
                            ? 'bg-[#4A1C40] text-white border-[#4A1C40]'
                            : 'border-muted-foreground/40'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex items-center gap-2 text-[11px] text-muted-foreground">
                <Info className="w-3.5 h-3.5 shrink-0 text-[#4A1C40] dark:text-[#E8A0A0]" />
                <span>We never show invasive ads based on your conditions.</span>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 3 ================= */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-5"
            >
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#4A1C40] dark:text-sand-100">
                  Stay on top of your health
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Gentle nudges designed around your routine — never aggressive or noisy.
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {/* Medicine reminders */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background">
                  <div className="pr-3">
                    <div className="text-xs font-semibold text-foreground">
                      Medicine Reminders
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Sync reminders automatically from confirmed prescriptions
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMedicineReminders(!medicineReminders)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      medicineReminders ? 'bg-[#4A1C40] justify-end' : 'bg-muted justify-start'
                    }`}
                  >
                    <motion.div
                      layout
                      className="w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Appointment reminders */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background">
                  <div className="pr-3">
                    <div className="text-xs font-semibold text-foreground">
                      Appointment Reminders
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Upcoming doctor visits & pre-visit summary preparation
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAppointmentReminders(!appointmentReminders)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      appointmentReminders ? 'bg-[#4A1C40] justify-end' : 'bg-muted justify-start'
                    }`}
                  >
                    <motion.div
                      layout
                      className="w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Monthly checkup nudges */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background">
                  <div className="pr-3">
                    <div className="text-xs font-semibold text-foreground">
                      Monthly Checkup Nudges
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Periodic lab tests, cycle syncs & wellness reflections
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMonthlyNudges(!monthlyNudges)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      monthlyNudges ? 'bg-[#4A1C40] justify-end' : 'bg-muted justify-start'
                    }`}
                  >
                    <motion.div
                      layout
                      className="w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              </div>

              {/* Preferred Morning Reminder Time */}
              <div className="pt-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-1.5">
                  Preferred Morning Notification Time
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4A1C40]"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">Standard Morning Dose</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 4 ================= */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#4A1C40] dark:text-[#E8A0A0]" />
                  <h2 className="font-serif text-2xl font-bold text-[#4A1C40] dark:text-sand-100">
                    Consent & Privacy Shield
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Plain-language clarity on how your medical information is treated.
                </p>
              </div>

              {/* Explanatory Cards */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-start gap-3">
                  <Lock className="w-4 h-4 text-[#4A1C40] dark:text-[#E8A0A0] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">What is stored: </span>
                    <span className="text-muted-foreground">
                      Only prescriptions, lab reports, and vitals you directly snap or upload.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-start gap-3">
                  <Eye className="w-4 h-4 text-[#4A1C40] dark:text-[#E8A0A0] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Who can see it: </span>
                    <span className="text-muted-foreground">
                      Strictly you. Family or caregivers can only see categories you specifically authorize.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#4A1C40] dark:text-[#E8A0A0] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">How it is protected: </span>
                    <span className="text-muted-foreground">
                      Bank-grade 256-bit encryption in transit and at rest.
                    </span>
                  </div>
                </div>
              </div>

              {/* Highlight callout */}
              <div className="p-3.5 rounded-xl bg-[#F5E6D0]/60 dark:bg-plum-950/70 border border-[#4A1C40]/20 dark:border-plum-700 text-center">
                <p className="text-xs font-semibold text-[#4A1C40] dark:text-sand-100">
                  🛡️ &ldquo;Your data is never sold or used to train AI models.&rdquo;
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Built in strict compliance with India’s Digital Personal Data Protection (DPDP) Act.
                </p>
              </div>

              <div className="text-center">
                <a
                  href="/#privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#4A1C40] dark:text-[#E8A0A0] underline underline-offset-2 hover:opacity-80"
                >
                  Read full privacy policy & data rights
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation Buttons */}
        <div className="pt-6 border-t border-border mt-6 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="py-2.5 px-4 rounded-xl border border-border hover:bg-muted text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="py-2.5 px-6 rounded-xl bg-[#4A1C40] hover:bg-[#5f2353] text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all ml-auto"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="py-3 px-6 rounded-xl bg-[#4A1C40] hover:bg-[#5f2353] text-white text-sm font-semibold shadow-md flex items-center gap-2 transition-all ml-auto"
            >
              <CheckCircle2 className="w-4 h-4 text-[#E8A0A0]" />
              <span>I Understand & Agree</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
