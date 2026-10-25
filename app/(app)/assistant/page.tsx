'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Mic,
  MicOff,
  MessageSquare,
  Sparkles,
  BellRing,
  Calendar,
  CheckCircle2,
  HeartHandshake,
  User,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useDemoMode, StoredAlert } from '@/components/providers/demo-mode-provider'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

interface SuggestedAlert {
  date: string
  time?: string
  type: 'follow_up' | 'medication_refill' | 'lab_test' | 'daily_dose'
  title: string
  description: string
  actionLabel?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Array<{ documentTitle: string; date: string }>
  triageLevel?: 'safe' | 'caution' | 'urgent'
  disclaimer?: string
  suggestedFollowUps?: string[]
  suggestedAlerts?: SuggestedAlert[]
  isOllama?: boolean
  safetyFlagged?: boolean
  timestamp: Date
}

// ─── Triage Card ─────────────────────────────────────────────────────────────

function TriageCard({
  level,
  onDismiss,
}: {
  level: 'caution' | 'urgent'
  onDismiss: () => void
}) {
  if (level === 'urgent') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-4 rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/30 p-4 shadow-lg"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 animate-pulse">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 dark:text-red-300 text-base">
              ⚠️ This may need immediate medical attention
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
              Please call emergency services or go to your nearest emergency room <strong>now</strong>. Do not wait.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="tel:102"
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                📞 Call 102 (Ambulance)
              </a>
              <a
                href="tel:112"
                className="inline-flex items-center rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                📞 Call 112 (Emergency)
              </a>
            </div>
            <button
              onClick={onDismiss}
              className="mt-2 text-xs text-red-600 dark:text-red-400 underline hover:no-underline"
            >
              I have already sought help / this was a test
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 rounded-xl border border-amber-400 bg-amber-50 dark:bg-amber-950/20 p-4"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">🔔</span>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-800 dark:text-amber-300">
            Worth discussing with your doctor soon
          </h3>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
            This sounds like something to bring up at your next appointment. Consider booking within the next few days.
          </p>
          <button
            onClick={onDismiss}
            className="mt-2 text-xs text-amber-600 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Chat Message ─────────────────────────────────────────────────────────────

function ChatMessage({
  message,
  userName,
  onScheduleAlerts,
}: {
  message: Message
  userName: string
  onScheduleAlerts: (alerts: SuggestedAlert[]) => void
}) {
  const isUser = message.role === 'user'
  const [scheduled, setScheduled] = useState(false)

  const handleScheduleClick = (alerts: SuggestedAlert[]) => {
    onScheduleAlerts(alerts)
    setScheduled(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3 px-4 py-2', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
      )}

      <div className={cn('max-w-[85%] sm:max-w-[75%] space-y-2', isUser ? 'items-end' : 'items-start')}>
        {/* Ollama badge if generated by local Ollama */}
        {!isUser && message.isOllama && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ollama AI (qwen2.5 / llama3)</span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-card border border-border shadow-card rounded-bl-sm text-foreground'
          )}
        >
          {message.content}
        </div>

        {/* Suggested Date Alerts Box */}
        {message.suggestedAlerts && message.suggestedAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-2.5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <BellRing className="h-3.5 w-3.5" />
                <span>AI Detected Clinical Dates & Deadlines</span>
              </div>
              {scheduled && (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Scheduled
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              {message.suggestedAlerts.map((alt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs bg-card p-2 rounded-lg border border-border/70"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">{alt.title}</p>
                    <p className="text-[11px] text-muted-foreground">{alt.description}</p>
                  </div>
                  <span className="font-semibold text-primary shrink-0 ml-2">{alt.date}</span>
                </div>
              ))}
            </div>

            {!scheduled ? (
              <Button
                size="sm"
                onClick={() => handleScheduleClick(message.suggestedAlerts!)}
                className="w-full text-xs gap-1.5 bg-primary text-primary-foreground font-semibold"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Schedule All Alerts & Reminders</span>
              </Button>
            ) : (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium text-center">
                ✓ Notifications created and synced to your Reminders & Visits dashboard!
              </p>
            )}
          </motion.div>
        )}

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.citations.map((cite, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-primary/8 border border-primary/15 px-2 py-0.5 text-xs text-primary/80"
              >
                📄 {cite.documentTitle}, {cite.date}
              </span>
            ))}
          </div>
        )}

        {/* Triage level */}
        {message.triageLevel && message.triageLevel !== 'safe' && (
          <Badge
            variant={message.triageLevel === 'urgent' ? 'destructive' : ('warning' as any)}
            className="text-xs"
          >
            {message.triageLevel === 'urgent' ? '⚠️ Seek care now' : '🔔 See doctor soon'}
          </Badge>
        )}

        {/* Disclaimer */}
        {message.disclaimer && (
          <p className="text-xs text-muted-foreground leading-snug max-w-sm">
            ℹ️ {message.disclaimer}
          </p>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-xs">
          {userName.charAt(0)}
        </div>
      )}
    </motion.div>
  )
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-3 shadow-card">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-primary/60"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main Assistant Page ──────────────────────────────────────────────────────

