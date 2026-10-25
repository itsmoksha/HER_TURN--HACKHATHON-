'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Upload, Brain, FolderHeart, MessageSquare, Bell,
  Shield, Sparkles, ArrowRight, CheckCircle2,
  Moon, Sun, Globe
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'

// ─── Inline Logo ──────────────────────────────────────────────────────────────

function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' }
  return (
    <div className={`flex items-center gap-2 font-serif font-bold ${sizes[size]}`}>
      <svg viewBox="0 0 32 32" className={size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-8 w-8' : 'h-12 w-12'} aria-hidden>
        <circle cx="16" cy="16" r="14" fill="#4A1C40" />
        <path d="M16 8 C12 12 8 13 8 17 C8 21 11.5 24 16 24 C20.5 24 24 21 24 17 C24 13 20 12 16 8Z" fill="#E8A0A0" opacity="0.9" />
        <circle cx="16" cy="17" r="4" fill="#FAFAF8" opacity="0.85" />
      </svg>
      <span className="text-plum-950 dark:text-white tracking-wide">HER TURN</span>
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Navbar() {
  const { theme, setTheme } = useTheme()
  const [lang, setLang] = useState<'en' | 'hi' | 'kn'>('en')
  const langs = ['en', 'hi', 'kn'] as const

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/80 dark:bg-plum-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo size="sm" />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/70">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#privacy" className="hover:text-foreground transition-colors">Privacy</a>
          <Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link>
        </div>
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <div className="hidden sm:flex items-center rounded-full border border-border bg-muted/50 p-0.5">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                  lang === l ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {l === 'en' ? 'EN' : l === 'hi' ? 'हि' : 'ಕ'}
              </button>
            ))}
          </div>
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
          <Link
            href="/login"
            className="hidden sm:flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ prefersReduced }: { prefersReduced: boolean | null }) {
  const anim = prefersReduced
    ? {}
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7 } }

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden gradient-hero px-6 pt-24 pb-16">
      {/* Animated background orbs */}
      {!prefersReduced && (
        <>
          <motion.div
            className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-sand-300/20 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </>
      )}

      <div className="relative mx-auto max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div>
          <motion.div {...anim}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Built for Indian women's health
            </span>
          </motion.div>
          <motion.h1
            {...(prefersReduced ? {} : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.1 } })}
            className="font-serif text-5xl lg:text-6xl font-bold leading-tight text-white"
          >
            Everyone else had their turn.
            <span className="block text-rose-soft mt-2">This one is yours.</span>
          </motion.h1>
          <motion.p
            {...(prefersReduced ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.25 } })}
            className="mt-6 text-lg text-white/70 leading-relaxed max-w-lg"
          >
            HER TURN is your personal AI health companion — helping you understand
            your medical records, manage your medicines, and take charge of your
            health journey, in language you actually understand.
          </motion.p>
          <motion.div
            {...(prefersReduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.4 } })}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-plum-950 shadow-lg hover:bg-white/90 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Take your turn <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/20 transition-all"
            >
              Try demo account
            </Link>
          </motion.div>
          <motion.p
            {...(prefersReduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.6 } })}
            className="mt-5 text-sm text-white/50"
          >
            No credit card. No setup. Works in English, हिन्दी, and ಕನ್ನಡ.
          </motion.p>
        </div>

        {/* Right: abstract illustration */}
        <motion.div
          {...(prefersReduced ? {} : { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1, delay: 0.2 } })}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative h-80 w-80">
            {/* Concentric rings */}
            {[1, 0.75, 0.5, 0.25].map((scale, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border"
                style={{
                  transform: `scale(${scale})`,
                  borderColor: i % 2 === 0 ? 'rgba(232,160,160,0.3)' : 'rgba(245,230,208,0.2)',
                  margin: 'auto',
                  width: `${scale * 100}%`,
                  height: `${scale * 100}%`,
                  top: `${(1 - scale) * 50}%`,
                  left: `${(1 - scale) * 50}%`,
                }}
              />
            ))}
            {/* Centre orb */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                <FolderHeart className="h-12 w-12 text-rose-soft" />
              </div>
            </div>
            {/* Floating icons */}
            {[
              { Icon: Brain, angle: 0, label: 'AI' },
              { Icon: Shield, angle: 72, label: 'Safe' },
              { Icon: Bell, angle: 144, label: 'Remind' },
              { Icon: Upload, angle: 216, label: 'Upload' },
              { Icon: MessageSquare, angle: 288, label: 'Ask' },
            ].map(({ Icon, angle, label }) => {
              const r = 130
              const x = r * Math.cos((angle - 90) * (Math.PI / 180))
              const y = r * Math.sin((angle - 90) * (Math.PI / 180))
              return (
                <div
                  key={label}
                  className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-white/15 border border-white/20 backdrop-blur-sm"
                  style={{ left: `calc(50% + ${x}px - 24px)`, top: `calc(50% + ${y}px - 24px)` }}
                >
                  <Icon className="h-5 w-5 text-white/80" />
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {!prefersReduced && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 pt-2">
            <div className="h-2 w-1 rounded-full bg-white/50" />
          </div>
        </motion.div>
      )}
    </section>
  )
}

// ─── Problem section ──────────────────────────────────────────────────────────

const PAIN_POINTS = [
  { emoji: '💊', title: 'Prescriptions in a drawer', desc: 'Scattered across homes, purses, and forgotten corners.' },
  { emoji: '📱', title: 'Reports in your gallery', desc: 'Impossible to find when the doctor asks for old results.' },
  { emoji: '🤷‍♀️', title: 'Terms nobody explains', desc: 'TSH, HbA1c, AMH — what does any of it actually mean?' },
  { emoji: '😔', title: 'Medicines missed', desc: 'Busy lives mean doses get forgotten, conditions get worse.' },
  { emoji: '👨‍👩‍👧', title: 'Sharing with family is hard', desc: 'Either full access or none. No middle ground.' },
]

function ProblemSection() {
  return (
    <section id="problem" className="bg-sand-100 dark:bg-plum-950/30 py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl font-semibold">Your health has always come last.</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Women in India spend their lives managing everyone else's health. Their own gets deferred, scattered, and ignored.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {PAIN_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="text-3xl mb-3">{point.emoji}</div>
              <h3 className="font-semibold mb-1">{point.title}</h3>
              <p className="text-sm text-muted-foreground">{point.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-xl font-serif font-semibold text-primary"
        >
          HER TURN changes all of this. ✦
        </motion.p>
      </div>
    </section>
  )
}

// ─── Animated flow ─────────────────────────────────────────────────────────────

const FLOW_STEPS = [
  { icon: Upload, title: 'Upload', desc: 'Photo or PDF of any health document' },
  { icon: Brain, title: 'Extract', desc: 'AI reads and structures the content' },
  { icon: FolderHeart, title: 'Store', desc: 'Saved securely, searchable always' },
  { icon: MessageSquare, title: 'Ask', desc: 'Chat with AI about your own records' },
  { icon: Bell, title: 'Remind', desc: 'Smart reminders from confirmed medicines' },
]

function FlowSection() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-4xl font-semibold">How it works</h2>
          <p className="mt-3 text-muted-foreground">Five steps, zero complexity.</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col sm:flex-row items-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-3">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-[100px]">{step.desc}</p>
              </motion.div>
              {i < FLOW_STEPS.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 rotate-90 sm:rotate-0 mx-1 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Brain, title: 'Understand your records', desc: 'AI explains your lab reports and prescriptions in plain language, with a glossary of medical terms.' },
  { icon: Bell, title: 'Never miss a medicine', desc: 'Smart reminders built only from confirmed prescriptions. Mark taken, snooze, or skip.' },
  { icon: FolderHeart, title: 'Prepare for appointments', desc: 'One-tap doctor visit summary: current medicines, recent labs, suggested questions.' },
  { icon: MessageSquare, title: 'Ask your health companion', desc: 'Chat with AI grounded in YOUR documents. Every answer cites which record it came from.' },
  { icon: Shield, title: 'Share selectively', desc: 'Granular control over what family can see. Per-document, per-person. Revoke instantly.' },
  { icon: Globe, title: 'Built for Indian women', desc: 'PCOS, thyroid, anemia, cycle tracking — the conditions that matter most, in your language.' },
]

function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 bg-muted/30">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-4xl font-semibold">Everything you need</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            One place for all your health records, insights, and reminders.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <feat.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1.5">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Privacy section ──────────────────────────────────────────────────────────

function PrivacySection() {
  return (
    <section id="privacy" className="gradient-plum py-20 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Shield className="h-12 w-12 text-rose-soft mx-auto mb-4" />
          <h2 className="font-serif text-4xl font-bold text-white">Your privacy is non-negotiable.</h2>
          <p className="mt-4 text-white/70 text-lg max-w-xl mx-auto">
            Your health data belongs to you. We built HER TURN with that as the first principle, not an afterthought.
          </p>
        </motion.div>
        <div className="mt-12 grid sm:grid-cols-3 gap-6 text-left">
          {[
            { icon: Shield, title: 'Encrypted & never sold', desc: 'Data encrypted in transit and at rest. Never sold. Never used to train AI models.' },
            { icon: CheckCircle2, title: 'AI never diagnoses', desc: 'Your AI companion guides and explains — it never prescribes, diagnoses, or replaces your doctor.' },
            { icon: Globe, title: 'DPDP Act aligned', desc: 'Consent-first, purpose-limited, with right to erasure. Your data rights, respected.' },
          ].map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white/10 border border-white/15 p-5"
            >
              <p.icon className="h-6 w-6 text-rose-soft mb-3" />
              <h3 className="font-semibold text-white mb-1.5">{p.title}</h3>
              <p className="text-sm text-white/60">{p.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-10 rounded-2xl bg-white/10 border border-white/15 p-5 text-white/80 text-sm"
        >
          🛡️ <strong className="text-white">Our AI knows when to say "See a doctor now."</strong> — A safety layer runs on every message, detecting urgent signs and showing emergency guidance with India-specific numbers (102, 112).
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────

function FooterCTA() {
  return (
    <section className="py-24 px-6 bg-background text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="font-serif text-5xl font-bold text-foreground">
          Ready to put yourself first?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join thousands of women who are taking charge of their health.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Take your turn <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-8 py-4 text-lg font-semibold hover:bg-muted transition-all"
          >
            Try demo first
          </Link>
        </div>
      </motion.div>

      <footer className="mt-20 border-t pt-8 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
          <Logo size="sm" />
          <p>© 2026 HER TURN · Built for PS1: Women's Healthcare</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </section>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  const prefersReduced = useReducedMotion()

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero prefersReduced={prefersReduced} />
      <ProblemSection />
      <FlowSection />
      <FeaturesSection />
      <PrivacySection />
      <FooterCTA />
    </div>
  )
}
