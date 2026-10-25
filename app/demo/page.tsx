'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Pill,
  Calendar,
  Users,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  UserCheck,
  Activity,
  ArrowLeft,
  Info,
  Clock,
  Layers,
  HelpCircle,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { toast } from 'sonner'

export default function DemoPage() {
  const router = useRouter()
  const [isInitializing, setIsInitializing] = useState(false)

  const handleStartDemo = () => {
    setIsInitializing(true)

    if (typeof window !== 'undefined') {
      // Set demo mode flags and mock user in localStorage
      localStorage.setItem('her_turn_demo_mode', 'true')
      localStorage.setItem('her_turn_onboarding_completed', 'true')
      localStorage.setItem(
        'her_turn_user',
        JSON.stringify({
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          ageRange: '25-34',
          language: 'English',
          conditions: ['pcos', 'thyroid'],
          reminders: {
            medicine: true,
            appointment: true,
            monthly: true,
            preferredTime: '08:00',
          },
          isDemo: true,
          demoPersona: 'Priya Sharma, 32 • Bengaluru',
        })
      )
    }

    toast.success('Priya’s Demo Environment Ready', {
      description: 'Navigating to your personalized health sanctuary...',
    })

    setTimeout(() => {
      router.push('/dashboard')
    }, 600)
  }

  // Pre-loaded items in the demo
  const demoIncludes = [
    {
      icon: Pill,
      title: '3 Active Prescriptions',
      description: 'Thyronorm (Levothyroxine 50mcg), Glycomet (Metformin 500mg SR), and Folvite 5mg with daily schedules.',
      tag: 'Medicine Tracker',
    },
    {
      icon: FileText,
      title: '3 Pre-Loaded Lab Reports',
      description: 'Apollo Thyroid Panel (TSH 5.4 mIU/L), Dr. Lal HbA1c (5.8%), and Pelvic Ultrasound scan summary.',
      tag: 'Vision AI Extracted',
    },
    {
      icon: Calendar,
      title: 'Upcoming Specialist Visit',
      description: 'Endocrinology consult with Dr. Sunita Rao at Manipal Hospital, complete with auto-generated visit brief.',
      tag: 'Doctor-Ready',
    },
    {
      icon: Users,
      title: 'Trusted Circle (Sister Ananya)',
      description: 'Selective permissions enabled: Ananya sees emergency contacts and meds, but cannot access gynaecology scans.',
      tag: 'Granular DPDP Access',
    },
  ]

  // Guided walkthrough steps
  const walkthroughSteps = [
    {
      number: '1',
      title: 'Explore the Unified Health Timeline',
      desc: 'Browse Priya’s chronological health stream with chronic condition tags, biometric trend badges, and quick-search filters.',
    },
    {
      number: '2',
      title: 'Translate Lab Jargon into Plain English & Hindi',
      desc: 'Open the Thyroid Profile report to inspect how complex reference ranges ("TSH 5.4 mIU/L") are clearly explained without medical panic.',
    },
    {
      number: '3',
      title: 'Track Daily Medicine Adherence',
      desc: 'Confirm Priya’s morning empty-stomach thyroid dose and view smart reminders with built-in meal spacing alerts.',
    },
    {
      number: '4',
      title: 'Generate a 1-Tap Doctor Visit Summary',
      desc: 'Export a concise clinical brief designed for Dr. Sunita Rao, highlighting recent lab deltas and three smart questions for the consult.',
    },
    {
      number: '5',
      title: 'Ask the Grounded AI Health Companion',
      desc: 'Prompt the assistant with questions like "Why am I prescribed Metformin if I don’t have diabetes?" grounded strictly in Priya’s docs.',
    },
    {
      number: '6',
      title: 'Review Granular Privacy & Family Sharing',
      desc: 'Inspect the sharing dashboard to observe how Indian women can selectively share care duties with family while preserving total bodily privacy.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#150713] text-foreground transition-colors">
      {/* Top Header */}
      <header className="border-b border-border bg-white/80 dark:bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
          <Logo size="md" withTagline={false} />
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </Link>
            <Link
              href="/signup"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-[#4A1C40] text-white hover:bg-[#5f2353] transition-colors"
            >
              <span>Sign up for free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Card: You're entering demo mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-br from-[#4A1C40] via-[#381230] to-[#240a1f] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden mb-12"
        >
          {/* Subtle Ambient Orbs */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#E8A0A0]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#F5E6D0]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F5E6D0] text-xs font-semibold tracking-wider uppercase mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A0A0]" />
              <span>Interactive Clinical Sandbox</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              You&apos;re entering demo mode
            </h1>

            <p className="text-sand-100/90 text-sm sm:text-base leading-relaxed mb-8">
              Experience HER TURN through the lens of a real-world scenario. All records, lab values, prescriptions, and family sharing controls are pre-configured so you can explore without uploading personal files.
            </p>

            {/* Persona Callout Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 mb-8">
              <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5E6D0] to-[#E8A0A0] flex items-center justify-center text-[#4A1C40] font-serif font-bold text-lg shadow-sm">
                    PS
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      Priya Sharma
                      <span className="text-xs font-sans font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                        Demo Persona
                      </span>
                    </h2>
                    <p className="text-xs text-sand-100/80">
                      32 years old • Product Lead in Bengaluru • Mother of one
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#E8A0A0]/25 text-sand-100 border border-white/15">
                    PCOS Since 2021
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F5E6D0]/20 text-sand-100 border border-white/15">
                    Subclinical Hypothyroidism
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-sand-100/80 leading-relaxed pt-2 border-t border-white/10">
                Priya juggles demanding deadlines, school runs, and chronic fatigue. Between Apollo diagnostics PDF files, Dr. Lal slips, and a cluttered bedside drawer of pill strips, she struggles to keep track of her thyroid dosages and upcoming endocrinologist visit.
              </p>
            </div>

            {/* Launch Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleStartDemo}
                disabled={isInitializing}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-semibold text-[#4A1C40] bg-[#F5E6D0] hover:bg-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 group"
              >
                <span>{isInitializing ? 'Preparing Persona...' : 'Start Demo as Priya'}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-medium text-white hover:text-sand-100 border border-white/20 hover:border-white hover:bg-white/10 transition-colors"
              >
                <span>Prefer to use your own records?</span>
                <span className="text-[#E8A0A0] font-semibold underline underline-offset-2">Sign up for free →</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* What the Demo Includes */}
        <div className="mb-16">
          <div className="text-center sm:text-left mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1C40] dark:text-sand-100">
              What This Demo Environment Includes
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Complete, interactive clinical mock data ready to explore immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {demoIncludes.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-white dark:bg-card border border-[#4A1C40]/10 dark:border-plum-800/40 shadow-card hover:shadow-card-hover transition-all flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F5E6D0]/70 dark:bg-plum-900/60 flex items-center justify-center text-[#4A1C40] dark:text-[#E8A0A0] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-serif text-base font-bold text-foreground">
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E8A0A0]/20 text-[#4A1C40] dark:text-[#E8A0A0]">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Guided Walkthrough Path (6 numbered steps) */}
        <div>
          <div className="text-center sm:text-left mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-[#4A1C40]/10 dark:bg-sand-100/10 text-[#4A1C40] dark:text-sand-100 text-xs font-semibold tracking-wider uppercase mb-2">
              Recommended Flow
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1C40] dark:text-sand-100">
              Guided 6-Step Walkthrough
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Follow this sequence during your test run to see how HER TURN solves real pain points.
            </p>
          </div>

          <div className="space-y-4">
            {walkthroughSteps.map((step) => (
              <div
                key={step.number}
                className="p-5 rounded-2xl bg-white dark:bg-card border border-border flex items-start gap-4 transition-all hover:border-[#4A1C40]/30 dark:hover:border-plum-700 hover:shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-[#4A1C40] dark:bg-[#7B3F6E] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Final Launch Banner */}
          <div className="mt-10 p-6 rounded-2xl bg-[#F5E6D0]/50 dark:bg-plum-950/50 border border-[#4A1C40]/15 dark:border-plum-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-serif text-lg font-bold text-[#4A1C40] dark:text-sand-100">
                Ready to take Priya’s turn?
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Takes less than 1 second to enter demo mode.
              </p>
            </div>
            <button
              onClick={handleStartDemo}
              disabled={isInitializing}
              className="px-6 py-3 rounded-full bg-[#4A1C40] hover:bg-[#5f2353] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>Launch Demo Sanctuary</span>
              <ArrowRight className="w-4 h-4 text-[#E8A0A0]" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
