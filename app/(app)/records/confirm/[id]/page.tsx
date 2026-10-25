'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Edit3,
  Bell, BellOff, ChevronDown, ChevronUp, Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { MEDICINE_FREQUENCIES } from '@/lib/constants'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Mock extracted data (what Gemini would return for a prescription scan) ───

interface ExtractedMedicine {
  id: string
  name: string
  strength: string
  dose: string
  frequency: string
  duration: string
  instructions: string
  confidence: number
  isConfirmed: boolean
  isEditing: boolean
  setReminder: boolean
  plainLangExplanation: string
}

const INITIAL_MEDICINES: ExtractedMedicine[] = [
  {
    id: 'm1',
    name: 'Levothyroxine',
    strength: '50 mcg',
    dose: '1 tablet',
    frequency: 'Once daily',
    duration: '90 days',
    instructions: 'Before breakfast, on an empty stomach',
    confidence: 0.96,
    isConfirmed: false,
    isEditing: false,
    setReminder: true,
    plainLangExplanation:
      'A thyroid hormone replacement used to treat an underactive thyroid (hypothyroidism). It helps restore normal hormone levels in the body.',
  },
  {
    id: 'm2',
    name: 'Metformin',
    strength: '500 mg',
    dose: '1 tablet',
    frequency: 'Twice daily',
    duration: '90 days',
    instructions: 'With meals',
    confidence: 0.91,
    isConfirmed: false,
    isEditing: false,
    setReminder: true,
    plainLangExplanation:
      'Commonly used to manage blood sugar levels. Often prescribed for PCOS as well, as it can help with insulin resistance.',
  },
  {
    id: 'm3',
    name: 'Tab ???',  // Simulates a low-confidence extraction
    strength: '???',
    dose: '1 tablet',
    frequency: 'Once daily',
    duration: '30 days',
    instructions: '',
    confidence: 0.38,
    isConfirmed: false,
    isEditing: false,
    setReminder: false,
    plainLangExplanation: '',
  },
]

// ─── Confidence indicator ─────────────────────────────────────────────────────

function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const color = confidence >= 0.85 ? 'bg-success' : confidence >= 0.6 ? 'bg-warning' : 'bg-destructive'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
    </div>
  )
}

// ─── Medicine card ─────────────────────────────────────────────────────────────

