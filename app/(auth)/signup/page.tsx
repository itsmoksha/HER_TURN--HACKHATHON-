'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'

// Zod schema for signup validation
const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(60, 'Name must be less than 60 characters'),
    email: z
      .string()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to our Privacy Policy to proceed',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: true,
    },
    mode: 'onChange',
  })

  const passwordValue = watch('password', '')

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!passwordValue) return { score: 0, label: '', color: '' }

    let score = 0
    if (passwordValue.length >= 8) score += 1
    if (/[A-Z]/.test(passwordValue) && /[a-z]/.test(passwordValue)) score += 1
    if (/\d/.test(passwordValue)) score += 1
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1

    const levels = [
      { score: 0, label: 'Very weak', color: 'bg-destructive' },
      { score: 1, label: 'Weak', color: 'bg-red-500' },
      { score: 2, label: 'Fair', color: 'bg-amber-500' },
      { score: 3, label: 'Good', color: 'bg-emerald-400' },
      { score: 4, label: 'Strong', color: 'bg-emerald-600' },
    ]

    return levels[score]
  }, [passwordValue])

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Save initial signup details to localStorage so onboarding can prefill
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'her_turn_signup_draft',
          JSON.stringify({
            name: data.name,
            email: data.email,
          })
        )
      }

      toast.success('Account created!', {
        description: 'Let us personalize your HER TURN experience.',
      })

      // Proceed to multi-step onboarding flow
      router.push('/onboarding')
    } catch {
      toast.error('Something went wrong during sign up. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoAccount = () => {
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

    toast.info('Exploring Demo Mode', {
      description: 'Taking you directly to Priya’s preloaded dashboard.',
    })

    router.push('/dashboard')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Heading & Tagline */}
      <div className="text-center mb-6">
        <h1 className="font-serif text-3xl font-bold text-[#4A1C40] dark:text-sand-100 tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          Take your turn to prioritize your health, your records, and your peace of mind.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-1.5"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <User className="w-4 h-4" />
            </div>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Priya Sharma"
              {...register('name')}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#4A1C40] transition-colors ${
                errors.name
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-border focus:border-[#4A1C40]'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name.message}</span>
            </p>
          )}
        </div>

        {/* Email Address */}
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
              placeholder="priya@example.com"
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

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters"
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

          {/* Password Strength Indicator */}
          {passwordValue && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Strength:</span>
                <span className="font-medium text-foreground">{passwordStrength.label}</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 rounded-full transition-colors ${
                      passwordStrength.score >= step
                        ? passwordStrength.color
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter password"
              {...register('confirmPassword')}
              className={`w-full pl-10 pr-11 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#4A1C40] transition-colors ${
                errors.confirmPassword
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-border focus:border-[#4A1C40]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.confirmPassword.message}</span>
            </p>
          )}
        </div>

        {/* Agreement Checkbox */}
        <div className="pt-2">
          <div className="flex items-start gap-2.5">
            <input
              id="agreeToTerms"
              type="checkbox"
              {...register('agreeToTerms')}
              className="mt-1 w-4 h-4 rounded border-border text-[#4A1C40] focus:ring-[#4A1C40]"
            />
            <label htmlFor="agreeToTerms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
              By signing up, you agree to our{' '}
              <a
                href="/#privacy"
                target="_blank"
                rel="noreferrer"
                className="text-[#4A1C40] dark:text-[#E8A0A0] font-semibold underline underline-offset-2"
              >
                Privacy Policy
              </a>{' '}
              and confirm your data is handled strictly per DPDP Act standards.
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.agreeToTerms.message}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3 px-4 rounded-xl bg-[#4A1C40] hover:bg-[#5f2353] text-white font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-70 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Setting up your sanctuary...</span>
            </>
          ) : (
            <>
              <span>Continue to Personalization</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Alternative */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-[#200c1e] px-3 text-muted-foreground font-medium">
            or explore right away
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDemoAccount}
        className="w-full py-2.5 px-4 rounded-xl border border-[#E8A0A0]/70 dark:border-plum-700 bg-[#F5E6D0]/30 hover:bg-[#F5E6D0]/60 dark:bg-plum-950/40 text-[#4A1C40] dark:text-sand-100 font-semibold text-sm transition-all flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-[#4A1C40] dark:text-[#E8A0A0]" />
        <span>Explore Instant Demo as Priya</span>
      </button>

      {/* Login Link */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-[#4A1C40] dark:text-[#E8A0A0] font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
