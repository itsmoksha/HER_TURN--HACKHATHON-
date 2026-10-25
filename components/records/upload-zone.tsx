'use client'

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UploadCloud,
  Camera,
  FileCheck2,
  AlertCircle,
  FileText,
  X,
  Sparkles,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onClearFile?: () => void
  isUploading?: boolean
  uploadProgress?: number
  errorMessage?: string | null
  maxSizeMB?: number
}

export function UploadZone({
  onFileSelect,
  selectedFile,
  onClearFile,
  isUploading = false,
  uploadProgress = 0,
  errorMessage = null,
  maxSizeMB = 10,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']

  const validateAndHandle = (file: File) => {
    setLocalError(null)

    // Check type
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|jpe?g|png)$/i)) {
      setLocalError('Invalid file type. Please upload a PDF, JPG, or PNG document.')
      return
    }

    // Check size (default 10MB)
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setLocalError(`File is too large. Maximum allowed size is ${maxSizeMB}MB.`)
      return
    }

    onFileSelect(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandle(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndHandle(e.target.files[0])
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const activeError = errorMessage || localError

  return (
    <div className="w-full space-y-3">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleInputChange}
        disabled={isUploading}
      />

      {/* Hidden camera input for mobile photo capture */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleInputChange}
        disabled={isUploading}
      />

      {/* Interactive Drag & Drop Box */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!isUploading && !selectedFile) {
            fileInputRef.current?.click()
          }
        }}
        whileHover={!isUploading && !selectedFile ? { scale: 1.005 } : {}}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all duration-200 text-center ${
          isDragOver
            ? 'border-plum-600 bg-plum-50/80 dark:bg-plum-950/40 ring-4 ring-plum-500/10'
            : selectedFile
            ? 'border-plum-300 bg-plum-50/30 dark:bg-plum-950/20'
            : 'border-border/90 bg-card hover:border-plum-400 dark:hover:border-plum-600 hover:bg-plum-50/20 dark:hover:bg-plum-950/10'
        } ${activeError ? 'border-red-400 dark:border-red-600' : ''}`}
      >
        <AnimatePresence mode="wait">
          {selectedFile ? (
            /* Selected File State */
            <motion.div
              key="file-selected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-3 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-plum-100 dark:bg-plum-900/60 text-plum-900 dark:text-plum-200 flex items-center justify-center shadow-inner">
                {selectedFile.type.includes('image') ? (
                  <FileText className="w-7 h-7 text-plum-800 dark:text-rose-soft" />
                ) : (
                  <FileCheck2 className="w-7 h-7 text-plum-800 dark:text-rose-soft" />
                )}
              </div>

              <div className="text-center max-w-md">
                <p className="font-semibold text-foreground text-base truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Document'}
                </p>
              </div>

              {/* Upload Progress Bar if active */}
              {isUploading && (
                <div className="w-full max-w-xs mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-plum-900 dark:text-plum-300 font-medium">
                    <span>Processing document...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-plum-100 dark:bg-plum-950 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-plum-700 to-rose-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ ease: 'easeOut', duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Action buttons when file is staged */}
              {!isUploading && (
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Change File
                  </button>
                  {onClearFile && (
                    <button
                      type="button"
                      onClick={onClearFile}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            /* Idle / Dragging State */
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-3"
            >
              <div className="w-16 h-16 rounded-full bg-plum-100/80 dark:bg-plum-900/40 text-plum-900 dark:text-rose-soft flex items-center justify-center ring-8 ring-plum-50 dark:ring-plum-950/40">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <p className="font-serif text-lg font-semibold text-foreground">
                  Drop medical files here or <span className="text-plum-900 dark:text-rose-soft underline underline-offset-2">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Prescriptions, laboratory tests, scan results, or hospital summaries.
                </p>
              </div>

              {/* Formats & Limit info */}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full">
                <span>PDF, JPG, or PNG</span>
                <span>•</span>
                <span>Max {maxSizeMB}MB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Camera Capture Button (Great for mobile users photographing prescriptions) */}
      {!selectedFile && !isUploading && (
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-plum-200 dark:border-plum-800 bg-plum-50/60 dark:bg-plum-950/40 text-plum-900 dark:text-rose-soft text-xs font-semibold hover:bg-plum-100 dark:hover:bg-plum-900/60 transition-colors"
          >
            <Camera className="w-4 h-4 text-plum-700 dark:text-rose-soft" />
            <span>Take Photo with Camera</span>
          </button>
        </div>
      )}

      {/* Error state alert */}
      {activeError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-200 text-xs"
        >
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-semibold">Upload failed: </span>
            {activeError}
          </div>
        </motion.div>
      )}
    </div>
  )
}
