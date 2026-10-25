'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'

// Zod schema for login form validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. name@example.com)'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setServerError(null)

    try {
      // Simulate authentication request
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Store authenticated user session in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'her_turn_user',
          JSON.stringify({
            email: data.email,
            name: data.email.split('@')[0],
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
          })
        )
      }

      toast.success('Welcome back to HER TURN!', {
        description: 'Retrieving your secure health timeline...',
      })

      router.push('/dashboard')
    } catch {
      setServerError('Unable to sign in with these credentials. Please check your email or password.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueWithDemo = async () => {
    setIsDemoLoading(true)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('her_turn_demo_mode', 'true')
        localStorage.setItem(
          'her_turn_user',
          JSON.stringify({
            name: 'Priya Sharma',
            email: 'priya.sharma@example.com',
            ageRange: '25-34',
            language: 'en',
            conditions: ['PCOS', 'Thyroid condition'],
            isLoggedIn: true,
            isDemo: true,
          })
        )
      }

      toast.info('Starting Priya’s demo session', {
        description: 'Loaded sample PCOS & thyroid records and appointments.',
      })

      router.push('/dashboard')
    } finally {
      setIsDemoLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#4A1C40] dark:text-sand-100 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Your personal health companion is ready for you.
        </p>
      </div>

      {/* Global / Server Error Display */}
      {serverError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </motion.div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#4A1C40] transition-colors ${
                errors.email
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-border focus:border-[#4A1C40]'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() =>
                toast.info('Password Reset', {
                  description: 'A reset link has been dispatched to your email address.',
                })
              }
              className="text-xs font-medium text-[#4A1C40] dark:text-[#E8A0A0] hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full pl-10 pr-11 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#4A1C40] transition-colors ${
                errors.password
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-border focus:border-[#4A1C40]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="rememberMe"
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 rounded border-border text-[#4A1C40] focus:ring-[#4A1C40] focus:ring-offset-0"
          />
          <label htmlFor="rememberMe" className="text-xs text-muted-foreground select-none cursor-pointer">
            Keep me signed in on this device
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isDemoLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-[#4A1C40] hover:bg-[#5f2353] text-white font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-70 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-[#200c1e] px-3 text-muted-foreground font-medium">
            or try without signing up
          </span>
        </div>
      </div>

      {/* Demo Account Button */}
      <button
        type="button"
        onClick={handleContinueWithDemo}
        disabled={isLoading || isDemoLoading}
        className="w-full py-2.5 px-4 rounded-xl border-2 border-[#E8A0A0]/60 dark:border-plum-700 bg-[#F5E6D0]/30 dark:bg-plum-950/40 hover:bg-[#F5E6D0]/60 text-[#4A1C40] dark:text-sand-100 font-semibold text-sm transition-all flex items-center justify-center gap-2 group"
      >
        {isDemoLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#4A1C40]" />
            <span>Loading Priya&apos;s demo...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-[#4A1C40] dark:text-[#E8A0A0] transition-transform group-hover:rotate-12" />
            <span>Continue with Priya&apos;s Demo</span>
          </>
        )}
      </button>

      {/* Signup Link */}
      <p className="text-center text-xs text-muted-foreground mt-8">
        Don&apos;t have an account yet?{' '}
        <Link
          href="/signup"
          className="text-[#4A1C40] dark:text-[#E8A0A0] font-semibold hover:underline"
        >
          Create account
        </Link>
      </p>
    </motion.div>
  )
}