function MedicineCard({
  med,
  onChange,
  onConfirm,
  onToggleEdit,
  onToggleReminder,
}: {
  med: ExtractedMedicine
  onChange: (id: string, field: string, val: string) => void
  onConfirm: (id: string) => void
  onToggleEdit: (id: string) => void
  onToggleReminder: (id: string) => void
}) {
  const isLowConf = med.confidence < 0.6
  const isMedConf = med.confidence >= 0.6 && med.confidence < 0.85
  const isHighConf = med.confidence >= 0.85

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border p-4 space-y-3 transition-colors',
        med.isConfirmed
          ? 'border-success/40 bg-success/5'
          : isLowConf
          ? 'border-destructive/40 bg-destructive/5'
          : isMedConf
          ? 'border-warning/40 bg-warning/5'
          : 'border-border bg-card'
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {med.isConfirmed ? (
              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            ) : isLowConf ? (
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
            ) : null}
            <h3 className="font-semibold">{med.name}</h3>
            <Badge
              variant={med.isConfirmed ? 'success' : isLowConf ? 'destructive' : isMedConf ? 'warning' : 'secondary'}
              className="text-xs"
            >
              {med.isConfirmed ? 'Confirmed' : isLowConf ? 'Needs confirmation' : isMedConf ? 'Please verify' : 'AI confident'}
            </Badge>
          </div>
          <ConfidenceBar confidence={med.confidence} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleEdit(med.id)}
          className="h-7 w-7 shrink-0"
          aria-label="Edit"
        >
          {med.isEditing ? <ChevronUp className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Low confidence alert */}
      {isLowConf && !med.isConfirmed && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Please confirm with your doctor or pharmacist</AlertTitle>
          <AlertDescription>
            We could not read this medicine name or dose clearly. Do <strong>not</strong> rely on this entry as-is. Please verify before saving.
          </AlertDescription>
        </Alert>
      )}

      {/* Fields — either summary or editable */}
      {med.isEditing ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Medicine name</Label>
            <Input value={med.name} onChange={(e) => onChange(med.id, 'name', e.target.value)} className="h-8 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Strength</Label>
            <Input value={med.strength} onChange={(e) => onChange(med.id, 'strength', e.target.value)} className="h-8 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Dose</Label>
            <Input value={med.dose} onChange={(e) => onChange(med.id, 'dose', e.target.value)} className="h-8 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Frequency</Label>
            <Select value={med.frequency} onValueChange={(v) => onChange(med.id, 'frequency', v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEDICINE_FREQUENCIES.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Duration</Label>
            <Input value={med.duration} onChange={(e) => onChange(med.id, 'duration', e.target.value)} className="h-8 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Instructions</Label>
            <Input value={med.instructions} onChange={(e) => onChange(med.id, 'instructions', e.target.value)} className="h-8 text-sm" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-foreground">Strength</span><span className="col-span-2 font-medium">{med.strength || '—'}</span>
          <span className="text-muted-foreground">Dose</span><span className="col-span-2 font-medium">{med.dose || '—'}</span>
          <span className="text-muted-foreground">Frequency</span><span className="col-span-2 font-medium">{med.frequency || '—'}</span>
          <span className="text-muted-foreground">Duration</span><span className="col-span-2 font-medium">{med.duration || '—'}</span>
          {med.instructions && <><span className="text-muted-foreground">Instructions</span><span className="col-span-2 font-medium">{med.instructions}</span></>}
        </div>
      )}

      {/* Plain language explanation */}
      {med.isConfirmed && med.plainLangExplanation && (
        <div className="rounded-lg bg-muted/50 px-3 py-2 flex gap-2">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>What it&apos;s generally used for:</strong> {med.plainLangExplanation}
            <span className="block mt-1 italic">This is general information only — not a substitute for your prescriber&apos;s advice.</span>
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {!isLowConf && (
            <>
              <Switch
                id={`reminder-${med.id}`}
                checked={med.setReminder && med.isConfirmed}
                disabled={!med.isConfirmed}
                onCheckedChange={() => onToggleReminder(med.id)}
              />
              <Label htmlFor={`reminder-${med.id}`} className="text-xs cursor-pointer flex items-center gap-1">
                {med.setReminder && med.isConfirmed ? (
                  <><Bell className="h-3 w-3" /> Reminder on</>
                ) : (
                  <><BellOff className="h-3 w-3 text-muted-foreground" /> Set reminder</>
                )}
              </Label>
            </>
          )}
        </div>
        {!med.isConfirmed && (
          <Button
            size="sm"
            variant={isLowConf ? 'outline' : 'default'}
            onClick={() => onConfirm(med.id)}
            className="gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isLowConf ? 'Confirm (after verification)' : 'Confirm'}
          </Button>
        )}
        {med.isConfirmed && (
          <span className="text-xs text-success flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Confirmed
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function ConfirmPage() {
  const router = useRouter()
  const [medicines, setMedicines] = useState<ExtractedMedicine[]>(INITIAL_MEDICINES)
  const [saving, setSaving] = useState(false)

  const confirmedCount = medicines.filter((m) => m.isConfirmed).length
  const totalCount = medicines.length
  const lowConfCount = medicines.filter((m) => m.confidence < 0.6 && !m.isConfirmed).length

  const handleChange = (id: string, field: string, val: string) => {
    setMedicines((prev) => prev.map((m) => m.id === id ? { ...m, [field]: val } : m))
  }

  const handleConfirm = (id: string) => {
    setMedicines((prev) => prev.map((m) => m.id === id ? { ...m, isConfirmed: true, isEditing: false } : m))
  }

  const handleToggleEdit = (id: string) => {
    setMedicines((prev) => prev.map((m) => m.id === id ? { ...m, isEditing: !m.isEditing } : m))
  }

  const handleToggleReminder = (id: string) => {
    setMedicines((prev) => prev.map((m) => m.id === id ? { ...m, setReminder: !m.setReminder } : m))
  }

  const handleConfirmAll = () => {
    const confirmable = medicines.filter((m) => m.confidence >= 0.6 && !m.isConfirmed)
    setMedicines((prev) => prev.map((m) =>
      confirmable.find((c) => c.id === m.id) ? { ...m, isConfirmed: true } : m
    ))
    toast.success(`${confirmable.length} medicines confirmed!`)
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Prescription saved! Reminders have been created.')
    router.push('/records')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-semibold">Review Prescription</h1>
          <p className="text-sm text-muted-foreground">Confirm each medicine before it becomes a reminder</p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{confirmedCount} of {totalCount} medicines confirmed</span>
            <span className="text-sm text-muted-foreground">{Math.round((confirmedCount / totalCount) * 100)}%</span>
          </div>
          <Progress value={(confirmedCount / totalCount) * 100} />
          {lowConfCount > 0 && (
            <p className="text-xs text-destructive mt-2 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {lowConfCount} {lowConfCount === 1 ? 'item needs' : 'items need'} manual verification
            </p>
          )}
        </CardContent>
      </Card>

      {/* Medicine cards */}
      <div className="space-y-4">
        {medicines.map((med) => (
          <MedicineCard
            key={med.id}
            med={med}
            onChange={handleChange}
            onConfirm={handleConfirm}
            onToggleEdit={handleToggleEdit}
            onToggleReminder={handleToggleReminder}
          />
        ))}
      </div>

      {/* Bottom actions */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleConfirmAll}>
              Confirm all readable items
            </Button>
            <Button
              className="flex-1 gap-2"
              disabled={confirmedCount === 0 || saving}
              onClick={handleSave}
            >
              {saving ? 'Saving…' : `Save ${confirmedCount} confirmed medicine${confirmedCount !== 1 ? 's' : ''}`}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Only confirmed medicines will be saved and can have reminders set.
            Low-confidence items are excluded until you manually verify them.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
