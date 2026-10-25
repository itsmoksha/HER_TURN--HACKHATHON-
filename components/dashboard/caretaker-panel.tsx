"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HeartHandshake,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Heart,
  ChevronRight,
} from "lucide-react"
import { useDemoMode } from "@/components/providers/demo-mode-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const QUICK_MESSAGES = [
  "Did you take your Thyronorm 50 mcg this morning?",
  "Your appointment with Dr. Sunita is tomorrow at 11:30 AM.",
  "I uploaded your new thyroid lab report to your records vault.",
  "Please remember to drink plenty of water today!",
]

export function CaretakerPanel() {
  const {
    userRole,
    caretakerDetails,
    caretakerMessages,
    sendMessageToPatient,
    setIsRoleModalOpen,
  } = useDemoMode()

  const [messageText, setMessageText] = useState("")

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return
    sendMessageToPatient(messageText.trim())
    setMessageText("")
  }

  const handleQuickSend = (text: string) => {
    sendMessageToPatient(text)
  }

  // If in Self mode, show incoming notes from Caretaker if any
  if (userRole === 'self') {
    if (!caretakerMessages.length) return null

    const latestMsg = caretakerMessages[0]
    return (
      <div className="rounded-2xl border border-purple-200/80 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20 p-4 sm:p-5 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-900 dark:text-purple-300">
                  Care Note from {latestMsg.from}
                </span>
                <span className="text-[10px] text-muted-foreground">{latestMsg.time}</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                &ldquo;{latestMsg.text}&rdquo;
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRoleModalOpen(true)}
            className="text-xs text-purple-900 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40"
          >
            Manage Caretaker
          </Button>
        </div>
      </div>
    )
  }

  // If in Caretaker mode, show full management hub
  return (
    <div className="rounded-3xl border border-purple-200/90 dark:border-purple-900/70 bg-gradient-to-r from-purple-50/60 via-white to-rose-50/30 dark:from-card dark:via-card dark:to-card p-6 shadow-sm space-y-5">
      {/* Caretaker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-200 shadow-xs">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-foreground">
                Caretaker Management Hub
              </h3>
              <Badge variant="outline" className="text-[10px] bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-200">
                Managing for {caretakerDetails.patientName}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Logged in as <strong>{caretakerDetails.caretakerName}</strong> ({caretakerDetails.relation})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRoleModalOpen(true)}
            className="text-xs gap-1 border-purple-300 text-purple-900 dark:text-purple-200 hover:bg-purple-50"
          >
            <User className="h-3.5 w-3.5" />
            <span>Switch to Self</span>
          </Button>
        </div>
      </div>

      {/* Message Composer to Patient */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            <span>Send Instant Care Note / Reminder to {caretakerDetails.patientName}</span>
          </span>
          <span className="text-[11px] text-muted-foreground">
            Sent to {caretakerDetails.patientPhone}
          </span>
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`e.g. Remember to take your morning medicine before breakfast...`}
            className="text-xs sm:text-sm bg-background border-border"
          />
          <Button
            type="submit"
            disabled={!messageText.trim()}
            className="bg-primary text-primary-foreground text-xs sm:text-sm font-semibold gap-1.5 px-4"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </Button>
        </form>

        {/* Quick Suggestions */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-muted-foreground">Quick check-in templates:</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_MESSAGES.map((msg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickSend(msg)}
                className="rounded-lg border border-border/70 bg-card px-2.5 py-1 text-left text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                + &ldquo;{msg}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sent Notes */}
      {caretakerMessages.length > 0 && (
        <div className="border-t border-border/50 pt-3 space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Sent Messages & Reminders:
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {caretakerMessages.slice(0, 3).map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/60 text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">{m.text}</p>
                  <p className="text-[10px] text-muted-foreground">{m.time}</p>
                </div>
                <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300 bg-emerald-50 shrink-0 ml-2">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Delivered
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
