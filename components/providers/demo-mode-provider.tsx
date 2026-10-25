"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

export interface DemoPatientProfile {
  name: string
  preferredName: string
  age: number
  gender: string
  bloodGroup: string
  city: string
  state: string
  country: string
  language: string
  primaryCondition: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
}

export const DEMO_PROFILE: DemoPatientProfile = {
  name: "Priya Sharma",
  preferredName: "Priya",
  age: 48,
  gender: "Female",
  bloodGroup: "B+",
  city: "Bengaluru",
  state: "Karnataka",
  country: "India",
  language: "en",
  primaryCondition: "Hypothyroidism & Bone Density Management",
  emergencyContact: {
    name: "Aarav Sharma",
    relationship: "Son",
    phone: "+91 98450 12345",
  },
}

export interface CaretakerDetails {
  caretakerName: string
  relation: string
  patientName: string
  patientPhone: string
}

export interface CaretakerMessage {
  id: string
  from: string
  to: string
  text: string
  time: string
  type: 'care_checkin' | 'med_reminder' | 'note'
}

export interface StoredDocument {
  id: string
  title: string
  type: string
  file_name: string
  file_size?: number
  file_url?: string
  document_date: string
  doctor_name?: string
  ai_summary?: string
  tags?: string[]
  isValidMedicalReport?: boolean
  validationReason?: string
  medicines?: any[]
  extractedDates?: any[]
  uploadedBy?: 'self' | 'caretaker'
}

export interface StoredAlert {
  id: string
  title: string
  date: string
  time?: string
  type: 'follow_up' | 'medication_refill' | 'lab_test' | 'daily_dose'
  description: string
  completed?: boolean
  sourceDocument?: string
}

interface DemoModeContextType {
  isDemoMode: boolean
  isBannerDismissed: boolean
  patient: DemoPatientProfile
  dismissBanner: () => void
  toggleDemoMode: () => void
  language: "en" | "hi" | "kn"
  setLanguage: (lang: "en" | "hi" | "kn") => void
  resetDemoData: () => void

  // Role Management (Self vs Caretaker)
  userRole: 'self' | 'caretaker'
  hasRoleSelected: boolean
  isRoleModalOpen: boolean
  setIsRoleModalOpen: (open: boolean) => void
  caretakerDetails: CaretakerDetails
  setUserRole: (role: 'self' | 'caretaker', details?: Partial<CaretakerDetails>) => void

  // Centralized Health Records & Files
  storedDocuments: StoredDocument[]
  addStoredDocument: (doc: StoredDocument) => void

  // Caretaker Messages & Alerts
  caretakerMessages: CaretakerMessage[]
  sendMessageToPatient: (text: string, type?: CaretakerMessage['type']) => void

  // Automated Alerts extracted from AI
  storedAlerts: StoredAlert[]
  addStoredAlerts: (alerts: StoredAlert[]) => void
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined)

