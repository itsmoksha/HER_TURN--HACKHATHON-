"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  UploadCloud,
  CalendarPlus,
  BellRing,
  ArrowRight,
  Calendar,
  MapPin,
  Video,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Pill,
  Clock,
  ChevronRight,
  Heart,
} from "lucide-react"

import {
  getDashboardData,
  updateMedicineStatus,
  type DashboardData,
  type Medicine,
} from "@/lib/db/queries"
import { MedicineCard } from "@/components/dashboard/medicine-card"
import { AdherenceWidget } from "@/components/dashboard/adherence-widget"
import { HealthReadinessCard } from "@/components/dashboard/health-readiness-card"
import { CaretakerPanel } from "@/components/dashboard/caretaker-panel"
import { AiAlertsWidget } from "@/components/dashboard/ai-alerts-widget"
import { useDemoMode } from "@/components/providers/demo-mode-provider"
import { cn } from "@/lib/utils"

// Motion variants for staggered load-in
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

export default function DashboardPage() {
  const router = useRouter()
  const {
    patient,
    userRole,
    caretakerDetails,
    storedAlerts,
    storedDocuments,
  } = useDemoMode()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<"all" | "morning" | "afternoon" | "night">("all")
  const [searchPrompt, setSearchPrompt] = useState("")

  // Fetch initial dashboard data
  useEffect(() => {
    async function loadData() {
      try {
        const result = await getDashboardData()
        setData(result)
      } catch (err) {
        console.error("Failed to load dashboard data", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Time-based greeting generator
  const getGreeting = () => {
    const hour = new Date().getHours()
    const name = userRole === 'caretaker' ? caretakerDetails.caretakerName : patient.preferredName
    const roleTag = userRole === 'caretaker' ? `Managing for ${caretakerDetails.patientName}` : "Morning Routine"
    if (hour < 12) return { text: `Good morning, ${name} ☀️`, timeTag: roleTag }
    if (hour < 17) return { text: `Good afternoon, ${name} 🌤️`, timeTag: roleTag }
    return { text: `Good evening, ${name} 🌙`, timeTag: roleTag }
  }

  // Indian Date Format: Sunday, 25 October 2026
  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Handle medicine optimistic toggle
  const handleMarkTaken = async (medicineId: string, nextStatus: "taken" | "upcoming") => {
    if (!data) return

    // Optimistic UI update
    const updatedMeds: Medicine[] = data.todaysMedicines.map((m) =>
      m.id === medicineId ? { ...m, status: nextStatus as Medicine['status'] } : m
    )

    const takenCount = updatedMeds.filter((m) => m.status === "taken").length
    const totalCount = updatedMeds.length

    setData({
      ...data,
      todaysMedicines: updatedMeds,
      healthReadiness: {
        ...data.healthReadiness,
        items: data.healthReadiness.items.map((item) =>
          item.label === "Medicines taken today"
            ? {
                ...item,
                done: takenCount > 0,
              }
            : item
        ),
      },
    })

    try {
      // Only pass valid status values; map 'upcoming' back to a no-op by skipping
      if (nextStatus === "taken") {
        await updateMedicineStatus(medicineId, "taken")
      }
    } catch (err) {
      console.error("Failed to sync medicine status", err)
    }
  }

  // Handle Ask HER TURN submit
  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchPrompt.trim()) return
    router.push(`/assistant?q=${encodeURIComponent(searchPrompt.trim())}`)
  }

  // Filtered medicines
  const filteredMedicines = data?.todaysMedicines.filter((m) => {
    if (activeFilter === "all") return true
    return (m as any).timeOfDay === activeFilter
  }) || []

  const takenMedicinesCount = data?.todaysMedicines.filter((m) => m.status === "taken").length || 0
  const totalMedicinesCount = data?.todaysMedicines.length || 0
  const greeting = getGreeting()

  const recentDocs = [
    ...(storedDocuments || []).map((d) => ({
      id: d.id,
      type: d.type.toUpperCase(),
      date: d.document_date,
      title: d.title,
      summarySnippet: d.ai_summary || 'Verified medical record stored in vault.',
    })),
    ...(data?.recentDocuments || []).map((d) => ({
      id: d.id,
      type: d.type.toUpperCase(),
      date: d.document_date,
      title: d.title,
      summarySnippet: '',
    })),
  ].slice(0, 3)

  // SKELETON LOADING STATE
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Greeting Skeleton */}
        <div className="h-32 rounded-3xl bg-muted/60" />

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted/60" />
          ))}
        </div>

        {/* Medicines Skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-48 rounded-lg bg-muted/60" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-muted/60" />
            ))}
          </div>
        </div>

        {/* Adherence & Readiness Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-64 rounded-3xl bg-muted/60" />
          <div className="lg:col-span-5 h-64 rounded-3xl bg-muted/60" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* 1. GREETING CARD */}
      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl border border-sand-200/90 bg-gradient-to-r from-sand-50 via-white to-rose-50/50 p-6 sm:p-8 shadow-sm dark:border-border dark:from-card dark:via-card dark:to-card/80">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-sand-100/80 dark:bg-sand-200/10 px-3 py-1 text-xs font-semibold text-plum-950 dark:text-sand-200">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{getFormattedDate()}</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{greeting.timeTag}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                {greeting.text}
              </h2>

              <p className="text-sm text-muted-foreground max-w-xl font-sans leading-relaxed">
                Everyone else had their turn. This one is yours. Here is your daily
                treatment plan, upcoming doctor reviews, and health progress.
              </p>
            </div>

            {/* Health Readiness Mini Metric Badge */}
            <div className="flex items-center gap-4 rounded-2xl bg-white/90 dark:bg-muted/40 p-4 border border-border/80 shadow-xs self-start md:self-auto shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-plum-100 text-plum-950 dark:bg-plum-900/60 dark:text-rose-soft">
                <Pill className="h-6 w-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-xl font-bold text-foreground">
                    {takenMedicinesCount} of {totalMedicinesCount}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    medicines taken
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-36 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-plum-950 dark:bg-rose-soft transition-all duration-500 rounded-full"
                    style={{
                      width: `${(takenMedicinesCount / Math.max(totalMedicinesCount, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CARETAKER MANAGEMENT PANEL OR INCOMING CARE NOTES */}
      <motion.section variants={itemVariants}>
        <CaretakerPanel />
      </motion.section>

      {/* 2. QUICK ACTIONS ROW */}
      <motion.section variants={itemVariants}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Action 1: Upload Document */}
          <Link
            href="/records"
            className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 transition-all hover:border-plum-300 dark:hover:border-plum-800 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand-100 text-plum-950 dark:bg-sand-200/10 dark:text-sand-100 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="mt-3">
              <h4 className="font-serif text-sm font-semibold text-foreground group-hover:text-plum-950 dark:group-hover:text-sand-100">
                Upload Record
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Lab reports & scans
              </p>
            </div>
          </Link>

          {/* Action 2: Ask AI */}
          <Link
            href="/assistant"
            className="group relative flex flex-col justify-between rounded-2xl border border-plum-200/80 dark:border-plum-900 bg-plum-50/50 dark:bg-plum-950/20 p-4 transition-all hover:border-plum-400 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-plum-950 text-white dark:bg-plum-900 group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5 text-rose-soft" />
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-1.5">
                <h4 className="font-serif text-sm font-semibold text-plum-950 dark:text-sand-100">
                  Ask AI Health
                </h4>
                <span className="rounded bg-rose-soft/30 px-1 py-0.2 text-[9px] font-bold text-plum-950 dark:text-rose-soft">
                  NEW
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Instant plain answers
              </p>
            </div>
          </Link>

          {/* Action 3: Add Appointment */}
          <Link
            href="/appointments"
            className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 transition-all hover:border-plum-300 dark:hover:border-plum-800 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand-100 text-plum-950 dark:bg-sand-200/10 dark:text-sand-100 group-hover:scale-110 transition-transform">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <div className="mt-3">
              <h4 className="font-serif text-sm font-semibold text-foreground group-hover:text-plum-950 dark:group-hover:text-sand-100">
                Appointments
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Dr. Sunita tomorrow
              </p>
            </div>
          </Link>

          {/* Action 4: View Reminders */}
          <Link
            href="/reminders"
            className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 transition-all hover:border-plum-300 dark:hover:border-plum-800 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand-100 text-plum-950 dark:bg-sand-200/10 dark:text-sand-100 group-hover:scale-110 transition-transform">
              <BellRing className="h-5 w-5" />
            </div>
            <div className="mt-3">
              <h4 className="font-serif text-sm font-semibold text-foreground group-hover:text-plum-950 dark:group-hover:text-sand-100">
                Reminders
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                5 scheduled today
              </p>
            </div>
          </Link>
        </div>
      </motion.section>

      {/* 3. TODAY'S MEDICINES */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Today&apos;s Medicines & Routine
            </h3>
            <p className="text-xs text-muted-foreground">
              Tap any dose to log as taken. All updates save instantly.
            </p>
          </div>

          {/* Timing Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {(
              [
                { id: "all", label: "All (5)" },
                { id: "morning", label: "Morning" },
                { id: "afternoon", label: "Afternoon" },
                { id: "night", label: "Night" },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "rounded-full px-3 py-1 font-medium transition-all shrink-0",
                  activeFilter === filter.id
                    ? "bg-plum-950 text-white dark:bg-plum-800 shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Medicines Container: horizontal scroll on mobile with snap, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
          <AnimatePresence mode="popLayout">
            {filteredMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className="w-[82vw] sm:w-[320px] md:w-auto shrink-0 snap-center"
              >
                <MedicineCard
                  medicine={medicine}
                  onMarkTaken={handleMarkTaken}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* 4. ASK HER TURN (PROMINENT AI HEALTH SEARCH & STARTER CHIPS) */}
      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl border border-plum-200/80 dark:border-plum-900 bg-gradient-to-r from-plum-50/70 via-white to-sand-50 dark:from-card dark:to-card p-6 sm:p-7 shadow-sm">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-plum-950 text-white">
                <Sparkles className="h-4 w-4 text-rose-soft" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Ask HER TURN Companion
                </h3>
                <p className="text-xs text-muted-foreground">
                  Clear explanations for your prescriptions, symptoms, or lab numbers
                </p>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskSubmit} className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                placeholder="Ask anything about your health, lab numbers, or medicines..."
                className="w-full rounded-2xl border border-border bg-background py-3.5 pl-12 pr-28 text-sm placeholder:text-muted-foreground focus:border-plum-950 focus:outline-none focus:ring-1 focus:ring-plum-950 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 rounded-xl bg-plum-950 px-4 py-2 text-xs font-semibold text-white hover:bg-plum-900 transition-colors shadow-xs"
              >
                Ask AI
              </button>
            </form>

            {/* 3 Clickable Starter Question Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                Suggested questions:
              </span>
              {[
                "Can I take Thyronorm with milk or tea?",
                "What did my recent HbA1c & Thyroid lab report say?",
                "Prepare 3 questions for my appointment with Dr. Sunita",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => router.push(`/assistant?q=${encodeURIComponent(chip)}`)}
                  className="rounded-full bg-white dark:bg-muted/60 border border-border/80 px-3 py-1.5 text-xs text-foreground/90 hover:border-plum-400 hover:bg-plum-50 dark:hover:bg-muted transition-colors text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. TWO COLUMN ROW: ADHERENCE SUMMARY & HEALTH READINESS CARD */}
      <motion.section variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col">
            <AdherenceWidget
              percentage={data?.weeklyAdherence?.percentage}
              streakDays={data?.weeklyAdherence?.streak}
              encouragingMessage={undefined}
              days={data?.weeklyAdherence?.days?.map((d) => ({
                dayName: d.day,
                fullDate: d.day,
                status: d.taken ? 'full' : d.missed ? 'missed' : 'none',
                percent: d.taken ? 100 : 0,
                totalDoses: 5,
                takenDoses: d.taken ? 5 : 0,
              }))}
              className="h-full"
            />
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <HealthReadinessCard
              data={data?.healthReadiness ? {
                score: data.healthReadiness.items.filter((i) => i.done).length,
                maxScore: data.healthReadiness.items.length,
                summary: 'Your daily care plan is on track.',
                items: data.healthReadiness.items.map((item, idx) => ({
                  id: String(idx),
                  title: item.label,
                  description: '',
                  isComplete: item.done,
                  category: 'general',
                  statusText: item.done ? 'Done' : 'Pending',
                }))
              } : undefined}
              className="h-full"
            />
          </div>
        </div>
      </motion.section>

      {/* 5.5 AI SCHEDULED ALERTS WIDGET (Ollama Analyzed) */}
      <motion.section variants={itemVariants}>
        <AiAlertsWidget />
      </motion.section>

      {/* 6. UPCOMING APPOINTMENTS & RECENT DOCUMENTS */}
      <motion.section variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments Card */}
          <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-plum-950 dark:text-rose-soft" />
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Upcoming Appointments
                </h3>
              </div>
              <Link
                href="/appointments"
                className="inline-flex items-center gap-1 text-xs font-semibold text-plum-950 dark:text-sand-200 hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {data?.upcomingAppointments.slice(0, 2).map((apt) => (
                <div
                  key={apt.id}
                  className="group relative rounded-xl border border-border/70 p-4 hover:border-plum-300 dark:hover:border-plum-800 transition-all bg-card/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-plum-100 text-plum-950 font-serif font-bold text-sm dark:bg-plum-900/50 dark:text-sand-100">
                        {apt.doctor_name ? apt.doctor_name.charAt(4) : '👩'}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground group-hover:text-plum-950 dark:group-hover:text-sand-100 transition-colors">
                            {apt.doctor_name}
                          </h4>
                          <span
                            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          >
                            <MapPin className="h-2.5 w-2.5" />
                            In Person
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {apt.specialty}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2 text-xs">
                    <span className="font-semibold text-plum-950 dark:text-sand-200">
                      {apt.appointment_date}
                    </span>
                    <span className="text-muted-foreground">{apt.location}</span>
                  </div>

                  {apt.notes && (
                    <p className="mt-2 text-[11px] text-muted-foreground/90 bg-muted/50 rounded-lg p-2">
                      💡 <strong>Note:</strong> {apt.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Documents Card */}
          <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-plum-950 dark:text-rose-soft" />
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Recent Health Documents
                </h3>
              </div>
              <Link
                href="/records"
                className="inline-flex items-center gap-1 text-xs font-semibold text-plum-950 dark:text-sand-200 hover:underline"
              >
                View library <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentDocs.map((doc: any) => (
                <Link
                  key={doc.id}
                  href={`/records?id=${doc.id}`}
                  className="group flex flex-col justify-between rounded-xl border border-border/70 p-3.5 hover:border-plum-300 dark:hover:border-plum-800 transition-all bg-card/60"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-plum-100 dark:bg-plum-900/50 px-2 py-0.5 text-[10px] font-bold text-plum-950 dark:text-rose-soft">
                          {doc.type}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {doc.date}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-plum-950 dark:group-hover:text-sand-100 transition-colors line-clamp-1">
                        {doc.title}
                      </h4>
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>

                  <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {doc.summarySnippet}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}
