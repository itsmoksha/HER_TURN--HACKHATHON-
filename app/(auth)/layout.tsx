import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Account | HER TURN',
  description: 'Sign in, register, or personalize your HER TURN health companion experience.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative flex flex-col justify-between items-center bg-gradient-to-br from-[#FAFAF8] via-[#F5E6D0]/35 to-[#E8A0A0]/20 dark:from-[#150713] dark:via-[#240c20] dark:to-[#170614] px-4 py-8 sm:py-12 transition-colors">
      {/* Top Bar with Back Link */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-[#4A1C40] dark:hover:text-[#E8A0A0] transition-colors px-3 py-1.5 rounded-full hover:bg-white/60 dark:hover:bg-plum-900/40"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-[#4A1C40] dark:text-[#E8A0A0]" />
          <span>256-bit Encrypted Vault</span>
        </div>
      </div>

      {/* Main Centered Auth Card Container */}
      <main className="w-full flex flex-col items-center justify-center my-auto py-6 z-10">
        <div className="mb-6 sm:mb-8 text-center flex flex-col items-center">
          <Logo size="lg" withTagline={true} />
        </div>

        <div className="w-full max-w-md bg-white/95 dark:bg-[#200c1e]/90 backdrop-blur-md rounded-3xl border border-[#4A1C40]/10 dark:border-plum-800/50 shadow-2xl shadow-[#4A1C40]/10 p-6 sm:p-9 transition-all">
          {children}
        </div>
      </main>

      {/* Calm, Reassuring Footer */}
      <footer className="w-full max-w-md text-center py-4 text-xs text-muted-foreground z-10">
        <p>
          HER TURN adheres to Indian DPDP Act guidelines. Your personal medical data is strictly private and never monetized.
        </p>
      </footer>

      {/* Soft Ambient Decorative Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#E8A0A0]/15 dark:bg-[#E8A0A0]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#F5E6D0]/30 dark:bg-[#7B3F6E]/10 blur-3xl pointer-events-none" />
    </div>
  )
}
