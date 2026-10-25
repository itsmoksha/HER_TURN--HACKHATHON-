'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  X,
  Sparkles
} from 'lucide-react'

export interface ConfidenceFieldProps {
  label: string
  value: string
  confidence: number // 0.0 to 1.0 (or 0 to 100)
  onChange?: (newValue: string) => void
  options?: string[] // If provided, renders select dropdown instead of text input
  multiline?: boolean
  isConfirmed?: boolean
  onConfirm?: () => void
  disabled?: boolean
  helperText?: string
  warningThreshold?: number // below which amber warning is shown, default 0.80
  lowThreshold?: number // below which red chip is shown, default 0.60
}

export function ConfidenceField({
  label,
  value,
  confidence,
  onChange,
  options,
  multiline = false,
  isConfirmed = false,
  onConfirm,
  disabled = false,
  helperText,
  warningThreshold = 0.85,
  lowThreshold = 0.60,
}: ConfidenceFieldProps) {
  // Normalize confidence to 0-100%
  const normalizedConf = confidence > 1 ? confidence : Math.round(confidence * 100)
  const isHigh = normalizedConf >= warningThreshold * 100
  const isMedium = normalizedConf >= lowThreshold * 100 && normalizedConf < warningThreshold * 100
  const isLow = normalizedConf < lowThreshold * 100

  const [isEditing, setIsEditing] = useState(false)
  const [currentVal, setCurrentVal] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setCurrentVal(value)
  }, [value])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    setIsEditing(false)
    if (onChange && currentVal !== value) {
      onChange(currentVal)
    }
  }

  const handleCancel = () => {
    setCurrentVal(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  // Confidence styling
  let badgeConfig = {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    label: 'High confidence',
  }

  if (isMedium) {
    badgeConfig = {
      bg: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      dot: 'bg-amber-500',
      label: 'Please verify',
    }
  } else if (isLow) {
    badgeConfig = {
      bg: 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
      dot: 'bg-rose-500',
      label: 'Needs confirmation',
    }
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card p-3.5 transition-all hover:border-plum-200 dark:hover:border-plum-900">
      {/* Header: Label + Confidence Badge */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </label>

        {/* Confidence chip */}
        <div
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${badgeConfig.bg}`}
          title={`AI Extraction confidence: ${normalizedConf}%`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dot} animate-pulse`} />
          <span>{normalizedConf}%</span>
          <span className="opacity-80">({badgeConfig.label})</span>
        </div>
      </div>

      {/* Value Display or Inline Edit Form */}
      <div className="mt-1">
        {isEditing ? (
          <div className="space-y-2">
            {options ? (
              <select
                aria-label={label}
                value={currentVal}
                onChange={(e) => setCurrentVal(e.target.value)}
                className="w-full rounded-lg border border-plum-300 bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-plum-600 dark:border-plum-700"
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : multiline ? (
              <textarea
                aria-label={label}
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={currentVal}
                onChange={(e) => setCurrentVal(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                className="w-full rounded-lg border border-plum-300 bg-background p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-plum-600 dark:border-plum-700 leading-relaxed"
              />
            ) : (
              <input
                aria-label={label}
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={currentVal}
                onChange={(e) => setCurrentVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-lg border border-plum-300 bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-plum-600 dark:border-plum-700"
              />
            )}

            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-plum-950 text-white hover:bg-plum-900 transition-colors shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm font-medium text-foreground leading-snug break-words flex-1">
              {currentVal || (
                <span className="italic text-muted-foreground text-xs">Not specified</span>
              )}
            </div>

            {!disabled && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                title="Edit field value"
                className="p-1 rounded-md text-muted-foreground hover:text-plum-900 hover:bg-plum-50 dark:hover:text-rose-soft dark:hover:bg-plum-950 transition-colors shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Warning banner for low or medium confidence values */}
      {(isLow || isMedium) && (
        <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-amber-50/80 p-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-200/80 dark:border-amber-900/60">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-tight text-[11px]">
            {isLow ? (
              <span className="font-semibold text-rose-700 dark:text-rose-300">
                Low clarity handwriting: Please confirm this detail with your doctor or pharmacist.
              </span>
            ) : (
              <span>Please review and confirm this extracted value matches your physical slip.</span>
            )}
          </p>
        </div>
      )}

      {helperText && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}
