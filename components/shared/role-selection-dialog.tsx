"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Users,
  Sparkles,
  X,
} from "lucide-react"
import { useDemoMode } from "@/components/providers/demo-mode-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function RoleSelectionDialog() {
  const {
    isRoleModalOpen,
    setIsRoleModalOpen,
    userRole,
    setUserRole,
    caretakerDetails,
  } = useDemoMode()

  const [selectedRole, setSelectedRole] = useState<'self' | 'caretaker'>(userRole)
  const [caretakerName, setCaretakerName] = useState(caretakerDetails.caretakerName)
  const [relation, setRelation] = useState(caretakerDetails.relation)
  const [patientName, setPatientName] = useState(caretakerDetails.patientName)

  if (!isRoleModalOpen) return null

  const handleConfirm = () => {
    setUserRole(selectedRole, {
      caretakerName: caretakerName.trim() || 'Aarav Sharma',
      relation: relation || 'Son & Primary Caregiver',
      patientName: patientName.trim() || 'Priya Sharma',
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl text-card-foreground"
        >
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-plum-500/10 blur-3xl pointer-events-none" />

          {/* Close button if user already had a role */}
          <button
            onClick={() => setIsRoleModalOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Personalized Health Companion</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Who are you managing care for today?
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Choose your perspective. You can seamlessly switch between managing your own health and assisting a family member anytime.
            </p>
          </div>

          {/* Role Choice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Self Card */}
            <div
              onClick={() => setSelectedRole('self')}
              className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all ${
                selectedRole === 'self'
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                  : 'border-border/80 bg-background/50 hover:border-border hover:bg-muted/30'
              }`}
            >
              {selectedRole === 'self' && (
                <div className="absolute top-3 right-3 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 mb-3">
                <User className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-base text-foreground">
                Managing for Myself
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Track my own daily prescriptions, blood tests, scans, and get timely self-care alerts.
              </p>
              <Badge variant="outline" className="mt-3 text-[11px] font-normal border-rose-200 dark:border-rose-900">
                Patient Mode
              </Badge>
            </div>

            {/* Caretaker Card */}
            <div
              onClick={() => setSelectedRole('caretaker')}
              className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all ${
                selectedRole === 'caretaker'
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                  : 'border-border/80 bg-background/50 hover:border-border hover:bg-muted/30'
              }`}
            >
              {selectedRole === 'caretaker' && (
                <div className="absolute top-3 right-3 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 mb-3">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-base text-foreground">
                As a Caretaker / Family
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Manage reports, schedule reminders, and send supportive care notes to my mother or loved one.
              </p>
              <Badge variant="outline" className="mt-3 text-[11px] font-normal border-purple-200 dark:border-purple-900">
                Caregiver Mode
              </Badge>
            </div>
          </div>

          {/* Caretaker Specific Details Form (if caretaker chosen) */}
          <AnimatePresence>
            {selectedRole === 'caretaker' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-3 mb-6 p-4 rounded-xl bg-muted/40 border border-border/60"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>Caregiver Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <Label htmlFor="caretaker-name" className="text-xs">Your Name</Label>
                    <Input
                      id="caretaker-name"
                      value={caretakerName}
                      onChange={(e) => setCaretakerName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="caretaker-relation" className="text-xs">Relationship to Patient</Label>
                    <Select value={relation} onValueChange={setRelation}>
                      <SelectTrigger id="caretaker-relation" className="h-9 text-xs">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Son / Daughter', 'Spouse / Partner', 'Parent', 'Sibling', 'Friend', 'Care Assistant'].map((r) => (
                          <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <Label htmlFor="patient-name" className="text-xs">Patient / Loved One’s Name</Label>
                  <Input
                    id="patient-name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="h-9 text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    You will be able to review {patientName || 'the patient'}’s reports, write care messages, and set alerts.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirm Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Full privacy controls & consent enabled</span>
            </div>

            <Button
              onClick={handleConfirm}
              className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
