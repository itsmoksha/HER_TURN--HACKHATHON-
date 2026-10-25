'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, FileText, Download, Share2, Trash2,
  Sparkles, AlertTriangle, CheckCircle2, HelpCircle,
  ExternalLink, Calendar, Stethoscope
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PrepareVisitModal } from '@/components/records/prepare-visit-modal'
import { mockDocuments } from '@/lib/db/mock-data'
import { formatDate } from '@/lib/utils'

// Confidence badge component
function ConfidenceBadge({ confidence }: { confidence: number }) {
  if (confidence >= 0.85) {
    return <Badge variant="success" className="text-xs gap-1"><CheckCircle2 className="h-3 w-3" />High confidence</Badge>
  }
  if (confidence >= 0.6) {
    return <Badge variant="warning" className="text-xs gap-1"><HelpCircle className="h-3 w-3" />Please verify</Badge>
  }
  return <Badge variant="destructive" className="text-xs gap-1"><AlertTriangle className="h-3 w-3" />Needs confirmation</Badge>
}

const DOC_TYPE_COLORS: Record<string, string> = {
  Prescription: 'text-plum-950 bg-plum-50 border-plum-200',
  'Lab Report': 'text-blue-700 bg-blue-50 border-blue-200',
  Scan: 'text-teal-700 bg-teal-50 border-teal-200',
  'Discharge Summary': 'text-orange-700 bg-orange-50 border-orange-200',
  'Test Result': 'text-purple-700 bg-purple-50 border-purple-200',
  'Annual Checkup': 'text-green-700 bg-green-50 border-green-200',
}

export default function DocumentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [prepareOpen, setPrepareOpen] = useState(false)

  const doc = mockDocuments.find((d) => d.id === params.id) ?? mockDocuments[1] // default to lab report

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <FileText className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">Document not found.</p>
        <Button variant="outline" onClick={() => router.back()}>Go back</Button>
      </div>
    )
  }

  const colorClass = DOC_TYPE_COLORS[doc.type] || 'text-gray-700 bg-gray-50 border-gray-200'

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Back + header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-serif text-2xl font-semibold truncate">{doc.title}</h1>
            <Badge className={`shrink-0 border ${colorClass}`}>{doc.type}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
            {doc.doctor_name && (
              <span className="flex items-center gap-1">
                <Stethoscope className="h-3.5 w-3.5" />
                {doc.doctor_name}
              </span>
            )}
            {doc.document_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(doc.document_date)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setPrepareOpen(true)}>
            <Stethoscope className="h-3.5 w-3.5" />
            Prepare for visit
          </Button>
          <Button variant="ghost" size="icon" aria-label="Download">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Main content: two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: document preview */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Document Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simulated document preview */}
              <div className="rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-relaxed min-h-[300px] whitespace-pre-wrap overflow-auto">
                {doc.extracted_text || `[Document preview not available in demo mode]\n\nThis would show the original document content here.\n\nFor a PDF, a rendered page preview would appear.\nFor an image (photo of prescription), the scanned image would be shown.`}
              </div>
              <Button variant="outline" className="w-full mt-3 gap-2" size="sm">
                <ExternalLink className="h-3.5 w-3.5" />
                Open full document
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: AI analysis */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
          {/* AI Summary */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                AI Plain-Language Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {doc.ai_summary || 'AI summary not yet generated for this document.'}
              </p>
            </CardContent>
          </Card>

          {/* Tabs: Extracted Fields / Glossary / Flagged Items */}
          <Tabs defaultValue="fields">
            <TabsList className="w-full">
              <TabsTrigger value="fields" className="flex-1">Extracted Data</TabsTrigger>
              <TabsTrigger value="glossary" className="flex-1">Glossary</TabsTrigger>
              <TabsTrigger value="flags" className="flex-1">Flagged</TabsTrigger>
            </TabsList>

            {/* Extracted fields */}
            <TabsContent value="fields" className="mt-3">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  {doc.extracted_fields && doc.extracted_fields.length > 0 ? (
                    doc.extracted_fields.map((field, i) => (
                      <div key={i} className="flex items-start justify-between gap-3 py-2 border-b last:border-0">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{field.field_name}</p>
                          <p className="text-sm font-medium mt-0.5">{field.field_value || field.user_edited_value || '—'}</p>
                        </div>
                        <ConfidenceBadge confidence={field.confidence ?? 0.9} />
                      </div>
                    ))
                  ) : (
                    // Demo fallback extracted fields for lab report
                    [
                      { label: 'TSH', value: '4.2 mIU/L', confidence: 0.97, note: 'Normal range: 0.4–4.5' },
                      { label: 'T3', value: '98 ng/dL', confidence: 0.95, note: 'Normal range: 80–200' },
                      { label: 'T4', value: '7.8 µg/dL', confidence: 0.95, note: 'Normal range: 5.1–14.1' },
                      { label: 'HbA1c', value: '5.7%', confidence: 0.98, note: 'Pre-diabetic range starts at 5.7%' },
                      { label: 'Vitamin D', value: '18 ng/mL', confidence: 0.93, note: 'Deficient: <20 ng/mL' },
                    ].map((f) => (
                      <div key={f.label} className="flex items-start justify-between gap-3 py-2 border-b last:border-0">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{f.label}</p>
                          <p className="text-sm font-semibold mt-0.5">{f.value}</p>
                          <p className="text-xs text-muted-foreground">{f.note}</p>
                        </div>
                        <ConfidenceBadge confidence={f.confidence} />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Glossary */}
            <TabsContent value="glossary" className="mt-3">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  {[
                    { term: 'TSH', meaning: 'Thyroid Stimulating Hormone — controls how active your thyroid gland is. High TSH can mean an underactive thyroid.' },
                    { term: 'HbA1c', meaning: 'Glycated Haemoglobin — shows your average blood sugar over ~3 months. 5.7% is the start of the pre-diabetic range.' },
                    { term: 'Vitamin D', meaning: 'A vitamin your body makes from sunlight, essential for bones, immunity, and mood. Below 20 ng/mL is considered deficient.' },
                    { term: 'T3 & T4', meaning: 'Thyroid hormones. T3 is the active form; T4 is converted to T3 by the body. Both are produced by the thyroid gland.' },
                  ].map((g) => (
                    <div key={g.term} className="py-2 border-b last:border-0">
                      <p className="text-sm font-semibold">{g.term}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{g.meaning}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Flagged items */}
            <TabsContent value="flags" className="mt-3">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  {[
                    { item: 'Vitamin D: 18 ng/mL', reason: 'Below normal range (< 20 ng/mL). This is in the deficient range. Supplementation is commonly recommended.', level: 'warning' },
                    { item: 'HbA1c: 5.7%', reason: 'At the pre-diabetic threshold (≥5.7%). Regular monitoring and lifestyle adjustments are advisable.', level: 'warning' },
                  ].map((flag) => (
                    <div key={flag.item} className={`rounded-lg border p-3 ${flag.level === 'warning' ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/20' : 'border-red-300 bg-red-50 dark:bg-red-950/20'}`}>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${flag.level === 'warning' ? 'text-amber-600' : 'text-red-600'}`} />
                        <div>
                          <p className="text-sm font-semibold">{flag.item}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{flag.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-1">
                    ℹ️ These flags are informational only. Always discuss results with your doctor.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <PrepareVisitModal open={prepareOpen} onClose={() => setPrepareOpen(false)} />
    </div>
  )
}
