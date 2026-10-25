'use client'

import React from 'react'
import Link from 'next/link'

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto'
  size?: 'sm' | 'md' | 'lg'
  withTagline?: boolean
  href?: string
}

export function Logo({
  variant = 'auto',
  size = 'md',
  withTagline = false,
  href = '/',
}: LogoProps) {
  const isLight = variant === 'light'
  const isDark = variant === 'dark'

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl sm:text-4xl',
  }

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  const content = (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Icon: stylized concentric caring circles / petal motif */}
      <div
        className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 shadow-sm`}
        style={{
          background: isLight
            ? 'linear-gradient(135deg, #F5E6D0 0%, #E8A0A0 100%)'
            : 'linear-gradient(135deg, #4A1C40 0%, #7B3F6E 100%)',
        }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6"
        >
          {/* Outer gentle petal */}
          <circle
            cx="16"
            cy="16"
            r="12"
            stroke={isLight ? '#4A1C40' : '#F5E6D0'}
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.8"
          />
          {/* Inner blooming curve representing "her turn" */}
          <path
            d="M10 17C10 13.6863 12.6863 11 16 11C19.3137 11 22 13.6863 22 17C22 20.3137 19.3137 23 16 23C13.5 23 12 21.5 12 19"
            stroke={isLight ? '#4A1C40' : '#E8A0A0'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx="16"
            cy="16"
            r="3"
            fill={isLight ? '#4A1C40' : '#FFFFFF'}
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-serif font-bold tracking-tight leading-none ${sizeClasses[size]} ${
            isLight
              ? 'text-white'
              : isDark
              ? 'text-[#4A1C40] dark:text-plum-100'
              : 'text-[#4A1C40] dark:text-sand-100'
          }`}
        >
          HER TURN
        </span>
        {withTagline && (
          <span
            className={`text-[10px] sm:text-xs font-sans tracking-wider uppercase font-medium mt-0.5 ${
              isLight ? 'text-sand-100/90' : 'text-plum-950/70 dark:text-sand-200/80'
            }`}
          >
            Your Health, Your Way
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A1C40] rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}
