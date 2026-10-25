'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Download, Trash2, Eye, EyeOff, Bell, BellOff, Lock, Users, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function PrivacyPage() {
  const [privateMode, setPrivateMode] = useState(false)
  const [notifications, setNotifications] = useState({
    medicines: true,
    appointments: true,
    healthTips: false,
    trustedActivity: true,
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const handleExport = async () => {
    try {
      const res = await fetch('/api/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'her-turn-data-export.json'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Your data has been exported successfully.')
    } catch {
      toast.error('Export failed. Please try again.')
    }
  }

  const fadeIn = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div {...fadeIn}>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-7 w-7 text-primary" />
          <h1 className="font-serif text-3xl font-semibold">Privacy &amp; Control</h1>
        </div>
        <p className="text-muted-foreground">
          You are in full control of your health data. Always.
        </p>
      </motion.div>

      {/* Privacy statement */}
      <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Shield className="h-5 w-5" />
              Our Privacy Promise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              'Your data is encrypted in transit and at rest',
              'Your data is never sold to third parties',
              'Your data is never used to train AI models',
              'You have the right to access, correct, and erase your data (DPDP Act)',
              'Row-level security ensures only you — and who you choose — can access your records',
              'Trusted person access can be revoked by you at any time, instantly',
            ].map((point) => (
              <div key={point} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <p className="text-sm">{point}</p>
              </div>
            ))}
            <Separator className="my-3" />
            <button className="text-sm text-primary underline hover:no-underline">
              Read full Privacy Policy →
            </button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Consent Management */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Consent Management
            </CardTitle>
            <CardDescription>What you&apos;ve agreed to and when</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { type: 'Data Storage & Processing', date: 'Agreed on 25 Oct 2026', version: 'v1.2' },
              { type: 'AI Analysis of Health Records', date: 'Agreed on 25 Oct 2026', version: 'v1.0' },
              { type: 'Push Notifications', date: 'Agreed on 25 Oct 2026', version: 'v1.0' },
            ].map((consent) => (
              <div key={consent.type} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{consent.type}</p>
                  <p className="text-xs text-muted-foreground">{consent.date} · {consent.version}</p>
                </div>
                <Badge variant="success" className="text-xs">Active</Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-2">
              Review &amp; Update Consents
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'medicines', label: 'Medicine Reminders', desc: 'Daily reminders for your confirmed medicines' },
              { key: 'appointments', label: 'Appointment Reminders', desc: '24h and 1h before appointments' },
              { key: 'healthTips', label: 'Monthly Health Tips', desc: 'General women\'s health guidance' },
              { key: 'trustedActivity', label: 'Trusted Person Activity', desc: 'When someone views your shared records' },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor={pref.key} className="font-medium cursor-pointer">{pref.label}</Label>
                  <p className="text-xs text-muted-foreground">{pref.desc}</p>
                </div>
                <Switch
                  id={pref.key}
                  checked={notifications[pref.key as keyof typeof notifications]}
                  onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [pref.key]: v }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Private Mode */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {privateMode ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
              Private Mode
            </CardTitle>
            <CardDescription>
              Hide sensitive records and medicines from the main view. PIN-protected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Switch
                checked={privateMode}
                onCheckedChange={(v) => {
                  setPrivateMode(v)
                  toast.success(v ? 'Private mode enabled. Sensitive items are hidden.' : 'Private mode disabled.')
                }}
              />
              <span className="text-sm">
                {privateMode ? 'Private mode is ON — sensitive items are hidden' : 'Private mode is OFF — all items visible'}
              </span>
            </div>
            {privateMode && (
              <Alert variant="info" className="mt-3">
                <AlertDescription>
                  Sensitive records marked as private are hidden from the main dashboard and library. They remain in your account.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Biometric Login</p>
                <p className="text-xs text-muted-foreground">Use fingerprint or face ID</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Active Sessions</p>
              <div className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Chrome on Windows</p>
                    <p className="text-xs text-muted-foreground">Bangalore, India · Current session</p>
                  </div>
                  <Badge variant="success">Current</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Your Data */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-muted-foreground" />
              Your Data
            </CardTitle>
            <CardDescription>Export or delete all your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export all my data (JSON)
            </Button>
            <p className="text-xs text-muted-foreground">
              Download a copy of all your profile, documents metadata, medicines, appointments, and chat history.
            </p>

            <Separator />

            {/* Delete account */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete my account and all data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    Delete Account
                  </DialogTitle>
                  <DialogDescription>
                    This action is <strong>permanent and irreversible</strong>. All your records, medicines, appointments, and chat history will be deleted immediately. This cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <p className="text-sm">Type <strong>DELETE</strong> to confirm:</p>
                  <input
                    className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-destructive"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE here"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                  <Button
                    variant="destructive"
                    disabled={deleteConfirmText !== 'DELETE'}
                    onClick={() => {
                      toast.error('Account deletion is disabled in demo mode.')
                      setIsDeleteDialogOpen(false)
                    }}
                  >
                    Delete Forever
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
