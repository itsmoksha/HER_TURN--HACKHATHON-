'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  Clock, 
  AlertCircle, 
  X, 
  ChevronDown, 
  Pill, 
  Sparkles,
  Calendar,
  Volume2
} from 'lucide-react'

export type ReminderStatus = 'upcoming' | 'taken' | 'missed' | 'snoozed' | 'skipped'

export interface ReminderItem {
  id: string
  medicineName: string
  dose: string
  instructions?: string
  scheduledTime: string // e.g. "07:30 AM"
  status: ReminderStatus
  snoozedUntil?: string
  medicineCategory?: string
  lastTakenAt?: string
}

interface ReminderCardProps {
  reminder: ReminderItem
  onMarkTaken?: (id: string) => void
  onSnooze?: (id: string, durationMinutes: number) => void
  onSkip?: (id: string) => void
}

export function ReminderCard({
  reminder,
  onMarkTaken,
  onSnooze,
  onSkip,
}: ReminderCardProps) {
  const [currentStatus, setCurrentStatus] = useState<ReminderStatus>(reminder.status)
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false)
  const [isAnimatingTaken, setIsAnimatingTaken] = useState(false)
  const [snoozeNote, setSnoozeNote] = useState<string | null>(reminder.snoozedUntil || null)

  const handleMarkTaken = () => {
    setIsAnimatingTaken(true)
    setCurrentStatus('taken')
    setSnoozeNote(null)
    setShowSnoozeMenu(false)
    if (onMarkTaken) {
      onMarkTaken(reminder.id)
    }
  }

  const handleSnooze = (minutes: number) => {
    setCurrentStatus('snoozed')
    const timeNow = new Date()
    timeNow.setMinutes(timeNow.getMinutes() + minutes)
    const formatted = timeNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const note = `Snoozed until ${formatted}`
    setSnoozeNote(note)
    setShowSnoozeMenu(false)
    if (onSnooze) {
      onSnooze(reminder.id, minutes)
    }
  }

  const handleSkip = () => {
    setCurrentStatus('skipped')
    setShowSnoozeMenu(false)
    if (onSkip) {
      onSkip(reminder.id)
    }
  }

  const getStatusBadge = () => {
    switch (currentStatus) {
      case 'taken':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
            Taken
          </span>
        )
      case 'snoozed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            {snoozeNote || 'Snoozed'}
          </span>
        )
      case 'missed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Missed
          </span>
        )
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            <X className="w-3.5 h-3.5" />
            Skipped Today
          </span>
        )
      case 'upcoming':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-plum-100 text-plum-900 dark:bg-plum-950/70 dark:text-plum-200 border border-plum-200/60 dark:border-plum-800">
            <Clock className="w-3.5 h-3.5 text-plum-700 dark:text-plum-300" />
            Upcoming
          </span>
        )
    }
  }

  // Border styling based on state
  const getContainerBorder = () => {
    if (currentStatus === 'missed') {
      return 'border-rose-300 dark:border-rose-800/80 ring-1 ring-rose-200 dark:ring-rose-900/50'
    }
    if (currentStatus === 'taken') {
      return 'border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/20 dark:bg-emerald-950/10'
    }
    if (currentStatus === 'snoozed') {
      return 'border-amber-200 dark:border-amber-800/70'
    }
    return 'border-border/80 hover:border-plum-300 dark:hover:border-plum-700'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isAnimatingTaken ? [1, 1.02, 1] : 1,
        transition: { duration: 0.3 }
      }}
      className={`relative group rounded-2xl bg-card border p-4 sm:p-5 transition-all duration-200 shadow-sm hover:shadow-md ${getContainerBorder()}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left column: Icon + Info */}
        <div className="flex items-start gap-3.5">
          <motion.div 
            animate={currentStatus === 'taken' ? { rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.4 }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              currentStatus === 'taken'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : currentStatus === 'missed'
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-plum-50 text-plum-950 dark:bg-plum-950 dark:text-plum-200'
            }`}
          >
            {currentStatus === 'taken' ? (
              <Check className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Pill className="w-5 h-5 stroke-[1.8]" />
            )}
          </motion.div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-serif text-lg font-semibold text-foreground tracking-tight">
                {reminder.medicineName}
              </h4>
              {getStatusBadge()}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <span className="font-medium text-foreground/80">{reminder.dose}</span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1 font-sans">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                {reminder.scheduledTime}
              </span>
              {reminder.instructions && (
                <>
                  <span className="text-border">•</span>
                  <span className="text-xs text-muted-foreground italic">
                    {reminder.instructions}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-1 sm:pt-0">
          {currentStatus === 'taken' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Completed
              </span>
              <button
                type="button"
                onClick={() => {
                  setCurrentStatus('upcoming')
                  setIsAnimatingTaken(false)
                }}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 px-2 py-1"
                title="Undo taken state"
              >
                Undo
              </button>
            </div>
          ) : (
            <>
              {/* Mark Taken Button */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkTaken}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all focus-ring"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                Mark Taken
              </motion.button>

              {/* Snooze Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSnoozeMenu(!showSnoozeMenu)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-border bg-background hover:bg-muted/70 text-foreground transition-colors focus-ring"
                  aria-expanded={showSnoozeMenu}
                  aria-haspopup="true"
                >
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Snooze</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showSnoozeMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showSnoozeMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 w-40 rounded-xl bg-popover text-popover-foreground shadow-lg border border-border py-1.5 z-30"
                    >
                      <button
                        type="button"
                        onClick={() => handleSnooze(15)}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-muted flex items-center justify-between"
                      >
                        <span>15 minutes</span>
                        <span className="text-[10px] text-muted-foreground">+15m</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSnooze(60)}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-muted flex items-center justify-between"
                      >
                        <span>1 hour</span>
                        <span className="text-[10px] text-muted-foreground">+1h</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSnooze(120)}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-muted flex items-center justify-between"
                      >
                        <span>2 hours</span>
                        <span className="text-[10px] text-muted-foreground">+2h</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Skip Button */}
              <button
                type="button"
                onClick={handleSkip}
                className="p-2 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Skip today"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Skip today</span>
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
