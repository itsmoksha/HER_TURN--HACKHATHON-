'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileText,
  Calendar,
  User,
  Sparkles,
  Download,
  Trash2,
  ExternalLink,
  Tag,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck
} from 'lucide-react'
import { MedicalDocument, DocumentType } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface DocumentCardProps {
  document: MedicalDocument
  onDelete?: (id: string) => void
  priority?: boolean
}

interface TypeBadgeConfig {
  label: string
  bg: string
  border: string
  text: string
  icon: React.ElementType
}

export const DOCUMENT_TYPE_CONFIG: Record<string, TypeBadgeConfig> = {
  prescription: {
    label: 'Prescription',
    bg: 'bg-plum-50 dark:bg-plum-950/60',
    border: 'border-plum-200 dark:border-plum-800/80',
    text: 'text-plum-900 dark:text-plum-200',
    icon: FileCheck,
  },
  lab_report: {
    label: 'Lab Report',
    bg: 'bg-sky-50 dark:bg-sky-950/60',
    border: 'border-sky-200 dark:border-sky-800/80',
    text: 'text-sky-900 dark:text-sky-200',
    icon: FileText,
  },
  scan: {
    label: 'Scan & Imaging',
    bg: 'bg-teal-50 dark:bg-teal-950/60',
    border: 'border-teal-200 dark:border-teal-800/80',
    text: 'text-teal-900 dark:text-teal-200',
    icon: Eye,
  },
  summary: {
    label: 'Discharge Summary',
    bg: 'bg-sand-100 dark:bg-sand-900/40',
    border: 'border-amber-200 dark:border-amber-800/80',
    text: 'text-amber-950 dark:text-amber-200',
    icon: FileText,
  },
  other: {
    label: 'Clinical Document',
    bg: 'bg-stone-100 dark:bg-stone-900/60',
    border: 'border-stone-200 dark:border-stone-800/80',
    text: 'text-stone-900 dark:text-stone-200',
    icon: FileText,
  },
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const config =
    DOCUMENT_TYPE_CONFIG[document.type] || DOCUMENT_TYPE_CONFIG.other
  const TypeIcon = config.icon

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success(`Downloading "${document.file_name}"`, {
      description: 'Your medical file is being securely prepared.',
    })
    // Simulate anchor trigger
    const link = window.document.createElement('a')
    link.href = document.file_url
    link.download = document.file_name
    link.target = '_blank'
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`Are you sure you want to remove "${document.title}"?`)) {
      setIsDeleting(true)
      setTimeout(() => {
        if (onDelete) {
          onDelete(document.id)
        }
        toast.info('Record moved to archive')
      }, 200)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: isDeleting ? 0 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:border-plum-300 dark:hover:border-plum-700 hover:shadow-xl hover:shadow-plum-950/5"
    >
      <Link
        href={`/records/${document.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-700 focus-visible:ring-offset-2 rounded-xl"
      >
        {/* Top Header Row: Type Badge + AI Summary Indicator */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.border} ${config.text}`}
          >
            <TypeIcon className="w-3.5 h-3.5" />
            {config.label}
          </span>

          {document.ai_summary && (
            <span
              title="AI Plain-Language Summary Generated"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-plum-50 text-plum-900 border border-plum-200/70 dark:bg-plum-950/80 dark:text-plum-200 dark:border-plum-800"
            >
              <Sparkles className="w-3 h-3 text-plum-600 dark:text-rose-soft animate-pulse" />
              <span>AI Explained</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-plum-950 dark:group-hover:text-plum-300 transition-colors">
          {document.title}
        </h3>

        {/* Doctor & Date Metadata */}
        <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-muted-foreground">
          {document.doctor_name && (
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-plum-700/70 dark:text-plum-400 shrink-0" />
              <span className="truncate font-medium">{document.doctor_name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
            <span>{formatDate(document.document_date)}</span>
          </div>
        </div>

        {/* Brief excerpt or AI snippet */}
        <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {document.ai_summary || document.extracted_text?.slice(0, 140) || 'No summary available.'}
        </p>

        {/* Tags Row */}
        {document.tags && document.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 items-center">
            {document.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-secondary/80 text-secondary-foreground border border-border/50"
              >
                <Tag className="w-2.5 h-2.5 opacity-60" />
                {tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground font-medium pl-0.5">
                +{document.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Card Footer with Quick Actions */}
      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
        <Link
          href={`/records/${document.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-plum-900 hover:text-plum-700 dark:text-rose-soft dark:hover:text-rose-200 transition-colors"
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download Document"
            title="Download original file"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete Document"
            title="Remove document"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
