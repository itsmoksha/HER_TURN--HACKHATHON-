import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  compact?: boolean
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border/80 bg-gradient-to-b from-card/80 to-muted/20 p-8 shadow-sm transition-all',
        compact ? 'py-6 px-4' : 'py-12 px-6',
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex items-center justify-center rounded-full bg-secondary/80 p-4 ring-8 ring-secondary/30 text-primary shadow-sm">
          {icon}
        </div>
      )}

      <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-6 flex items-center gap-3">{action}</div>}
    </div>
  )
}
