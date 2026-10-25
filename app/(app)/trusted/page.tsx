'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Plus, Eye, Edit3, Trash2, Copy, CheckCircle2,
  Clock, Activity, Shield, ChevronRight, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { mockTrustedPerson } from '@/lib/db/mock-data'
import { formatDate } from '@/lib/utils'

// ─── Mock activity log ────────────────────────────────────────────────────────

const ACTIVITY_LOG = [
  { id: '1', person: 'Sunita Sharma', action: 'viewed your appointment list', date: '2026-10-25T15:42:00', icon: Eye },
  { id: '2', person: 'Sunita Sharma', action: 'viewed your medicine reminders', date: '2026-10-24T11:18:00', icon: Eye },
  { id: '3', person: 'Sunita Sharma', action: 'was granted access to Appointments', date: '2026-10-20T09:00:00', icon: CheckCircle2 },
]

// ─── Invite Form ──────────────────────────────────────────────────────────────

function InviteForm({ onInvite }: { onInvite: (link: string) => void }) {
  const [name, setName] = useState('')
  const [relation, setRelation] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !relation) return
    setLoading(true)
    try {
      const res = await fetch('/api/trusted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trusted_name: name, relation, email }),
      })
      const data = await res.json()
      onInvite(data.trustedPerson?.invite_link || `http://localhost:3000/trusted/accept?token=demo`)
      toast.success(`Invite sent to ${name}!`)
    } catch {
      toast.error('Could not send invite. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="tp-name">Name</Label>
        <Input id="tp-name" placeholder="e.g., Sunita Sharma" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tp-relation">Relation</Label>
        <Select value={relation} onValueChange={setRelation} required>
          <SelectTrigger id="tp-relation">
            <SelectValue placeholder="Select relation" />
          </SelectTrigger>
          <SelectContent>
            {['Mother', 'Father', 'Spouse / Partner', 'Sister', 'Brother', 'Daughter', 'Son', 'Friend', 'Caregiver', 'Other'].map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tp-email">Email (optional)</Label>
        <Input id="tp-email" type="email" placeholder="their@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={loading || !name || !relation}>
        {loading ? 'Generating invite…' : 'Generate invite link →'}
      </Button>
    </form>
  )
}

// ─── Permission Editor ─────────────────────────────────────────────────────────

function PermissionEditorDialog({ personName }: { personName: string }) {
  const [perms, setPerms] = useState({
    documents: 'view',
    medicines: 'view',
    appointments: 'view',
    reminders: 'none',
  })

  const toggle = (key: string, val: string) =>
    setPerms((prev) => ({ ...prev, [key]: val }))

  const resources = [
    { key: 'documents', label: 'Medical Documents', desc: 'Lab reports, prescriptions, scans' },
    { key: 'medicines', label: 'Medicines & Reminders', desc: 'Medicine list and reminder schedule' },
    { key: 'appointments', label: 'Appointments', desc: 'Upcoming and past appointments' },
    { key: 'reminders', label: 'Reminder Logs', desc: 'Medicine adherence records' },
  ]

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Edit permissions for {personName}</DialogTitle>
        <DialogDescription>Control exactly what they can see.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        {resources.map((r) => (
          <div key={r.key} className="space-y-1.5">
            <div>
              <p className="text-sm font-medium">{r.label}</p>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>
            <div className="flex gap-2">
              {(['none', 'view', 'edit'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggle(r.key, opt)}
                  className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                    perms[r.key as keyof typeof perms] === opt
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button onClick={() => toast.success('Permissions updated')}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function TrustedPage() {
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)

  const copyLink = () => {
    if (!inviteLink) return
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="font-serif text-3xl font-semibold">Trusted Access</h1>
            </div>
            <p className="text-muted-foreground">Control who sees what — your data, your rules.</p>
          </div>
          <Button onClick={() => setShowInvite((v) => !v)} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            Invite someone
          </Button>
        </div>
      </motion.div>

      {/* Invite form */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Invite a trusted person</CardTitle>
                <CardDescription>
                  They&apos;ll only see what you specifically allow — nothing more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InviteForm onInvite={(link) => { setInviteLink(link); setShowInvite(false) }} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite link result */}
      {inviteLink && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-2">Invite link generated!</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-black/5 dark:bg-white/10 px-2 py-1 text-xs truncate">
                  {inviteLink}
                </code>
                <Button size="sm" variant="outline" onClick={copyLink} className="gap-1.5 shrink-0">
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Existing trusted people */}
      <div>
        <h2 className="font-semibold mb-4">People with access</h2>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-primary/20">
            <CardContent className="pt-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{mockTrustedPerson.trusted_name}</p>
                    <Badge variant="secondary">{mockTrustedPerson.relation}</Badge>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Can view: Appointments, Medicines
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last active: 25 Oct 2026 at 3:42 PM
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-1.5">
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <PermissionEditorDialog personName={mockTrustedPerson.trusted_name} />
                  </Dialog>

                  <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="gap-1.5">
                        <Trash2 className="h-3.5 w-3.5" />
                        Revoke
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          Revoke access for {mockTrustedPerson.trusted_name}?
                        </DialogTitle>
                        <DialogDescription>
                          They will immediately lose access to all your shared records. This action takes effect instantly. You can re-invite them later.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>Cancel</Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            toast.success(`Access revoked for ${mockTrustedPerson.trusted_name}`)
                            setRevokeDialogOpen(false)
                          }}
                        >
                          Revoke Access
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Permission summary */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Appointments', access: 'view' },
                  { label: 'Medicines', access: 'view' },
                  { label: 'Documents', access: 'none' },
                  { label: 'Reminders', access: 'none' },
                ].map((p) => (
                  <div key={p.label} className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                    {p.access === 'view' ? (
                      <Eye className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Shield className="h-3.5 w-3.5 text-muted-foreground/40" />
                    )}
                    <span className="text-xs">{p.label}</span>
                    <span className={`ml-auto text-xs font-medium ${p.access === 'none' ? 'text-muted-foreground/50' : 'text-success'}`}>
                      {p.access === 'none' ? 'Hidden' : 'Can view'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Log */}
      <div>
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Activity Log
        </h2>
        <Card>
          <CardContent className="pt-4 divide-y">
            {ACTIVITY_LOG.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                  <entry.icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{entry.person}</span>{' '}
                    <span className="text-muted-foreground">{entry.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(entry.date, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Privacy note */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Trusted people can only see what you explicitly allow. You can change or revoke access at any time, instantly.
          All access events are logged above.
        </AlertDescription>
      </Alert>
    </div>
  )
}
