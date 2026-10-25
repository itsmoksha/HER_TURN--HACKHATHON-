"use client"

import React from "react"
import { motion } from "framer-motion"
import { Check, Flame, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AdherenceDay } from "@/lib/db/queries"

export interface AdherenceWidgetProps {
  percentage?: number
  streakDays?: number
  encouragingMessage?: string
  days?: AdherenceDay[]
  className?: string
}

export function AdherenceWidget({
  percentage = 92,
  streakDays = 4,
  encouragingMessage = "4-day streak! You're doing great 🌸",
  days = [
    { dayName: "Mon", fullDate: "19 Oct", status: "full", percent: 100, totalDoses: 5, takenDoses: 5 },
    { dayName: "Tue", fullDate: "20 Oct", status: "full", percent: 100, totalDoses: 5, takenDoses: 5 },
    { dayName: "Wed", fullDate: "21 Oct", status: "full", percent: 100, totalDoses: 5, takenDoses: 5 },
    { dayName: "Thu", fullDate: "22 Oct", status: "full", percent: 100, totalDoses: 5, takenDoses: 5 },
    { dayName: "Fri", fullDate: "23 Oct", status: "partial", percent: 80, totalDoses: 5, takenDoses: 4 },
    { dayName: "Sat", fullDate: "24 Oct", status: "full", percent: 100, totalDoses: 5, takenDoses: 5 },
    { dayName: "Sun", fullDate: "25 Oct", status: "today", percent: 60, totalDoses: 5, takenDoses: 3 },
  ],
  className,
}: AdherenceWidgetProps) {
  // SVG Progress Ring calculations
  const radius = 48
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-white dark:bg-card p-5 sm:p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Weekly Routine Care
          </h3>
          <p className="text-xs text-muted-foreground">
            Consistency over perfection • Last 7 days
          </p>
        </div>

        {streakDays > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sand-100/90 dark:bg-sand-200/10 px-3 py-1 text-xs font-semibold text-plum-950 dark:text-sand-200 border border-sand-200/50">
            <Flame className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
            <span>{streakDays}-day streak</span>
          </div>
        )}
      </div>

      {/* Main Content: Progress Ring & Days Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Progress Ring */}
        <div className="md:col-span-5 flex items-center justify-center py-1">
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="plumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4A1C40" />
                  <stop offset="60%" stopColor="#7B3F6E" />
                  <stop offset="100%" stopColor="#E8A0A0" />
                </linearGradient>
              </defs>

              {/* Background track */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-sand-100 dark:stroke-muted"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Animated Progress Arc */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                stroke="url(#plumGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-serif text-2xl font-bold tracking-tight text-plum-950 dark:text-sand-100"
              >
                {percentage}%
              </motion.span>
              <span className="text-[11px] font-medium text-muted-foreground">
                adherence
              </span>
            </div>
          </div>
        </div>

        {/* 7-Day Calendar Strip */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {days.map((item, index) => {
              const isFull = item.status === "full"
              const isPartial = item.status === "partial"
              const isToday = item.status === "today"

              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1.5 text-center group"
                >
                  <span
                    className={cn(
                      "text-[11px] font-medium transition-colors",
                      isToday
                        ? "text-plum-950 dark:text-sand-200 font-bold"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {item.dayName}
                  </span>

                  {/* Day Circle */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      "relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs font-semibold transition-all border",
                      isFull &&
                        "bg-plum-950 text-white border-plum-950 shadow-sm dark:bg-plum-800 dark:border-plum-700",
                      isPartial &&
                        "bg-sand-100 text-plum-950 border-sand-300 dark:bg-sand-200/20 dark:text-sand-200 dark:border-sand-400/30",
                      isToday &&
                        "ring-2 ring-plum-950 ring-offset-2 ring-offset-background bg-rose-50 border-rose-soft text-plum-950 dark:bg-plum-950/40 dark:text-sand-100",
                      !isFull &&
                        !isPartial &&
                        !isToday &&
                        "bg-muted/40 text-muted-foreground border-border/60"
                    )}
                  >
                    {isFull ? (
                      <Check className="h-4 w-4 stroke-[2.5]" />
                    ) : isToday ? (
                      <span className="text-[11px]">Today</span>
                    ) : isPartial ? (
                      <span className="text-[10px]">{item.percent}%</span>
                    ) : (
                      <span className="text-[11px]">{item.takenDoses}</span>
                    )}
                  </motion.div>

                  <span className="text-[10px] text-muted-foreground/80 hidden sm:inline">
                    {item.fullDate.split(" ")[0]}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Encouraging message strip */}
          <div className="mt-4 rounded-xl bg-plum-50/70 dark:bg-plum-950/30 p-2.5 sm:p-3 border border-plum-100/80 dark:border-plum-900/40 flex items-center gap-2.5">
            <Heart className="h-4 w-4 text-plum-700 dark:text-rose-soft shrink-0 fill-plum-700/20" />
            <p className="text-xs text-plum-950 dark:text-plum-200 leading-snug font-medium">
              {encouragingMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
