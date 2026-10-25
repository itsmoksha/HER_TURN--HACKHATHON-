import * as React from 'react'
import { cn } from '@/lib/utils'

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'bg-background text-foreground border',
    destructive: 'border-red-500/50 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 [&>svg]:text-red-600',
    success: 'border-green-500/50 text-green-800 dark:text-green-400 bg-green-50 dark:bg-green-950/20 [&>svg]:text-green-600',
    warning: 'border-amber-500/50 text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 [&>svg]:text-amber-600',
    info: 'border-blue-500/50 text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 [&>svg]:text-blue-600',
  }
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:h-4 [&>svg]:w-4',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn('mb-1 font-semibold leading-none tracking-tight', className)} {...props} />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