const DEFAULT_CARETAKER: CaretakerDetails = {
  caretakerName: "Aarav Sharma",
  relation: "Son & Primary Caregiver",
  patientName: "Priya Sharma",
  patientPhone: "+91 98450 12345",
}

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true)
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false)
  const [language, setLanguage] = useState<"en" | "hi" | "kn">("en")

  // Role state
  const [userRole, setUserRoleState] = useState<'self' | 'caretaker'>('self')
  const [hasRoleSelected, setHasRoleSelected] = useState<boolean>(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false)
  const [caretakerDetails, setCaretakerDetails] = useState<CaretakerDetails>(DEFAULT_CARETAKER)

  // Stored uploaded files/documents
  const [storedDocuments, setStoredDocuments] = useState<StoredDocument[]>([])

  // Caretaker messages
  const [caretakerMessages, setCaretakerMessages] = useState<CaretakerMessage[]>([
    {
      id: 'msg-1',
      from: 'Aarav (Son)',
      to: 'Priya',
      text: 'Good morning Mom! Please remember to take Thyronorm before your morning tea.',
      time: '07:15 AM Today',
      type: 'med_reminder',
    },
    {
      id: 'msg-2',
      from: 'Aarav (Son)',
      to: 'Priya',
      text: 'I uploaded your new blood test report to HER TURN. The doctor says TSH is normal!',
      time: 'Yesterday',
      type: 'care_checkin',
    },
  ])

  // Stored alerts & scheduled dates
  const [storedAlerts, setStoredAlerts] = useState<StoredAlert[]>([
    {
      id: 'alert-1',
      title: 'Dr. Sunita Sharma Consultation',
      date: 'Tomorrow, 11:30 AM',
      time: '11:30 AM',
      type: 'follow_up',
      description: 'Review thyroid hormone panel & ultrasound results at Manipal Hospital.',
    },
    {
      id: 'alert-2',
      title: 'Thyronorm 50 mcg Morning Dose',
      date: 'Daily, 07:00 AM',
      time: '07:00 AM',
      type: 'daily_dose',
      description: 'Take on empty stomach with plain water. 45 min before tea.',
    },
  ])

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem("herturn_demo_banner_dismissed")
      if (dismissed === "true") {
        setIsBannerDismissed(true)
      }
      const savedLang = localStorage.getItem("herturn_language") as "en" | "hi" | "kn" | null
      if (savedLang) {
        setLanguage(savedLang)
      }

      // Restore Role
      const savedRole = localStorage.getItem("herturn_user_role") as 'self' | 'caretaker' | null
      if (savedRole) {
        setUserRoleState(savedRole)
        setHasRoleSelected(true)
      } else {
        // Show role selection modal on first visit to dashboard
        setIsRoleModalOpen(true)
      }

      // Restore stored documents
      const savedDocs = localStorage.getItem("herturn_custom_docs")
      if (savedDocs) {
        setStoredDocuments(JSON.parse(savedDocs))
      }

      // Restore alerts
      const savedAlerts = localStorage.getItem("herturn_custom_alerts")
      if (savedAlerts) {
        setStoredAlerts(JSON.parse(savedAlerts))
      }

      // Restore messages
      const savedMsgs = localStorage.getItem("herturn_caretaker_msgs")
      if (savedMsgs) {
        setCaretakerMessages(JSON.parse(savedMsgs))
      }
    } catch {
      // Storage unavailable in strict sandbox
    }
  }, [])

  const dismissBanner = () => {
    setIsBannerDismissed(true)
    try {
      sessionStorage.setItem("herturn_demo_banner_dismissed", "true")
    } catch {}
  }

  const handleSetLanguage = (lang: "en" | "hi" | "kn") => {
    setLanguage(lang)
    try {
      localStorage.setItem("herturn_language", lang)
    } catch {}
  }

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev)
  }

  const setUserRole = (role: 'self' | 'caretaker', details?: Partial<CaretakerDetails>) => {
    setUserRoleState(role)
    setHasRoleSelected(true)
    setIsRoleModalOpen(false)
    if (details) {
      setCaretakerDetails((prev) => ({ ...prev, ...details }))
    }
    try {
      localStorage.setItem("herturn_user_role", role)
    } catch {}

    if (role === 'caretaker') {
      toast.success("Switched to Caretaker Mode", {
        description: `Now managing health, reports & messages for ${details?.patientName || DEFAULT_CARETAKER.patientName}.`,
      })
    } else {
      toast.success("Switched to Self Mode", {
        description: "Now managing your personal health profile and routine.",
      })
    }
  }

  const addStoredDocument = (doc: StoredDocument) => {
    setStoredDocuments((prev) => {
      const updated = [doc, ...prev]
      try {
        localStorage.setItem("herturn_custom_docs", JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const sendMessageToPatient = (text: string, type: CaretakerMessage['type'] = 'care_checkin') => {
    const newMsg: CaretakerMessage = {
      id: `msg-${Date.now()}`,
      from: `${caretakerDetails.caretakerName} (${caretakerDetails.relation.split(' ')[0]})`,
      to: caretakerDetails.patientName,
      text,
      time: 'Just now',
      type,
    }
    setCaretakerMessages((prev) => {
      const updated = [newMsg, ...prev]
      try {
        localStorage.setItem("herturn_caretaker_msgs", JSON.stringify(updated))
      } catch {}
      return updated
    })
    toast.success(`Message sent to ${caretakerDetails.patientName}!`, {
      description: text.length > 50 ? `${text.slice(0, 50)}...` : text,
    })
  }

  const addStoredAlerts = (newAlerts: StoredAlert[]) => {
    setStoredAlerts((prev) => {
      const updated = [...newAlerts, ...prev]
      try {
        localStorage.setItem("herturn_custom_alerts", JSON.stringify(updated))
      } catch {}
      return updated
    })
    toast.success(`Scheduled ${newAlerts.length} new alert${newAlerts.length > 1 ? 's' : ''}!`, {
      description: "You will receive timely reminders on your device.",
    })
  }

  const resetDemoData = () => {
    setIsBannerDismissed(false)
    setStoredDocuments([])
    setUserRoleState('self')
    setHasRoleSelected(false)
    setIsRoleModalOpen(true)
    try {
      sessionStorage.removeItem("herturn_demo_banner_dismissed")
      localStorage.removeItem("herturn_medicines_taken")
      localStorage.removeItem("herturn_user_role")
      localStorage.removeItem("herturn_custom_docs")
      localStorage.removeItem("herturn_custom_alerts")
      localStorage.removeItem("herturn_caretaker_msgs")
    } catch {}
    toast.info("Demo data reset to initial state")
  }

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        isBannerDismissed,
        patient: DEMO_PROFILE,
        dismissBanner,
        toggleDemoMode,
        language,
        setLanguage: handleSetLanguage,
        resetDemoData,

        // Roles
        userRole,
        hasRoleSelected,
        isRoleModalOpen,
        setIsRoleModalOpen,
        caretakerDetails,
        setUserRole,

        // Documents
        storedDocuments,
        addStoredDocument,

        // Messages & Alerts
        caretakerMessages,
        sendMessageToPatient,
        storedAlerts,
        addStoredAlerts,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  )
}

export function useDemoMode() {
  const context = useContext(DemoModeContext)
  if (!context) {
    throw new Error("useDemoMode must be used within a DemoModeProvider")
  }
  return context
}
