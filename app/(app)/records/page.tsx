'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Grid,
  ListOrdered,
  Calendar,
  User,
  FileText,
  FileCheck2,
  Sparkles,
  ArrowUpDown,
  X,
  Clock,
  ChevronRight,
  FolderOpen,
  Eye,
  SlidersHorizontal
} from 'lucide-react'
import { MedicalDocument, DocumentType } from '@/lib/types'
import { getMedicalDocuments, DetailedDocument } from '@/lib/db/queries'
import { DocumentCard, DOCUMENT_TYPE_CONFIG } from '@/components/records/document-card'
import { formatDate } from '@/lib/utils'
import { useDemoMode } from '@/components/providers/demo-mode-provider'

export default function RecordsPage() {
  const { storedDocuments, userRole, caretakerDetails } = useDemoMode()
  const [documents, setDocuments] = useState<DetailedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all')
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid')

  // Fetch documents
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const docs = await getMedicalDocuments()
        // Merge stored user/caretaker uploaded files at the top
        const merged = [...(storedDocuments as any[]), ...docs]
        setDocuments(merged)
      } catch (err) {
        console.error('Failed to load documents', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [storedDocuments])

  // Delete handler
  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  // Doctor list for filter
  const uniqueDoctors = useMemo(() => {
    const set = new Set<string>()
    documents.forEach((d) => {
      if (d.doctor_name) set.add(d.doctor_name)
    })
    return Array.from(set)
  }, [documents])

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Search query in title, tags, or doctor
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = doc.title.toLowerCase().includes(q)
        const matchesDoctor = (doc.doctor_name || '').toLowerCase().includes(q)
        const matchesTags = doc.tags?.some((t) => t.toLowerCase().includes(q))
        const matchesSummary = (doc.ai_summary || '').toLowerCase().includes(q)
        if (!matchesTitle && !matchesDoctor && !matchesTags && !matchesSummary) {
          return false
        }
      }

      // Document Type
      if (selectedType !== 'all') {
        if (selectedType === 'prescription' && doc.type !== 'prescription') return false
        if (selectedType === 'lab_report' && doc.type !== 'lab_report') return false
        if (selectedType === 'scan' && doc.type !== 'scan') return false
        if (selectedType === 'summary' && doc.type !== 'summary') return false
      }

      // Doctor filter
      if (selectedDoctor !== 'all' && doc.doctor_name !== selectedDoctor) {
        return false
      }

      // Date Range filter
      if (selectedDateRange !== 'all') {
        const docDate = new Date(doc.document_date).getTime()
        const now = new Date().getTime()
        const thirtyDays = 30 * 24 * 60 * 60 * 1000
        const sixMonths = 180 * 24 * 60 * 60 * 1000
        const oneYear = 365 * 24 * 60 * 60 * 1000

        if (selectedDateRange === 'last30' && now - docDate > thirtyDays) return false
        if (selectedDateRange === 'last180' && now - docDate > sixMonths) return false
        if (selectedDateRange === 'lastYear' && now - docDate > oneYear) return false
      }

      return true
    })
  }, [documents, searchQuery, selectedType, selectedDoctor, selectedDateRange])

  // Grouped by month for timeline view
  const timelineGroups = useMemo(() => {
    const groups: Record<string, DetailedDocument[]> = {}

    // Sort descending by document_date
    const sorted = [...filteredDocuments].sort(
      (a, b) => new Date(b.document_date).getTime() - new Date(a.document_date).getTime()
    )

    sorted.forEach((doc) => {
      const d = new Date(doc.document_date)
      const monthYear = d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
      if (!groups[monthYear]) {
        groups[monthYear] = []
      }
      groups[monthYear].push(doc)
    })

    return groups
  }, [filteredDocuments])

  const hasActiveFilters =
    searchQuery !== '' || selectedType !== 'all' || selectedDoctor !== 'all' || selectedDateRange !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedType('all')
    setSelectedDoctor('all')
    setSelectedDateRange('all')
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Banner / Page Header */}
      <div className="border-b border-border bg-gradient-to-b from-plum-50/50 via-background to-background dark:from-plum-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-plum-100 text-plum-950 dark:bg-plum-950 dark:text-rose-soft">
                  <Sparkles className="w-3.5 h-3.5 text-plum-700 dark:text-rose-soft" />
                  Your Secure Health Vault
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {userRole === 'caretaker' ? `${caretakerDetails.patientName}'s Medical Records` : 'Your Medical Records'}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-1 max-w-2xl">
                {userRole === 'caretaker'
                  ? `Viewing and managing clinical files and prescriptions as Caregiver (${caretakerDetails.relation}).`
                  : 'Every prescription, lab panel, and ultrasound explained in clear, compassionate language.'}
              </p>
            </div>

            {/* Upload Button */}
            <div className="flex items-center gap-3">
              <Link
                href="/records/upload"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-plum-950 hover:bg-plum-900 text-white font-medium text-sm transition-all shadow-md shadow-plum-950/15 hover:shadow-lg hover:shadow-plum-950/25 active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 text-rose-soft" />
                <span>Upload Document</span>
              </Link>
            </div>
          </div>

          {/* Search Bar + Controls */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by diagnosis, medication, doctor, or test name..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-plum-700 shadow-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View toggle (Grid / Timeline) */}
              <div className="flex items-center rounded-xl border border-border bg-card p-1 shadow-sm shrink-0 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid View"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-plum-950 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('timeline')}
                  aria-label="Timeline View"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'timeline'
                      ? 'bg-plum-950 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Timeline</span>
                </button>
              </div>
            </div>

            {/* Filter Pills Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-muted-foreground font-medium flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </span>

              {/* Document Type Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Records' },
                  { id: 'prescription', label: 'Prescriptions' },
                  { id: 'lab_report', label: 'Lab Reports' },
                  { id: 'scan', label: 'Scans & Ultrasound' },
                  { id: 'summary', label: 'Discharge Summaries' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      selectedType === type.id
                        ? 'border-plum-800 bg-plum-900 text-white dark:bg-plum-800 shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-plum-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Doctor filter dropdown */}
              <div className="ml-auto flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select
                    aria-label="Filter by doctor"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="appearance-none rounded-lg border border-border bg-card pl-3 pr-8 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-plum-700"
                  >
                    <option value="all">All Doctors</option>
                    {uniqueDoctors.map((doc) => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                  </select>
                  <User className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                </div>

                {/* Date range dropdown */}
                <div className="relative">
                  <select
                    aria-label="Filter by date range"
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="appearance-none rounded-lg border border-border bg-card pl-3 pr-8 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-plum-700"
                  >
                    <option value="all">All Time</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="last180">Last 6 Months</option>
                    <option value="lastYear">Past Year</option>
                  </select>
                  <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs text-plum-900 dark:text-rose-soft font-semibold hover:underline flex items-center gap-1 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 animate-pulse shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 bg-muted rounded-full" />
                  <div className="h-4 w-16 bg-muted rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-1/2 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-5 w-14 bg-muted rounded-md" />
                  <div className="h-5 w-16 bg-muted rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card/50 max-w-xl mx-auto my-6"
          >
            <div className="w-20 h-20 rounded-full bg-plum-100 dark:bg-plum-950/60 flex items-center justify-center text-plum-900 dark:text-rose-soft mb-4 ring-8 ring-plum-50 dark:ring-plum-950/20">
              <FolderOpen className="w-10 h-10 stroke-[1.5]" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-foreground">
              {hasActiveFilters ? 'No matching records found' : 'No records yet'}
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mt-2 leading-relaxed">
              {hasActiveFilters
                ? 'Try adjusting your search keyword or clearing the filters above to see more clinical documents.'
                : 'Upload your first prescription, blood report, or scan. We’ll organize it and explain every term in plain English.'}
            </p>

            <div className="mt-6 flex items-center gap-3">
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-semibold transition-colors"
                >
                  Clear All Filters
                </button>
              ) : (
                <Link
                  href="/records/upload"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-plum-950 text-white hover:bg-plum-900 text-sm font-semibold transition-all shadow-md shadow-plum-950/10"
                >
                  <Plus className="w-4 h-4 text-rose-soft" />
                  Upload First Document
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {/* View Mode: GRID */}
        {!loading && filteredDocuments.length > 0 && viewMode === 'grid' && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredDocuments.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* View Mode: TIMELINE */}
        {!loading && filteredDocuments.length > 0 && viewMode === 'timeline' && (
          <div className="max-w-4xl mx-auto space-y-10">
            {Object.entries(timelineGroups).map(([monthYear, docs]) => (
              <div key={monthYear} className="relative">
                {/* Month Sticky Header */}
                <div className="sticky top-4 z-10 flex items-center gap-3 mb-6 bg-background/90 backdrop-blur-sm py-2">
                  <div className="px-3.5 py-1 rounded-full bg-plum-950 text-white font-serif text-sm font-semibold shadow-sm">
                    {monthYear}
                  </div>
                  <div className="h-px bg-border flex-1" />
                  <span className="text-xs text-muted-foreground font-medium">
                    {docs.length} {docs.length === 1 ? 'record' : 'records'}
                  </span>
                </div>

                {/* Timeline connector line */}
                <div className="relative pl-6 sm:pl-8 border-l-2 border-plum-200 dark:border-plum-900 ml-4 space-y-6">
                  {docs.map((doc) => {
                    const badgeConfig =
                      DOCUMENT_TYPE_CONFIG[doc.type] || DOCUMENT_TYPE_CONFIG.other
                    const BadgeIcon = badgeConfig.icon

                    return (
                      <div key={doc.id} className="relative group">
                        {/* Timeline dot */}
                        <div className="absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full border-2 border-plum-950 bg-background group-hover:bg-plum-950 transition-colors" />

                        {/* Card inside timeline */}
                        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md hover:border-plum-300 dark:hover:border-plum-700 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeConfig.bg} ${badgeConfig.border} ${badgeConfig.text}`}
                              >
                                <BadgeIcon className="w-3.5 h-3.5" />
                                {badgeConfig.label}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(doc.document_date)}
                              </span>
                            </div>

                            {doc.doctor_name && (
                              <span className="text-xs font-medium text-foreground flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-plum-700 dark:text-rose-soft" />
                                {doc.doctor_name}
                              </span>
                            )}
                          </div>

                          <Link href={`/records/${doc.id}`} className="block group/link">
                            <h4 className="font-serif text-lg font-semibold text-foreground group-hover/link:text-plum-900 dark:group-hover/link:text-plum-300 transition-colors">
                              {doc.title}
                            </h4>
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {doc.ai_summary || doc.extracted_text.slice(0, 160)}
                            </p>
                          </Link>

                          {/* Footer with tags + link */}
                          <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                            <div className="flex flex-wrap gap-1.5">
                              {doc.tags?.slice(0, 3).map((t, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded bg-muted text-[11px] text-muted-foreground"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            <Link
                              href={`/records/${doc.id}`}
                              className="font-semibold text-plum-900 dark:text-rose-soft inline-flex items-center gap-1 hover:underline"
                            >
                              <span>View details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
