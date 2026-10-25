"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle, Sparkles, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { HealthReadinessData, ReadinessItem } from "@/lib/db/queries"

export interface HealthReadinessCardProps {
  data?: HealthReadinessData
  className?: string
}

export function HealthReadinessCard({
  data = {
    score: 5,
    maxScore: 5,
    summary: "Your daily care plan and tomorrow's endocrinology review are on track.",
    items: [
      {
        id: "1",
        title: "Today's Medicine Schedule",
        description: "Morning doses logged on time; afternoon reminders set.",
        isComplete: true,
        category: "medicines",
        statusText: "On track",
      },
      {
        id: "2",
        title: "Upcoming Appointment Check",
        description: "Confirmed with Dr. Sunita Kulkarni for tomorrow, 11:30 AM.",
        isComplete: true,
        category: "appointments",
        statusText: "Confirmed",
      },
      {
        id: "3",
        title: "Records & Reports Synced",
        description: "Thyroid panel & DEXA scan indexed and summarized by AI.",
        isComplete: true,
        category: "documents",
        statusText: "Ready",
      },
      {
        id: "4",
        title: "Trusted Person Access",
        description: "Aarav Sharma has active caregiver and emergency view.",
        isComplete: true,
        category: "trusted",
        statusText: "Active",
      },
      {
        id: "5",
        title: "Reminders & Alerts",
        description: "WhatsApp notifications & morning alarms verified active.",
        isComplete: true,
        category: "reminders",
        statusText: "Active",
      },
    ],
  },
  className,
}: HealthReadinessCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const scorePercent = (data.score / data.maxScore) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-xl",
        "bg-gradient-to-br from-[#4A1C40] via-[#5F2452] to-[#7D3469]",
        "border border-white/10",
        className
      )}
    >
      {/* Decorative background glow & organic curves */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-rose-soft/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-sand-100/10 blur-2xl" />

      {/* Card Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-0.5 text-xs font-medium text-rose-soft">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Daily Health Readiness</span>
          </div>
          <h3 className="font-serif text-2xl font-semibold tracking-tight text-white pt-1">
            Care Readiness Score
          </h3>
          <p className="text-xs text-white/80 max-w-md font-sans">
            {data.summary}
          </p>
        </div>

        {/* Big Score Display */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 self-start sm:self-auto">
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-3xl font-bold text-white tracking-tight">
                {data.score}
              </span>
              <span className="text-sm font-medium text-white/70">
                /{data.maxScore}
              </span>
            </div>
            <p className="text-[10px] text-rose-soft uppercase tracking-wider font-semibold">
              {scorePercent >= 80 ? "Optimal State" : "In Progress"}
            </p>
          </div>

          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-rose-soft">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Readiness Items List */}
      <div className="relative mt-5 space-y-3">
        {data.items.slice(0, isExpanded ? data.items.length : 3).map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start justify-between gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {item.isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-300" />
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-white">
                  {item.title}
                </p>
                <p className="text-[11px] text-white/80">
                  {item.description}
                </p>
              </div>
            </div>

            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                item.isComplete
                  ? "bg-emerald-500/25 text-emerald-200 border border-emerald-400/30"
                  : "bg-amber-500/25 text-amber-200 border border-amber-400/30"
              )}
            >
              {item.statusText}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Expand/Collapse Toggle if more than 3 items */}
      {data.items.length > 3 && (
        <div className="relative mt-4 pt-2 text-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-soft hover:text-white transition-colors focus:outline-none"
          >
            {isExpanded ? (
              <>
                Show fewer checklist factors <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                View all {data.items.length} health readiness factors (
                {data.items.length - 3} more) <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  )
}
