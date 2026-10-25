'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Upload, Camera, FileText, CheckCircle2, Loader2, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DOCUMENT_TYPES } from '@/lib/constants'
import { cn } from '@/lib/utils'

type UploadStep = 'idle' | 'selected' | 'uploading' | 'extracting' | 'analysing' | 'done' | 'error'

const STEP_LABELS: Record<UploadStep, string> = {
  idle: 'Ready to upload',
  selected: 'File selected',
  uploading: 'Uploading…',
  extracting: 'Extracting text with AI…',
  analysing: 'Analysing document…',
  done: 'Done!',
  error: 'Something went wrong',
}

const STEP_PROGRESS: Record<UploadStep, number> = {
  idle: 0,
  selected: 10,
  uploading: 30,
  extracting: 60,
  analysing: 85,
  done: 100,
  error: 0,
}

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [docType, setDocType] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [docDate, setDocDate] = useState('')
  const [step, setStep] = useState<UploadStep>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback((f: File) => {
    const maxSize = 10 * 1024 * 1024
    if (f.size > maxSize) {
      setError('File is too large. Maximum size is 10 MB.')
      return
    }
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(f.type)) {
      setError('Only PDF, JPG, PNG, and WebP files are supported.')
      return
    }
    setError(null)
    setFile(f)
    setStep('selected')
    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleExtract = async () => {
    if (!file) return
    try {
      setStep('uploading')
      await new Promise((r) => setTimeout(r, 800))
      setStep('extracting')
      await new Promise((r) => setTimeout(r, 1200))
      setStep('analysing')
      await new Promise((r) => setTimeout(r, 1000))
      setStep('done')
      await new Promise((r) => setTimeout(r, 600))
      // In demo mode: redirect to confirmation with a mock document ID
      router.push('/records/confirm/doc_001')
    } catch {
      setStep('error')
      setError('Extraction failed. Please try again.')
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setStep('idle')
    setError(null)
  }

  const isProcessing = ['uploading', 'extracting', 'analysing'].includes(step)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-semibold">Upload Document</h1>
          <p className="text-sm text-muted-foreground">Add a prescription, lab report, or any health document</p>
        </div>
      </div>

      {/* Upload zone */}
      <Card>
        <CardContent className="pt-6">
          {step === 'idle' || step === 'selected' ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                'relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center cursor-pointer',
                isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/50 hover:bg-muted/30',
                file && 'border-success/50 bg-success/5'
              )}
              onClick={() => !file && document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />

              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Drop your file here, or <span className="text-primary underline">browse</span></p>
                      <p className="text-sm text-muted-foreground mt-1">PDF, JPG, PNG · Max 10 MB</p>
                    </div>
                    {/* Camera capture for mobile */}
                    <div>
                      <label
                        htmlFor="camera-input"
                        className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Camera className="h-4 w-4" />
                        Take a photo
                      </label>
                      <input
                        id="camera-input"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="sr-only"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {preview ? (
                      <img src={preview} alt="Document preview" className="mx-auto max-h-32 rounded-lg object-cover" />
                    ) : (
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                        <FileText className="h-8 w-8 text-success" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-success">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-muted-foreground"
                      onClick={(e) => { e.stopPropagation(); reset() }}
                    >
                      <X className="h-3.5 w-3.5" /> Remove
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Processing state */
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                {step === 'done' ? (
                  <CheckCircle2 className="h-8 w-8 text-success" />
                ) : (
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                )}
              </div>
              <div>
                <p className="font-semibold">{STEP_LABELS[step]}</p>
                {step !== 'done' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {step === 'extracting' ? 'Gemini AI is reading your document…' :
                     step === 'analysing' ? 'Identifying medicines and values…' :
                     'Please wait…'}
                  </p>
                )}
              </div>
              <Progress value={STEP_PROGRESS[step]} className="max-w-xs mx-auto" />

              {/* Step indicators */}
              <div className="flex items-center justify-center gap-6 text-xs">
                {(['uploading', 'extracting', 'analysing', 'done'] as UploadStep[]).map((s, i) => {
                  const steps: UploadStep[] = ['uploading', 'extracting', 'analysing', 'done']
                  const stepIdx = steps.indexOf(step)
                  const isDone = i < stepIdx || step === 'done'
                  const isCurrent = s === step
                  return (
                    <div key={s} className={cn('flex items-center gap-1', isDone ? 'text-success' : isCurrent ? 'text-primary' : 'text-muted-foreground/40')}>
                      <div className={cn('h-1.5 w-1.5 rounded-full', isDone ? 'bg-success' : isCurrent ? 'bg-primary' : 'bg-muted-foreground/20')} />
                      <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                {error}
                <Button variant="ghost" size="sm" onClick={reset}>Try again</Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Document metadata */}
      {file && step === 'selected' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="font-semibold">Document details</h2>
              <div className="space-y-1.5">
                <Label htmlFor="doc-type">Document type <span className="text-destructive">*</span></Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger id="doc-type">
                    <SelectValue placeholder="Select type…" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="doctor-name">Doctor name</Label>
                  <Input id="doctor-name" placeholder="e.g., Dr. Anita Rao" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="doc-date">Document date</Label>
                  <Input id="doc-date" type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} />
                </div>
              </div>

              {docType === 'Prescription' && (
                <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 flex items-start gap-2">
                  <span className="text-primary text-sm">✨</span>
                  <p className="text-sm text-primary/80">
                    After upload, our AI will extract your medicines. You&apos;ll review each one before it becomes a reminder.
                  </p>
                </div>
              )}

              <Button
                className="w-full gap-2"
                onClick={handleExtract}
                disabled={!docType}
              >
                <span>✨</span>
                Extract with AI
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Your document is processed securely. Only you can access the results.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
