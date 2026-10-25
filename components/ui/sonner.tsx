'use client'

import * as React from 'react'
import { Toaster as Sonner } from 'sonner'
import { useTheme } from 'next-themes'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-card rounded-xl font-sans text-sm',
          description: 'group-[.toast]:text-muted-foreground text-xs',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground hover:group-[.toast]:bg-primary/90 font-medium rounded-lg px-3 py-1.5 text-xs transition-colors',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground hover:group-[.toast]:bg-muted/80 rounded-lg px-3 py-1.5 text-xs transition-colors',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