export default function AssistantPage() {
  const {
    patient,
    userRole,
    caretakerDetails,
    storedDocuments,
    addStoredAlerts,
  } = useDemoMode()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [activeTriageCard, setActiveTriageCard] = useState<'caution' | 'urgent' | null>(null)
  const [ollamaReady, setOllamaReady] = useState<boolean>(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Check Ollama status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/ai/ollama')
        const data = await res.json()
        setOllamaReady(data.available)
      } catch {
        setOllamaReady(false)
      }
    }
    checkStatus()
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const starterQuestions =
    userRole === 'caretaker'
      ? [
          `What medicines does ${caretakerDetails.patientName} need to take daily?`,
          `When is ${caretakerDetails.patientName}'s next doctor review or test?`,
          `How can I help ${caretakerDetails.patientName} manage thyroid hormone absorption?`,
          `Draft a gentle morning reminder message for ${caretakerDetails.patientName}`,
        ]
      : [
          'What does my TSH result of 2.45 mIU/L mean?',
          'Can I take Thyronorm with morning tea or coffee?',
          'When is my next doctor review or follow-up due?',
          'Is my Vitamin D level of 18 okay?',
        ]

  const handleScheduleAlertsFromChat = (alerts: SuggestedAlert[]) => {
    const formatted: StoredAlert[] = alerts.map((a, i) => ({
      id: `chat-alert-${Date.now()}-${i}`,
      title: a.title,
      date: a.date,
      time: a.time || '08:00 AM',
      type: a.type || 'daily_dose',
      description: a.description,
      sourceDocument: 'AI Chat Recommendation',
    }))
    addStoredAlerts(formatted)
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setActiveTriageCard(null)

    // Context from stored files
    const docSummaries = storedDocuments
      .map((d) => `${d.title} (${d.document_date}): ${d.ai_summary || ''}`)
      .join('\n')

    try {
      // Send to Ollama endpoint
      const res = await fetch('/api/ai/ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          message: text.trim(),
          chatHistory: messages.map((m) => ({ role: m.role, content: m.content })),
          documentContext: docSummaries || undefined,
          role: userRole,
          patientName: userRole === 'caretaker' ? caretakerDetails.patientName : patient.preferredName,
          caretakerName: caretakerDetails.caretakerName,
        }),
      })

      const data = await res.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'I could not process that response. Please try again.',
        citations: [
          {
            documentTitle: 'Thyroid Protocol & Endocrinology Prescription',
            date: '12 Oct 2026',
          },
        ],
        triageLevel: 'safe',
        disclaimer:
          'HER TURN AI provides general clinical guidance only. Always confirm medication changes with your doctor.',
        suggestedAlerts: data.suggestedAlerts || [],
        isOllama: data.isOllama !== false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      // Fallback
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've reviewed the records for **${userRole === 'caretaker' ? caretakerDetails.patientName : patient.preferredName}**.

