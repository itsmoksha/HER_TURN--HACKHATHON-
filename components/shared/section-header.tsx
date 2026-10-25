import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  badge?: React.ReactNode
  action?: React.ReactNode
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  action,
  className,
  size = 'default',
}: SectionHeaderProps) {
  const titleSizes = {
    sm: 'text-lg md:text-xl',
    default: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl',
  }[size]

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40',
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2
            className={cn(
              'font-serif font-bold tracking-tight text-foreground text-balance',
              titleSizes
            )}
          >
            {title}
          </h2>
          {badge && <div className="inline-flex shrink-0">{badge}</div>}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          {action}
        </div>
      )}
    </div>
  )
}
