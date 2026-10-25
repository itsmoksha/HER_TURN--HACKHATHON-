import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  href?: string
  className?: string
}

export function Logo({
  size = 'md',
  showTagline = false,
  href = '/',
  className,
}: LogoProps) {
  const sizeConfig = {
    sm: {
      icon: 'h-6 w-6',
      text: 'text-lg',
      tagline: 'text-[10px]',
      gap: 'gap-2',
    },
    md: {
      icon: 'h-8 w-8',
      text: 'text-xl',
      tagline: 'text-xs',
      gap: 'gap-2.5',
    },
    lg: {
      icon: 'h-11 w-11',
      text: 'text-3xl',
      tagline: 'text-sm',
      gap: 'gap-3',
    },
  }[size]

  const content = (
    <div
      className={cn(
        'inline-flex items-center select-none group transition-opacity hover:opacity-90',
        sizeConfig.gap,
        className
      )}
    >
      {/* Handcrafted Stylized Lotus Flower Brand Icon */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 via-rose-soft/20 to-sand-100/40 p-1.5 shadow-sm text-primary',
          sizeConfig.icon
        )}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Base Calyx Curve */}
          <path
            d="M8 24C12 26.5 20 26.5 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Central Lotus Petal */}
          <path
            d="M16 4C13.5 9 12.5 16 16 23C19.5 16 18.5 9 16 4Z"
            fill="currentColor"
            fillOpacity="0.9"
          />
          {/* Left Petal */}
          <path
            d="M15 13C10 10.5 5 14 6.5 19.5C7.8 23 12 22.5 15 22.5"
            fill="currentColor"
            fillOpacity="0.65"
          />
          {/* Right Petal */}
          <path
            d="M17 13C22 10.5 27 14 25.5 19.5C24.2 23 20 22.5 17 22.5"
            fill="currentColor"
            fillOpacity="0.65"
          />
          {/* Subtle Stamen Bloom Core */}
          <circle cx="16" cy="11.5" r="1.5" fill="#F5E6D0" />
        </svg>
      </div>

      {/* Brand Wordmark & Tagline */}
      <div className="flex flex-col">
        <span
          className={cn(
            'font-serif font-bold tracking-tight text-foreground group-hover:text-primary transition-colors',
            sizeConfig.text
          )}
        >
          <span className="text-primary">HER</span>{' '}
          <span className="text-foreground">TURN</span>
        </span>
        {showTagline && (
          <span
            className={cn(
              'font-sans text-muted-foreground tracking-wide font-normal -mt-0.5',
              sizeConfig.tagline
            )}
          >
            Her Health, In Her Hands
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}
