import * as React from 'react'
import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted/80', className)}
      {...props}
    />
  )
}

/**
 * Realistic multiline text skeleton placeholder
 */
interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
}

function SkeletonText({ lines = 3, className, ...props }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => {
        const isLast = index === lines - 1
        const widthClass = isLast ? 'w-3/5' : index % 2 === 0 ? 'w-full' : 'w-4/5'
        return (
          <Skeleton
            key={index}
            className={cn('h-4', widthClass)}
          />
        )
      })}
    </div>
  )
}

/**
 * Circular avatar skeleton placeholder
 */
interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
  xl: 'h-20 w-20',
}

function SkeletonAvatar({ size = 'md', className, ...props }: SkeletonAvatarProps) {
  return (
    <Skeleton
      className={cn('rounded-full shrink-0', sizeClasses[size], className)}
      {...props}
    />
  )
}

/**
 * Full card skeleton placeholder for list loading states
 */
function SkeletonCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-6 shadow-card space-y-4',
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-4">
        <SkeletonAvatar size="md" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard }
