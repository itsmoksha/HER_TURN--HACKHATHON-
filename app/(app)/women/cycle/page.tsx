'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity, TrendingUp, TrendingDown,
  Heart, Calendar, Plus, ChevronLeft, ChevronRight,
  Droplets, Wind, Zap, Smile, Frown, Meh, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { mockCycleLogs, mockUser } from '@/lib/db/mock-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const SYMPTOMS = [
  { id: 'cramps', label: 'Cramps', icon: '🤸' },
  { id: 'bloating', label: 'Bloating', icon: '💫' },
  { id: 'headache', label: 'Headache', icon: '🤕' },
  { id: 'fatigue', label: 'Fatigue', icon: '😴' },
  { id: 'mood', label: 'Mood changes', icon: '🌊' },
  { id: 'spotting', label: 'Spotting', icon: '🩸' },
  { id: 'cravings', label: 'Cravings', icon: '🍫' },
  { id: 'backpain', label: 'Back pain', icon: '⚡' },
  { id: 'acne', label: 'Acne', icon: '✨' },
  { id: 'insomnia', label: 'Poor sleep', icon: '🌙' },
]

const FLOW_LEVELS = [
  { id: 'none', label: 'None', color: 'bg-muted' },
  { id: 'light', label: 'Light', color: 'bg-pink-200' },
  { id: 'moderate', label: 'Moderate', color: 'bg-rose-400' },
  { id: 'heavy', label: 'Heavy', color: 'bg-rose-700' },
]

// Simple calendar data for demo
function getCycleCalendar() {
  const today = new Date('2026-10-25')
  const days = []
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  // Period days (simulated: Oct 5-10 was last period)
  const periodDays = [5, 6, 7, 8, 9, 10]
  // Predicted next: Nov 3-8
  const currentDay = today.getDate()

  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      day: d,
      isPeriod: periodDays.includes(d),
      isToday: d === currentDay,
      isFuture: d > currentDay,
    })
  }
  return { days, startDay: startOfMonth.getDay(), monthName: today.toLocaleString('en-IN', { month: 'long', year: 'numeric' }) }
}

export default function CyclePage() {
  const [flow, setFlow] = useState<string>('')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const { days, startDay, monthName } = getCycleCalendar()

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Today\'s log saved!')
    setFlow('')
    setSelectedSymptoms([])
    setNotes('')
    setSaving(false)
  }

  const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div {...fadeIn}>
        <div className="flex items-center gap-2 mb-1">
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-3xl font-semibold">Cycle Tracker</h1>
        </div>
        <p className="text-muted-foreground">Track your cycle, understand your patterns, and share insights with your doctor.</p>
      </motion.div>

      {/* Current cycle info */}
      <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Current cycle day', value: 'Day 15', icon: Calendar, color: 'text-primary' },
            { label: 'Average cycle', value: '29 days', icon: Activity, color: 'text-success' },
            { label: 'Next period', value: '~Nov 3', icon: TrendingUp, color: 'text-muted-foreground' },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-4 pb-3">
                <stat.icon className={cn('h-5 w-5 mx-auto mb-1', stat.color)} />
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Calendar */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{monthName}</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for start day offset */}
              {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {days.map(({ day, isPeriod, isToday, isFuture }) => (
                <button
                  key={day}
                  className={cn(
                    'aspect-square rounded-full text-xs flex items-center justify-center transition-all',
                    isToday && 'ring-2 ring-primary font-bold',
                    isPeriod && !isFuture && 'bg-rose-400 text-white',
                    !isPeriod && !isToday && 'hover:bg-muted',
                    isFuture && 'text-muted-foreground/50'
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-400" /> Period days
              </span>
              <span className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full ring-2 ring-primary" /> Today
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Log today */}
      <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" /> Log today
            </CardTitle>
            <CardDescription>25 October 2026</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Flow level */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Flow</Label>
              <div className="flex gap-2">
                {FLOW_LEVELS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFlow(f.id)}
                    className={cn(
                      'flex-1 rounded-lg border py-2 text-sm font-medium transition-all',
                      flow === f.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted'
                    )}
                  >
                    <div className={cn('h-2 w-2 rounded-full mx-auto mb-1', f.color)} />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Symptoms</Label>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleSymptom(s.id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all',
                      selectedSymptoms.includes(s.id)
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border hover:bg-muted'
                    )}
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="cycle-notes" className="text-sm font-medium mb-1.5 block">Notes (optional)</Label>
              <Textarea
                id="cycle-notes"
                placeholder="Any other observations…"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save today\'s log'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" /> Patterns & Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: Calendar, text: 'Your average cycle is 29 days. Last 3 cycles: 28, 30, 29 days.' },
              { icon: Zap, text: 'You often report fatigue on days 2–3 of your period.' },
              { icon: Frown, text: 'Mood changes are frequently logged in the week before your period (PMS pattern).' },
            ].map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <insight.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm">{insight.text}</p>
              </div>
            ))}
            <Separator />
            <Button variant="outline" className="w-full gap-2">
              <AlertCircle className="h-4 w-4" />
              Generate summary for doctor
            </Button>
            <p className="text-xs text-muted-foreground text-center">Creates a printable cycle history to bring to your appointment</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
