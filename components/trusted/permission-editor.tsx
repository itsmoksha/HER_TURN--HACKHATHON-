'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Shield,
  AlertTriangle,
  FileText,
  Pill,
  Calendar,
  Bell,
  Check,
  ChevronRight,
  Info,
  Lock
} from 'lucide-react'

export type AccessLevel = 'none' | 'view' | 'edit'

export interface ResourcePermission {
  category: 'documents' | 'medicines' | 'appointments' | 'reminders'
  label: string
  description: string
  accessLevel: AccessLevel
  icon: React.ElementType
}

export interface DocumentItem {
  id: string
  title: string
  date: string
  category: string
}

export interface PermissionEditorProps {
  isOpen: boolean
  onClose: () => void
  personName: string
  personRelation: string
  initialPermissions?: Record<string, AccessLevel>
  selectedDocumentIds?: string[]
  availableDocuments?: DocumentItem[]
  onSave: (permissions: Record<string, AccessLevel>, allowedDocIds: string[]) => void
}

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Thyroid Panel & Vitamin D Report',
    date: '14 Oct 2026',
    category: 'Lab Report',
  },
  {
    id: 'doc-2',
    title: 'Pelvic Ultrasound (PCOS Follow-up)',
    date: '28 Sep 2026',
    category: 'Scan / Imaging',
  },
  {
    id: 'doc-3',
    title: 'Gynecologist Prescription (Dr. Neha Rao)',
    date: '15 Aug 2026',
    category: 'Prescription',
  },
  {
    id: 'doc-4',
    title: 'Endocrinology Consultation Notes',
    date: '10 Jun 2026',
    category: 'Summary',
  },
]

