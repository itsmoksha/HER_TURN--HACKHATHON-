'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Printer,
  Copy,
  Check,
  Calendar,
  User,
  HeartPulse,
  Pill,
  HelpCircle,
  FileText,
  MapPin,
  Clock,
  Sparkles,
  ShieldAlert
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export interface PrepareVisitModalProps {
  isOpen: boolean
  onClose: () => void
  patientName?: string
  doctorName?: string
  documentTitle?: string
}

export function PrepareVisitModal({
  isOpen,
  onClose,
  patientName = 'Priya Venkataraman',
  doctorName = 'Dr. Ananya Sharma (MD, Endocrinology)',
  documentTitle,
}: PrepareVisitModalProps) {
  const [copied, setCopied] = useState(false)

  // Current active medications
  const medicines = [
    {
      name: 'Thyronorm (Levothyroxine Sodium)',
      dose: '50 mcg',
      timing: 'Once daily — 06:30 AM on empty stomach',
      notes: 'Prescribed for mild thyroid underactivity (TSH 6.84)',
    },
    {
      name: 'D-Rise (Cholecalciferol)',
      dose: '60,000 IU',
      timing: 'Once weekly — Sundays after lunch',
      notes: 'Replenishing deficient Vitamin D (16.2 ng/mL)',
    },
    {
      name: 'Shelcal-500 (Calcium + Vit D3)',
      dose: '500 mg',
      timing: 'Once daily at bedtime',
      notes: '4-hour gap maintained from morning thyroid dose',
    },
    {
      name: 'Metformin ER',
      dose: '500 mg',
      timing: 'Once daily with dinner',
      notes: 'PCOS insulin sensitivity support',
    },
  ]

  // Recent lab test markers
  const labResults = [
    { test: 'TSH (Ultrasensitive)', value: '6.84 uIU/mL', range: '0.45 - 4.50', status: 'High', date: '28 Sep 2026' },
    { test: '25-OH Vitamin D', value: '16.2 ng/mL', range: '30.0 - 100.0', status: 'Deficient', date: '28 Sep 2026' },
    { test: 'Serum Ferritin', value: '19 ng/mL', range: '20 - 200', status: 'Borderline Low', date: '28 Sep 2026' },
    { test: 'Hemoglobin', value: '11.4 g/dL', range: '12.0 - 15.5', status: 'Mild Anemia', date: '28 Sep 2026' },
    { test: 'Pelvic Sonography', value: 'Bilateral PCOM', range: 'Normal', status: 'Follow-up', date: '14 Jun 2026' },
  ]

  // AI Generated Suggested Questions for Dr Visit
  const suggestedQuestions = [
    'My latest TSH was 6.84 on 50mcg Thyronorm. Does my dosage need adjusting or should we re-test in 6 weeks?',
    'I have been spacing my Calcium tablet by 4+ hours from my thyroid pill. Is this sufficient to prevent absorption interference?',
    'With my ferritin at 19 ng/mL and mild afternoon fatigue, would you advise starting a gentle iron supplement like Ferrous Ascorbate?',
  ]

  const upcomingAppointment = {
    date: 'Thursday, 12 Nov 2026',
    time: '10:30 AM',
    doctor: doctorName,
    location: 'Apollo Speciality Hospitals, Greams Road, Chennai',
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = () => {
    const textContent = `
HER TURN - DOCTOR VISIT PREPARATION SUMMARY
Generated for: ${patientName}
Date: ${formatDate(new Date())}
Primary Doctor: ${doctorName}
Appointment: ${upcomingAppointment.date} at ${upcomingAppointment.time} (${upcomingAppointment.location})

CURRENT MEDICATIONS:
${medicines.map((m) => `• ${m.name} (${m.dose}) - ${m.timing} [${m.notes}]`).join('\n')}

RECENT KEY LAB METRICS:
${labResults.map((l) => `• ${l.test}: ${l.value} (${l.status}) | Normal range: ${l.range} (Dated: ${l.date})`).join('\n')}

QUESTIONS TO ASK DOCTOR:
${suggestedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

CONFIDENTIAL & PERSONAL MEDICAL RECORD SUMMARY
`
    navigator.clipboard.writeText(textContent.trim()).then(() => {
      setCopied(true)
      toast.success('Summary copied to clipboard!', {
        description: 'You can paste this in WhatsApp, Notes, or email.',
      })
      setTimeout(() => setCopied(false), 2500)
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-sm print:p-0 print:bg-white print:fixed print:inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-background border border-border shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-none print:w-full"
        >
          {/* Header Bar (Hidden during print) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-plum-950 text-white shrink-0 print:hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-rose-soft" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold tracking-wide text-white">
                  Visit Prep Sheet
                </h2>
                <p className="text-xs text-rose-soft/90">
                  Concise 1-page health brief for your doctor appointment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 hover:bg-white/25 text-white transition-colors"
                title="Copy text summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-soft text-plum-950 hover:bg-white transition-colors shadow-sm"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Document Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-foreground print:p-8 print:text-black print:overflow-visible">
            {/* Printable Document Header */}
            <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl font-bold text-plum-950 dark:text-plum-200 print:text-black">
                    HER TURN
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-plum-100 text-plum-900 dark:bg-plum-950 dark:text-rose-soft print:border print:border-gray-400">
                    Clinical Visit Brief
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Confidential patient summary generated for clinical consultation
                </p>
              </div>

              <div className="text-right sm:text-right text-xs space-y-0.5">
                <p className="font-semibold text-foreground print:text-black">
                  Patient: <span className="font-bold text-sm">{patientName}</span>
                </p>
                <p className="text-muted-foreground">Date: {formatDate(new Date())}</p>
                {documentTitle && (
                  <p className="text-[11px] text-muted-foreground italic">Ref: {documentTitle}</p>
                )}
              </div>
            </div>

            {/* Upcoming Appointment Info Banner */}
            <div className="rounded-xl border border-plum-200 dark:border-plum-800 bg-plum-50/50 dark:bg-plum-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:bg-gray-50 print:border-gray-300">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-plum-900 dark:text-rose-soft">
                  <Calendar className="w-4 h-4" />
                  <span>Scheduled Appointment</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {upcomingAppointment.doctor}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {upcomingAppointment.date} at {upcomingAppointment.time}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {upcomingAppointment.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Medicines */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-serif font-bold text-plum-950 dark:text-plum-200 border-b border-border/70 pb-1.5">
                <Pill className="w-4 h-4 text-plum-700 dark:text-rose-soft" />
                <h3>Current Active Medications</h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3">
                {medicines.map((med, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl border border-border/80 bg-card/60 space-y-1 text-xs print:border-gray-300 print:bg-white"
                  >
                    <div className="flex items-center justify-between font-semibold text-foreground">
                      <span>{med.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-muted text-[11px] text-muted-foreground">
                        {med.dose}
                      </span>
                    </div>
                    <p className="text-plum-900 dark:text-rose-soft font-medium text-[11px]">
                      {med.timing}
                    </p>
                    <p className="text-muted-foreground text-[11px] leading-tight">
                      {med.notes}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Lab Results */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-serif font-bold text-plum-950 dark:text-plum-200 border-b border-border/70 pb-1.5">
                <FileText className="w-4 h-4 text-plum-700 dark:text-rose-soft" />
                <h3>Recent Laboratory Findings</h3>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border print:border-gray-300">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/70 text-muted-foreground font-semibold border-b border-border">
                      <th className="p-2.5">Biomarker / Test</th>
                      <th className="p-2.5">Result</th>
                      <th className="p-2.5">Normal Range</th>
                      <th className="p-2.5">Interpretation</th>
                      <th className="p-2.5">Test Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {labResults.map((lab, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="p-2.5 font-medium text-foreground">{lab.test}</td>
                        <td className="p-2.5 font-bold">{lab.value}</td>
                        <td className="p-2.5 text-muted-foreground">{lab.range}</td>
                        <td className="p-2.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                              lab.status === 'High' || lab.status === 'Deficient'
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                                : lab.status === 'Mild Anemia'
                                ? 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200'
                                : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                            }`}
                          >
                            {lab.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-muted-foreground">{lab.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Suggested Doctor Questions */}
            <div className="space-y-2.5 rounded-xl border border-rose-200 dark:border-plum-800 bg-rose-50/40 dark:bg-plum-950/20 p-4 print:border-gray-300 print:bg-white">
              <div className="flex items-center gap-2 text-xs font-semibold text-plum-950 dark:text-rose-soft">
                <Sparkles className="w-4 h-4 text-plum-600 dark:text-rose-soft" />
                <h4 className="font-serif text-sm font-bold">Suggested Questions to Ask Your Doctor</h4>
              </div>
              <ol className="space-y-2 text-xs text-foreground pl-4 list-decimal leading-relaxed">
                {suggestedQuestions.map((q, idx) => (
                  <li key={idx} className="font-medium">
                    {q}
                  </li>
                ))}
              </ol>
            </div>

            {/* Footer Clinical Disclaimer */}
            <div className="pt-3 border-t border-border/80 flex items-start gap-2 text-[10px] text-muted-foreground">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-muted-foreground/80 mt-0.5" />
              <p>
                Summary prepared by HER TURN for personal discussion with your licensed healthcare
                practitioner. Does not constitute medical diagnosis or prescription modification.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