Your current prescription includes **Thyronorm 50 mcg** (take early morning on an empty stomach) and **Vitamin D3 (D-Rise 60k)** weekly.

Would you like me to set daily alerts for your medications or upcoming doctor reviews?`,
        triageLevel: 'safe',
        suggestedAlerts: [
          {
            date: 'Daily, 07:00 AM',
            time: '07:00 AM',
            type: 'daily_dose',
            title: 'Thyronorm 50 mcg Morning Dose',
            description: 'Take on empty stomach 45 mins before breakfast.',
          },
        ],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const toggleVoice = () => {
    if (typeof window === 'undefined') return
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser.')
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.lang = 'en-IN'
      recognition.interimResults = false

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onerror = () => {
        setIsListening(false)
        toast.error('Voice input error. Please try again.')
      }
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript))
      }
      recognition.start()
    } catch {
      setIsListening(false)
    }
  }

  const isEmpty = messages.length === 0
  const activeUserInitial =
    userRole === 'caretaker' ? caretakerDetails.caretakerName : patient.preferredName

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm">
      {/* Chat header */}
      <div className="border-b border-border/80 bg-card/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-base text-foreground">
                HER TURN AI Assistant
              </h1>
              {ollamaReady ? (
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                  Ollama Local LLM
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  Cloud AI
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {userRole === 'caretaker'
                ? `Caretaker Mode: Assisting with ${caretakerDetails.patientName}'s healthcare`
                : 'Empowering you with clear explanations of your health records'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userRole === 'caretaker' ? (
            <Badge variant="outline" className="gap-1 bg-purple-50 text-purple-900 border-purple-300 dark:bg-purple-950/40 dark:text-purple-200">
              <HeartHandshake className="h-3 w-3" />
              <span>Caregiver</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950/40 dark:text-rose-200">
              <User className="h-3 w-3" />
              <span>Self Mode</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Chat Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full gap-6 px-4 py-8"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Hello, {userRole === 'caretaker' ? caretakerDetails.caretakerName : patient.preferredName} 👋
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-sm mx-auto">
                {userRole === 'caretaker'
                  ? `I'm here to help you manage ${caretakerDetails.patientName}'s medical records, understand prescriptions, and set automatic alert reminders.`
                  : 'I can help you understand your uploaded reports, explain medical terms, and schedule alerts for your medicines.'}
              </p>
            </div>

            <div className="w-full max-w-md space-y-2">
              <p className="text-xs font-semibold text-muted-foreground text-center mb-2">
                Suggested questions to ask:
              </p>
              {starterQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full rounded-xl border border-border/80 bg-card px-4 py-3 text-left text-xs font-medium hover:bg-muted/60 hover:border-primary/40 transition-all shadow-xs text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {!isEmpty && (
          <div className="py-4 space-y-3">
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  userName={activeUserInitial}
                  onScheduleAlerts={handleScheduleAlertsFromChat}
                />
              ))}
            </AnimatePresence>

            {activeTriageCard && (
              <div className="my-2">
                <TriageCard level={activeTriageCard} onDismiss={() => setActiveTriageCard(null)} />
              </div>
            )}

            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border/80 bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-background shadow-xs p-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              userRole === 'caretaker'
                ? `Ask anything about ${caretakerDetails.patientName}'s records or set reminders...`
                : 'Ask about your health records, prescriptions, or dates... (Press Enter to send)'
            }
            rows={1}
            className="flex-1 resize-none bg-transparent px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none min-h-[36px] max-h-[120px]"
            aria-label="Message input"
          />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoice}
              className={cn(
                'h-9 w-9 rounded-xl',
                isListening && 'text-red-500 bg-red-50 dark:bg-red-950/20 animate-pulse'
              )}
              aria-label={isListening ? 'Stop recording' : 'Start voice input'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-9 w-9 rounded-xl bg-primary text-primary-foreground"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          HER TURN AI analyzes your documents locally with Ollama. General health information only — not medical advice.
        </p>
      </div>
    </div>
  )
}