export function PermissionEditor({
  isOpen,
  onClose,
  personName,
  personRelation,
  initialPermissions = {
    documents: 'view',
    medicines: 'view',
    appointments: 'edit',
    reminders: 'view',
  },
  selectedDocumentIds = ['doc-1', 'doc-3'],
  availableDocuments = DEFAULT_DOCUMENTS,
  onSave,
}: PermissionEditorProps) {
  const [permissions, setPermissions] = useState<Record<string, AccessLevel>>(initialPermissions)
  const [selectedDocs, setSelectedDocs] = useState<string[]>(selectedDocumentIds)

  // Track if any previously granted permission is being revoked/lowered
  const hasRevokedPermissions = React.useMemo(() => {
    for (const [key, initialVal] of Object.entries(initialPermissions)) {
      const currentVal = permissions[key]
      if (initialVal !== 'none' && currentVal === 'none') return true
      if (initialVal === 'edit' && currentVal === 'view') return true
    }
    return false
  }, [permissions, initialPermissions])

  const setCategoryAccess = (category: string, level: AccessLevel) => {
    setPermissions(prev => ({
      ...prev,
      [category]: level,
    }))
  }

  const toggleDocument = (id: string) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
    )
  }

  const handleSelectAllDocs = () => {
    if (selectedDocs.length === availableDocuments.length) {
      setSelectedDocs([])
    } else {
      setSelectedDocs(availableDocuments.map(d => d.id))
    }
  }

  const handleSave = () => {
    onSave(permissions, selectedDocs)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border/80 flex items-start justify-between bg-plum-50/50 dark:bg-plum-950/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-plum-100 dark:bg-plum-900/60 text-plum-900 dark:text-plum-200">
                  <Shield className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold tracking-wider uppercase text-plum-900 dark:text-plum-300">
                  Access Permissions
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                Manage Access for {personName}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {personRelation} • Tailor what sensitive information is shared
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Warning if revoking permissions */}
            {hasRevokedPermissions && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    Warning: You are lowering access
                  </p>
                  <p className="text-xs text-amber-800/90 dark:text-amber-300/80 mt-0.5">
                    {personName} will no longer have access to selected categories. This will take effect immediately.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Permission categories */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Resource Category Toggles
              </h4>

              {/* 1. Appointments */}
              <div className="p-4 rounded-xl border border-border bg-background/50 hover:border-plum-200 dark:hover:border-plum-800 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-plum-50 dark:bg-plum-950 text-plum-900 dark:text-plum-200 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Appointments</p>
                      <p className="text-xs text-muted-foreground">Doctor visits, dates, clinic locations & notes</p>
                    </div>
                  </div>

                  <div className="inline-flex rounded-lg border border-border p-1 bg-muted/30 self-start sm:self-auto">
                    {(['none', 'view', 'edit'] as AccessLevel[]).map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setCategoryAccess('appointments', level)}
                        className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                          permissions.appointments === level
                            ? 'bg-plum-950 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {level === 'none' ? 'No Access' : level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Medicines */}
              <div className="p-4 rounded-xl border border-border bg-background/50 hover:border-plum-200 dark:hover:border-plum-800 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-plum-50 dark:bg-plum-950 text-plum-900 dark:text-plum-200 flex items-center justify-center">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Medicines & Prescriptions</p>
                      <p className="text-xs text-muted-foreground">Active medications, dosages & doctor instructions</p>
                    </div>
                  </div>

                  <div className="inline-flex rounded-lg border border-border p-1 bg-muted/30 self-start sm:self-auto">
                    {(['none', 'view', 'edit'] as AccessLevel[]).map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setCategoryAccess('medicines', level)}
                        className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                          permissions.medicines === level
                            ? 'bg-plum-950 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {level === 'none' ? 'No Access' : level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Reminders */}
              <div className="p-4 rounded-xl border border-border bg-background/50 hover:border-plum-200 dark:hover:border-plum-800 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-plum-50 dark:bg-plum-950 text-plum-900 dark:text-plum-200 flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Reminders & Adherence</p>
                      <p className="text-xs text-muted-foreground">Medicine alarms and adherence check-ins</p>
                    </div>
                  </div>

                  <div className="inline-flex rounded-lg border border-border p-1 bg-muted/30 self-start sm:self-auto">
                    {(['none', 'view', 'edit'] as AccessLevel[]).map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setCategoryAccess('reminders', level)}
                        className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                          permissions.reminders === level
                            ? 'bg-plum-950 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {level === 'none' ? 'No Access' : level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Documents & Lab Records */}
              <div className="p-4 rounded-xl border border-border bg-background/50 hover:border-plum-200 dark:hover:border-plum-800 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-plum-50 dark:bg-plum-950 text-plum-900 dark:text-plum-200 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Medical Documents & Lab Reports</p>
                      <p className="text-xs text-muted-foreground">Diagnostic lab values, scans, and summaries</p>
                    </div>
                  </div>

                  <div className="inline-flex rounded-lg border border-border p-1 bg-muted/30 self-start sm:self-auto">
                    {(['none', 'view', 'edit'] as AccessLevel[]).map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setCategoryAccess('documents', level)}
                        className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                          permissions.documents === level
                            ? 'bg-plum-950 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {level === 'none' ? 'No Access' : level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific Document Multi-Select Sub-panel */}
                {permissions.documents !== 'none' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-border/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-plum-700" />
                        Choose Specific Documents to Share:
                      </span>
                      <button
                        type="button"
                        onClick={handleSelectAllDocs}
                        className="text-xs text-plum-700 dark:text-plum-300 hover:underline font-medium"
                      >
                        {selectedDocs.length === availableDocuments.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {availableDocuments.map(doc => {
                        const isChecked = selectedDocs.includes(doc.id)
                        return (
                          <div
                            key={doc.id}
                            onClick={() => toggleDocument(doc.id)}
                            className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                              isChecked
                                ? 'bg-plum-50/60 dark:bg-plum-950/40 border-plum-300 dark:border-plum-800'
                                : 'bg-card border-border hover:bg-muted/40'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                  isChecked
                                    ? 'bg-plum-950 border-plum-950 text-white'
                                    : 'border-muted-foreground/50 bg-background'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">{doc.title}</p>
                                <p className="text-[11px] text-muted-foreground">
                                  {doc.category} • {doc.date}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-colors text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-plum-950 hover:bg-plum-900 text-white shadow-sm transition-all focus-ring"
            >
              Save Permissions
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
