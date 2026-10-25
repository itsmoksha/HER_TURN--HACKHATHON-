'use client'

import { motion } from 'framer-motion'
import {
  Activity, TrendingUp, TrendingDown, Bell, ChevronRight,
  Stethoscope, BookOpen, AlertTriangle, CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { LabTrendChart } from '@/components/women/lab-trend-chart'
import { mockLabTrends } from '@/lib/db/mock-data'
import { toast } from 'sonner'

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

// ─── PCOS explainer data ──────────────────────────────────────────────────────

const PCOS_QA = [
  { q: 'What is PCOS?', a: 'Polycystic Ovary Syndrome (PCOS) is a hormonal condition that affects women of reproductive age. The ovaries may develop many small fluid-filled sacs and may not regularly release eggs. It\'s one of the most common hormonal disorders in India.' },
  { q: 'What are the main symptoms?', a: 'Irregular or missed periods, excess facial or body hair (hirsutism), acne, weight gain especially around the belly, thinning hair on the scalp, and difficulty getting pregnant. Not all women have all symptoms.' },
  { q: 'What causes it?', a: 'The exact cause is not fully known, but insulin resistance and genetics play a role. If your mother or sister has PCOS, you\'re more likely to have it too.' },
]

const PCOS_DOCTOR_QS = [
  'What is my AMH level and what does it mean for my fertility?',
  'Should I check my insulin resistance / fasting insulin?',
  'Is there a risk of my PCOS worsening over time?',
  'How often should I have a pelvic ultrasound?',
  'Are there any lifestyle changes that would help most in my case?',
]

// ─── Thyroid explainer data ────────────────────────────────────────────────────

const THYROID_QA = [
  { q: 'What is hypothyroidism?', a: 'An underactive thyroid means your thyroid gland doesn\'t produce enough thyroid hormone. This slows down many of your body\'s functions — metabolism, heart rate, and digestion.' },
  { q: 'What does TSH measure?', a: 'TSH (Thyroid Stimulating Hormone) is produced by your brain\'s pituitary gland. When your thyroid is underactive, TSH goes up to try to stimulate it more. A TSH above 4.5 usually suggests an underactive thyroid.' },
  { q: 'Why does Vitamin D matter?', a: 'Vitamin D deficiency is very common in India and can worsen thyroid symptoms. Low Vitamin D is linked to autoimmune thyroid disease. Regular supplementation is often recommended.' },
]

const THYROID_DOCTOR_QS = [
  'Should my Levothyroxine dose be adjusted based on my latest TSH?',
  'How often do I need to recheck my thyroid panel?',
  'Is my TSH in the ideal range for someone with PCOS?',
  'Should I check for thyroid antibodies (TPO, TgAb)?',
  'What are the signs that my dose is too high or too low?',
]

// ─── TSH trend data ───────────────────────────────────────────────────────────

const TSH_TREND = [
  { date: 'Mar 2026', value: 7.2, label: '7.2' },
  { date: 'Jun 2026', value: 6.8, label: '6.8' },
  { date: 'Sep 2026', value: 4.2, label: '4.2' },
]

const VITD_TREND = [
  { date: 'Mar 2026', value: 10, label: '10' },
  { date: 'Jun 2026', value: 12, label: '12' },
  { date: 'Sep 2026', value: 18, label: '18' },
]

// ─── Screening reminders ──────────────────────────────────────────────────────

const SCREENINGS = [
  { name: 'Pap smear (cervical screening)', frequency: 'Every 3 years', lastDone: 'Aug 2024', nextDue: 'Aug 2027', status: 'ok' },
  { name: 'Breast self-exam', frequency: 'Monthly', lastDone: 'Oct 2026', nextDue: 'Nov 2026', status: 'ok' },
  { name: 'Thyroid function test', frequency: 'Every 6 months', lastDone: 'Sep 2026', nextDue: 'Mar 2027', status: 'ok' },
  { name: 'Blood glucose / HbA1c', frequency: 'Annually', lastDone: 'Sep 2026', nextDue: 'Sep 2027', status: 'ok' },
  { name: 'Vitamin D retest', frequency: 'Every 3 months (while supplementing)', lastDone: 'Sep 2026', nextDue: 'Dec 2026', status: 'due-soon' },
  { name: 'Pelvic ultrasound (PCOS monitoring)', frequency: 'Annually', lastDone: 'Jul 2026', nextDue: 'Jul 2027', status: 'ok' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConditionsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <motion.div {...fadeIn()}>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-3xl font-semibold">Your Health Profile</h1>
        </div>
        <p className="text-muted-foreground">Personalised insights for your conditions, based on your lab records.</p>
      </motion.div>

      {/* ═══ PCOS Section ════════════════════════════════════════════════════ */}
      <motion.div {...fadeIn(0.05)} className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-primary" />
          <h2 className="font-serif text-2xl font-semibold">PCOS</h2>
          <Badge variant="secondary">Active condition</Badge>
        </div>

        {/* Plain-language explainer */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Understanding your PCOS</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {PCOS_QA.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="text-sm text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Lab values relevant to PCOS */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Your relevant lab values</CardTitle>
            <CardDescription>From your Thyrocare lab report (10 Sep 2026)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'HbA1c', value: '5.7%', note: 'Pre-diabetic threshold — monitor closely', color: 'text-warning' },
                { label: 'Fasting Insulin', value: 'Not tested', note: 'Consider requesting this test', color: 'text-muted-foreground' },
                { label: 'LH/FSH ratio', value: 'Not in report', note: 'Useful for PCOS diagnosis', color: 'text-muted-foreground' },
                { label: 'Vitamin D', value: '18 ng/mL', note: 'Deficient — can worsen PCOS', color: 'text-warning' },
              ].map((v) => (
                <div key={v.label} className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase">{v.label}</p>
                  <p className={`text-lg font-bold mt-0.5 ${v.color}`}>{v.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{v.note}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Questions for gynecologist */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              Questions to ask your gynaecologist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {PCOS_DOCTOR_QS.map((q) => (
              <div key={q} className="flex items-start gap-2 text-sm py-1.5 border-b last:border-0">
                <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{q}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══ Thyroid Section ══════════════════════════════════════════════════ */}
      <motion.div {...fadeIn(0.1)} className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-rose-400" />
          <h2 className="font-serif text-2xl font-semibold">Thyroid (Hypothyroidism)</h2>
          <Badge variant="secondary">Active condition</Badge>
        </div>

        {/* TSH trend chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Your TSH trend</CardTitle>
            <CardDescription>
              TSH is improving 📉 — from 7.2 (Mar) → 4.2 (Sep). Normal range: 0.4–4.5 mIU/L
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LabTrendChart
              title="TSH levels over time"
              subtitle="Thyroid Stimulating Hormone"
              unit="mIU/L"
              normalRange={{ min: 0.4, max: 4.5, label: 'Normal: 0.4–4.5 mIU/L' }}
              data={TSH_TREND}
              strokeColor="#4A1C40"
            />
            <div className="flex items-center gap-2 mt-3">
              <TrendingDown className="h-4 w-4 text-success" />
              <p className="text-xs text-success font-medium">TSH is moving in the right direction with treatment!</p>
            </div>
          </CardContent>
        </Card>

        {/* Vitamin D trend chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Vitamin D trend</CardTitle>
            <CardDescription>
              Improving 📈 but still deficient. Normal: &gt;30 ng/mL. Supplementing with Vitamin D3 60,000 IU weekly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LabTrendChart
              title="Vitamin D levels over time"
              subtitle="25-OH Vitamin D"
              unit="ng/mL"
              normalRange={{ min: 30, max: 100, label: 'Normal: >30 ng/mL' }}
              data={VITD_TREND}
              strokeColor="#E8A0A0"
            />
            <div className="flex items-center gap-2 mt-3">
              <TrendingUp className="h-4 w-4 text-warning" />
              <p className="text-xs text-warning font-medium">Still below normal range — continue supplementation and retest in Dec 2026.</p>
            </div>
          </CardContent>
        </Card>

        {/* Plain-language thyroid explainer */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Understanding your thyroid condition</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {THYROID_QA.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="text-sm text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Questions for endocrinologist */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              Questions to ask your endocrinologist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {THYROID_DOCTOR_QS.map((q) => (
              <div key={q} className="flex items-start gap-2 text-sm py-1.5 border-b last:border-0">
                <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{q}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══ Screening Reminders ══════════════════════════════════════════════ */}
      <motion.div {...fadeIn(0.15)} className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-success" />
          <h2 className="font-serif text-2xl font-semibold">Screening Reminders</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Age-appropriate health screenings for you (29 years old). These are general guidance — discuss timing with your doctor.
        </p>

        <Card>
          <CardContent className="pt-4 divide-y">
            {SCREENINGS.map((s) => (
              <div key={s.name} className="py-3 flex items-center gap-3">
                {s.status === 'ok' ? (
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.frequency} · Last: {s.lastDone} · Next: <span className={s.status === 'due-soon' ? 'text-warning font-medium' : ''}>{s.nextDue}</span>
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0 text-xs h-7"
                  onClick={() => toast.success(`Reminder set for ${s.name}`)}
                >
                  <Bell className="h-3 w-3 mr-1" />
                  Remind
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          ℹ️ Screening recommendations are general guidance based on your age range. Always follow your doctor&apos;s personalised advice.
        </p>
      </motion.div>
    </div>
  )
}
