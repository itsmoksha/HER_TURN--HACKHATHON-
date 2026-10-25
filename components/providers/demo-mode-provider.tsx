"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

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

interface DemoModeContextType {
  isDemoMode: boolean
  isBannerDismissed: boolean
  patient: DemoPatientProfile
  dismissBanner: () => void
  toggleDemoMode: () => void
  language: "en" | "hi" | "kn"
  setLanguage: (lang: "en" | "hi" | "kn") => void
  resetDemoData: () => void
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined)

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true)
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false)
  const [language, setLanguage] = useState<"en" | "hi" | "kn">("en")

  useEffect(() => {
    // Restore dismissed state from sessionStorage if available
    try {
      const dismissed = sessionStorage.getItem("herturn_demo_banner_dismissed")
      if (dismissed === "true") {
        setIsBannerDismissed(true)
      }
      const savedLang = localStorage.getItem("herturn_language") as "en" | "hi" | "kn" | null
      if (savedLang) {
        setLanguage(savedLang)
      }
    } catch {
      // Ignore storage errors in restricted iframe/incognito
    }
  }, [])

  const dismissBanner = () => {
    setIsBannerDismissed(true)
    try {
      sessionStorage.setItem("herturn_demo_banner_dismissed", "true")
    } catch {
      // Ignore
    }
  }

  const handleSetLanguage = (lang: "en" | "hi" | "kn") => {
    setLanguage(lang)
    try {
      localStorage.setItem("herturn_language", lang)
    } catch {
      // Ignore
    }
  }

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev)
  }

  const resetDemoData = () => {
    setIsBannerDismissed(false)
    try {
      sessionStorage.removeItem("herturn_demo_banner_dismissed")
      localStorage.removeItem("herturn_medicines_taken")
    } catch {
      // Ignore
    }
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
