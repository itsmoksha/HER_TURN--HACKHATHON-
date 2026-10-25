'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Phone, MapPin, Clock, Heart, Stethoscope, ChevronRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

// ─── Emergency section ─────────────────────────────────────────────────────────

const EMERGENCY_SIGNS = [
  'Chest pain or pressure, especially with sweating or arm pain',
  'Difficulty breathing or shortness of breath',
  'Severe or heavy bleeding (more than a pad an hour)',
  'Loss of consciousness or fainting',
  'Sudden severe headache — "worst headache of your life"',
  'Signs of stroke: face drooping, arm weakness, slurred speech (FAST)',
  'Severe abdominal pain, especially during pregnancy',
  'Feeling of wanting to harm yourself or others',
  'High fever (>103°F/39.5°C) with rash and stiff neck',
  'Blurred vision, severe swelling during pregnancy (pre-eclampsia signs)',
]

// ─── Triage guide ──────────────────────────────────────────────────────────────

const SELF_CARE = [
  'Mild headache (not severe or sudden)',
  'Common cold, cough, mild sore throat',
  'Minor cuts and scrapes (properly cleaned)',
  'Mild menstrual cramps',
  'Mild fatigue, low energy',
  'Mild nausea without vomiting',
  'Bug bites (unless allergic reaction)',
]

const SEE_DOCTOR = [
  'Persistent fever (more than 3 days)',
  'Recurring headaches or migraines',
  'Unusual vaginal discharge or odour',
  'Missed period (when not planned)',
  'Severe or worsening menstrual pain',
  'Unexplained weight gain or loss',
  'Mood changes significantly affecting daily life',
  'Palpitations or racing heart (non-urgent)',
  'Persistent fatigue not improving with rest',
  'Any new lump or skin change',
]

// ─── Condition-specific guidance ───────────────────────────────────────────────

const CONDITION_GUIDANCE = [
  {
    condition: 'PCOS',
    urgent: ['Severe pelvic pain', 'Signs of ovarian torsion (sudden, severe one-sided pain)', 'Heavy bleeding that won\'t stop'],
    monitor: ['Irregular periods (track and report to gynaecologist)', 'Excess hair growth or acne worsening', 'Mood changes or anxiety'],
    specialist: 'Gynaecologist / Endocrinologist',
  },
  {
    condition: 'Thyroid (Hypothyroidism)',
    urgent: ['Thyroid storm symptoms: rapid heartbeat, high fever, confusion (rare)', 'Severe swelling in the neck'],
    monitor: ['Unusual fatigue or cold intolerance', 'Weight changes', 'Memory or concentration issues', 'TSH outside range — retest'],
    specialist: 'Endocrinologist',
  },
  {
    condition: 'Pregnancy',
    urgent: ['Any bleeding after 12 weeks', 'Severe abdominal pain', 'Reduced fetal movement after 28 weeks', 'Sudden swelling in face/hands/feet', 'Blurred vision or severe headache', 'Water breaking before 37 weeks'],
    monitor: ['Mild nausea, especially first trimester', 'Back pain', 'Heartburn'],
    specialist: 'OB-GYN / Obstetrician',
  },
  {
    condition: 'Anemia',
    urgent: ['Extreme dizziness or fainting', 'Chest pain with very low haemoglobin', 'Shortness of breath at rest'],
    monitor: ['Fatigue, pallor, cold hands/feet', 'Hair loss or brittle nails', 'Pica (craving non-food items like chalk/mud)'],
    specialist: 'General Physician / Haematologist',
  },
  {
    condition: 'Mental Health',
    urgent: ['Any thoughts of suicide or self-harm — call iCall: 9152987821 or NIMHANS: 080-46110007', 'Psychosis or loss of touch with reality'],
    monitor: ['Persistent sadness >2 weeks', 'Loss of interest in daily activities', 'Significant sleep or appetite changes', 'Anxiety interfering with daily life'],
    specialist: 'Psychiatrist / Psychologist / Counsellor',
  },
]

// ─── Demo clinics ─────────────────────────────────────────────────────────────

const DEMO_CLINICS = [
  { name: "Dr. Kavitha Women's Clinic", area: 'Koramangala, Bangalore', specialty: 'Gynaecologist / OB-GYN', wait: 'Appt required', type: 'clinic' },
  { name: 'Apollo Diagnostics', area: 'Indiranagar, Bangalore', specialty: 'Diagnostic Lab', wait: 'Walk-in', type: 'lab' },
  { name: 'Columbia Asia Multispeciality', area: 'Hebbal, Bangalore', specialty: 'Endocrinologist / Multispeciality', wait: 'Appt required', type: 'hospital' },
  { name: 'Manipal Hospital', area: 'HAL, Bangalore', specialty: 'Emergency / Multispeciality', wait: 'Walk-in (ER open 24/7)', type: 'emergency' },
]

