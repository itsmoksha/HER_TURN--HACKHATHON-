'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { mockChatHistory, mockUser } from '@/lib/db/mock-data'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Array<{ documentTitle: string; date: string }>
  triageLevel?: 'safe' | 'caution' | 'urgent'
  disclaimer?: string
  suggestedFollowUps?: string[]
  safetyFlagged?: boolean
  timestamp: Date
}

// ─── Starter questions ───────────────────────────────────────────────────────

const STARTER_QUESTIONS = [
  'What does my TSH result of 4.2 mean?',
  'Explain my PCOS ultrasound report',
  'What should I ask at my next appointment?',
  'Is my Vitamin D level of 18 okay?',
]

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
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 animate-pulse-soft">
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

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3 px-4 py-2', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
      )}

      <div className={cn('max-w-[75%] space-y-2', isUser ? 'items-end' : 'items-start')}>
        {/* Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-card border border-border shadow-card rounded-bl-sm'
          )}
        >
          {message.content}
        </div>

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
            variant={message.triageLevel === 'urgent' ? 'destructive' : 'warning' as 'destructive' | 'warning'}
            className="text-xs"
          >
            {message.triageLevel === 'urgent' ? '⚠️ Seek care now' : '🔔 See doctor soon'}
          </Badge>
        )}
        {message.triageLevel === 'safe' && (
          <Badge variant="success" className="text-xs">
            ✓ Self-care likely fine
          </Badge>
        )}

        {/* Disclaimer */}
        {message.disclaimer && (
          <p className="text-xs text-muted-foreground leading-snug max-w-sm">
            ℹ️ {message.disclaimer}
          </p>
        )}

        {/* Suggested follow-ups */}
        {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {message.suggestedFollowUps.map((q, i) => (
              <span
                key={i}
                className="cursor-pointer rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs hover:bg-muted transition-colors"
              >
                {q}
              </span>
            ))}
          </div>
        )}

        {/* Report problem */}
        {!isUser && (
          <button className="text-xs text-muted-foreground/60 hover:text-muted-foreground underline transition-colors">
            Report a problem with this answer
          </button>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
          {mockUser.name.charAt(0)}
        </div>
      )}
    </motion.div>
  )
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-3 shadow-card">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-muted-foreground/40"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [activeTriageCard, setActiveTriageCard] = useState<'caution' | 'urgent' | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

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

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          userId: mockUser.id,
          language: 'en',
        }),
      })
      const data = await res.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response?.content || data.content || 'I could not process that. Please try again.',
        citations: data.response?.citations || [],
        triageLevel: data.response?.triageLevel || data.assessment?.triageLevel || 'safe',
        disclaimer: data.response?.disclaimer || 'This is general health information only, not medical advice. Always consult your doctor.',
        suggestedFollowUps: data.response?.suggestedFollowUps || [],
        safetyFlagged: data.assessment?.triageLevel === 'urgent',
        timestamp: new Date(),
      }

      // Show triage card for non-safe responses
      if (data.assessment?.triageLevel === 'urgent') {
        setActiveTriageCard('urgent')
      } else if (data.assessment?.triageLevel === 'caution') {
        setActiveTriageCard('caution')
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I'm having trouble connecting right now. In demo mode, I'm using pre-loaded responses. Please try asking about your TSH levels, Vitamin D, or PCOS.",
        triageLevel: 'safe',
        disclaimer: 'This is general health information only.',
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
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Try Chrome.')
      return
    }
    setIsListening((prev) => !prev)
    // In a real implementation, we'd use the Web Speech API here
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">Your Health Companion</h1>
            <p className="text-xs text-muted-foreground">Ask anything about your health records</p>
          </div>
          <div className="ml-auto">
            <Badge variant="secondary" className="text-xs">
              Demo Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {/* Empty state with starter questions */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full gap-6 px-4 py-8"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Hello, {mockUser.name.split(' ')[0]} 👋
              </h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                I can help you understand your health records, explain medical terms, and guide you on next steps.
              </p>
            </div>

            <Alert variant="info" className="max-w-md">
              <AlertTitle>I always cite my sources</AlertTitle>
              <AlertDescription>
                Every answer references your actual documents so you know exactly where the information comes from.
              </AlertDescription>
            </Alert>

            <div className="w-full max-w-md space-y-2">
              <p className="text-xs font-medium text-muted-foreground text-center mb-3">Try asking:</p>
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-left text-sm hover:bg-accent hover:border-primary/30 transition-all duration-200 shadow-card"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {!isEmpty && (
          <div className="py-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </AnimatePresence>

            {/* Triage card (shown above typing indicator) */}
            {activeTriageCard && (
              <div className="my-2">
                <TriageCard level={activeTriageCard} onDismiss={() => setActiveTriageCard(null)} />
              </div>
            )}

            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-background shadow-card p-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your health records... (Press Enter to send)"
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none min-h-[36px] max-h-[120px]"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
            aria-label="Message input"
          />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoice}
              className={cn('h-9 w-9 rounded-xl', isListening && 'text-red-500 bg-red-50 dark:bg-red-950/20')}
              aria-label={isListening ? 'Stop recording' : 'Start voice input'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-9 w-9 rounded-xl"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground/70">
          HER TURN AI provides general health information only — not medical advice. Always consult your doctor.
        </p>
      </div>
    </div>
  )
}
