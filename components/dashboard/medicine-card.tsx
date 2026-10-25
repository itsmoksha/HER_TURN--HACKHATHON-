"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Clock, AlertCircle, Sparkles, Pill, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Medicine } from "@/lib/db/queries"

export interface MedicineCardProps {
  medicine: Medicine
  onMarkTaken?: (id: string, nextStatus: "taken" | "upcoming") => void
  compact?: boolean
}

export function MedicineCard({ medicine, onMarkTaken, compact = false }: MedicineCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const isTaken = medicine.status === "taken"
  const isUpcoming = medicine.status === "upcoming"
  const isMissed = medicine.status === "missed"

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isUpdating) return

    setIsUpdating(true)
    const nextStatus = isTaken ? "upcoming" : "taken"
    try {
      if (onMarkTaken) {
        onMarkTaken(medicine.id, nextStatus)
      }
    } finally {
      setTimeout(() => setIsUpdating(false), 300)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "relative group flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all shadow-sm",
        isTaken &&
          "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40 shadow-none",
        isUpcoming &&
          "bg-white dark:bg-card border-sand-200/90 dark:border-border hover:border-plum-300 dark:hover:border-plum-700/60 hover:shadow-md",
        isMissed &&
          "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 hover:shadow-md"
      )}
    >
      {/* Top Header: Timing & Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
              isTaken && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
              isUpcoming && "bg-sand-100 text-plum-950 dark:bg-sand-200/20 dark:text-sand-100",
              isMissed && "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300"
            )}
          >
            <Pill className="h-4 w-4" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3 w-3 text-muted-foreground/70" />
              <span>{medicine.scheduledTime}</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="capitalize">{medicine.timeOfDay}</span>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div>
          {isTaken && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
              <Check className="h-3 w-3" />
              Taken {medicine.takenAt ? `(${medicine.takenAt})` : ""}
            </span>
          )}
          {isUpcoming && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sand-100/80 dark:bg-sand-200/10 px-2.5 py-0.5 text-xs font-medium text-plum-900 dark:text-sand-200">
              <Clock className="h-3 w-3 text-plum-700 dark:text-sand-300" />
              Upcoming
            </span>
          )}
          {isMissed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/80 px-2.5 py-0.5 text-xs font-medium text-rose-800 dark:text-rose-300">
              <AlertCircle className="h-3 w-3" />
              Attention
            </span>
          )}
        </div>
      </div>

      {/* Medicine Info */}
      <div className="mt-3.5 space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <h4
            className={cn(
              "font-serif text-lg font-semibold tracking-tight transition-all",
              isTaken
                ? "text-muted-foreground line-through decoration-emerald-500/40"
                : "text-foreground group-hover:text-plum-950 dark:group-hover:text-plum-300"
            )}
          >
            {medicine.name}
          </h4>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary/80 text-secondary-foreground shrink-0">
            {medicine.strength}
          </span>
        </div>

        <p className="text-xs text-muted-foreground/90 font-sans">
          {medicine.genericName} • <span className="font-medium text-foreground/80">{medicine.dosage}</span>
        </p>

        {!compact && medicine.instructions && (
          <p className="pt-1 text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {medicine.instructions}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isUpdating}
          className={cn(
            "relative w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-900",
            isTaken
              ? "bg-transparent text-emerald-800 hover:bg-emerald-100/50 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
              : "bg-plum-950 text-white shadow hover:bg-plum-900 active:scale-[0.98]"
          )}
        >
          <AnimatePresence mode="wait">
            {isUpdating ? (
              <motion.span
                key="updating"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Updating...
              </motion.span>
            ) : isTaken ? (
              <motion.span
                key="marked-taken"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold"
              >
                <Check className="h-4 w-4" />
                Marked as Taken (Undo)
              </motion.span>
            ) : (
              <motion.span
                key="mark-taken"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-1.5 font-medium"
              >
                <Sparkles className="h-3.5 w-3.5 text-rose-soft" />
                {isMissed ? "Take Now & Mark Done" : "Mark as Taken"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  )
}