const CLINIC_TYPE_COLORS: Record<string, string> = {
  clinic: 'bg-plum-50 text-plum-950 border-plum-200',
  lab: 'bg-blue-50 text-blue-700 border-blue-200',
  hospital: 'bg-teal-50 text-teal-700 border-teal-200',
  emergency: 'bg-red-50 text-red-700 border-red-200',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GuidancePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div {...fadeIn()}>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-3xl font-semibold">Health Guidance</h1>
        </div>
        <p className="text-muted-foreground">When to self-care, when to call your doctor, when to go now.</p>
      </motion.div>

      {/* ⚠️ Emergency — always at top */}
      <motion.div {...fadeIn(0.05)}>
        <Card className="border-2 border-destructive/60 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              When to seek IMMEDIATE emergency care
            </CardTitle>
            <CardDescription className="text-destructive/80">
              Do not wait. Call 102 or 112, or go to your nearest Emergency Room NOW.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {EMERGENCY_SIGNS.map((sign) => (
              <div key={sign} className="flex items-start gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                {sign}
              </div>
            ))}
            <div className="mt-4 flex gap-2 flex-wrap">
              <a href="tel:102" className="inline-flex items-center gap-2 rounded-lg bg-destructive px-5 py-2.5 text-sm font-semibold text-white hover:bg-destructive/90 transition-colors">
                <Phone className="h-4 w-4" /> Call 102 (Ambulance)
              </a>
              <a href="tel:112" className="inline-flex items-center gap-2 rounded-lg border border-destructive px-5 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors">
                <Phone className="h-4 w-4" /> Call 112 (Emergency)
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3-column triage cards */}
      <motion.div {...fadeIn(0.1)} className="grid md:grid-cols-3 gap-4">
        {/* Self care */}
        <Card className="border-success/40 bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-success flex items-center gap-1.5">
              <Heart className="h-4 w-4" /> Self-care is likely fine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {SELF_CARE.map((s) => (
              <p key={s} className="text-xs text-muted-foreground leading-snug flex gap-1.5">
                <span className="text-success mt-0.5">✓</span> {s}
              </p>
            ))}
            <p className="text-xs font-medium text-success mt-2">Rest, hydration, OTC medicines as appropriate.</p>
          </CardContent>
        </Card>

        {/* See doctor */}
        <Card className="border-warning/40 bg-warning/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-warning flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Book a doctor visit soon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {SEE_DOCTOR.map((s) => (
              <p key={s} className="text-xs text-muted-foreground leading-snug flex gap-1.5">
                <span className="text-warning mt-0.5">→</span> {s}
              </p>
            ))}
            <p className="text-xs font-medium text-warning mt-2">Try to see a doctor within 2–3 days.</p>
          </CardContent>
        </Card>

        {/* Emergency */}
        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-destructive flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> Seek care now
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {EMERGENCY_SIGNS.slice(0, 6).map((s) => (
              <p key={s} className="text-xs text-muted-foreground leading-snug flex gap-1.5">
                <span className="text-destructive mt-0.5">!</span> {s}
              </p>
            ))}
            <p className="text-xs font-medium text-destructive mt-2">Call 102 or go to Emergency Room immediately.</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Condition-specific accordion */}
      <motion.div {...fadeIn(0.15)}>
        <h2 className="font-semibold mb-3 text-lg">Guidance by condition</h2>
        <Card>
          <CardContent className="pt-4">
            <Accordion type="single" collapsible>
              {CONDITION_GUIDANCE.map((cond) => (
                <AccordionItem key={cond.condition} value={cond.condition}>
                  <AccordionTrigger className="font-medium">{cond.condition}</AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-destructive mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" /> Seek urgent care for:
                      </p>
                      {cond.urgent.map((u) => <p key={u} className="text-muted-foreground ml-5">• {u}</p>)}
                    </div>
                    <div>
                      <p className="font-semibold text-warning mb-1.5 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Monitor and discuss with doctor:
                      </p>
                      {cond.monitor.map((m) => <p key={m} className="text-muted-foreground ml-5">• {m}</p>)}
                    </div>
                    <div className="rounded-lg bg-muted/40 px-3 py-2 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-primary shrink-0" />
                      <p className="text-xs">Specialist to see: <strong>{cond.specialist}</strong></p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>

      {/* Find care */}
      <motion.div {...fadeIn(0.2)}>
        <h2 className="font-semibold mb-1 text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" /> Find care near you
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Demo data shows sample clinics in Bangalore. For real results, search on <a href="https://www.practo.com" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">Practo</a> or Google Maps.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {DEMO_CLINICS.map((clinic) => (
            <Card key={clinic.name} className="hover:shadow-card-hover transition-shadow">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    {clinic.type === 'emergency' ? <AlertTriangle className="h-5 w-5 text-destructive" /> :
                     clinic.type === 'lab' ? <Heart className="h-5 w-5 text-blue-500" /> :
                     <Stethoscope className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{clinic.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {clinic.area}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge className={`text-xs border ${CLINIC_TYPE_COLORS[clinic.type]}`}>
                        {clinic.specialty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{clinic.wait}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Mental health helplines */}
      <motion.div {...fadeIn(0.25)}>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Mental Health Support</CardTitle>
            <CardDescription>You are not alone. Help is available.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { name: 'iCall (TISS)', number: '9152987821', hours: 'Mon–Sat, 8AM–10PM' },
              { name: 'NIMHANS Helpline', number: '080-46110007', hours: '24 hours' },
              { name: 'Vandrevala Foundation', number: '1860-2662-345', hours: '24 hours' },
            ].map((h) => (
              <div key={h.name} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{h.hours}</p>
                </div>
                <a href={`tel:${h.number}`} className="flex items-center gap-1.5 text-primary font-medium hover:underline">
                  <Phone className="h-3.5 w-3.5" /> {h.number}
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
