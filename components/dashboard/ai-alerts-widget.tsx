"use client"

import React from "react"
import Link from "next/link"
import { BellRing, Calendar, Sparkles, ArrowRight, CheckCircle2, Clock } from "lucide-react"
import { useDemoMode, StoredAlert } from "@/components/providers/demo-mode-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function AiAlertsWidget() {
  const { storedAlerts, userRole, caretakerDetails } = useDemoMode()

  if (!storedAlerts.length) return null

  return (
    <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground">
              AI Scheduled Alerts & Deadlines
            </h3>
            <p className="text-xs text-muted-foreground">
              {userRole === 'caretaker'
                ? `Automated clinical alerts for ${caretakerDetails.patientName}`
                : 'Extracted automatically from your prescriptions and lab reports by Ollama AI'}
            </p>
          </div>
        </div>

        <Link
          href="/reminders"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
        >
          All reminders <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {storedAlerts.slice(0, 3).map((alt) => (
          <div
            key={alt.id}
            className="group relative rounded-xl border border-border/70 p-3.5 hover:border-primary/40 transition-all bg-card/60 space-y-1.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                    <Sparkles className="h-2.5 w-2.5 mr-1" />
                    {alt.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-[11px] font-semibold text-primary">
                    {alt.date} {alt.time ? `• ${alt.time}` : ''}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground pt-0.5">
                  {alt.title}
                </h4>
              </div>

              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                <CheckCircle2 className="h-3 w-3" /> Active Alert
              </span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {alt.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
