'use client'

import * as React from 'react'
import Image, { type ImageProps } from 'next/image'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export interface SafeImageProps extends Omit<ImageProps, 'alt'> {
  alt: string
  fallbackSrc?: string
  fallbackComponent?: React.ReactNode
  containerClassName?: string
}

export function SafeImage({
  src,
  alt,
  fallbackSrc,
  fallbackComponent,
  className,
  containerClassName,
  width,
  height,
  fill,
  sizes,
  priority,
  ...props
}: SafeImageProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)
  const [currentSrc, setCurrentSrc] = React.useState(src)

  React.useEffect(() => {
    setCurrentSrc(src)
    setHasError(false)
    setIsLoading(true)
  }, [src])

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setIsLoading(false)
    } else {
      setHasError(true)
      setIsLoading(false)
    }
  }

  // Fallback state if image failed to load and no alternative src worked
  if (hasError) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>
    }

    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 p-4 text-center text-muted-foreground select-none',
          fill ? 'absolute inset-0 h-full w-full' : '',
          containerClassName
        )}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <ImageIcon className="h-8 w-8 stroke-[1.5] text-muted-foreground/60 mb-1" />
        <span className="text-xs font-medium max-w-[80%] truncate">
          {alt || 'Image unavailable'}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        fill ? 'h-full w-full' : 'inline-block',
        containerClassName
      )}
    >
      {isLoading && (
        <Skeleton
          className={cn(
            'absolute inset-0 z-10 rounded-lg',
            fill ? 'h-full w-full' : ''
          )}
          style={!fill && width && height ? { width, height } : undefined}
        />
      )}

      <Image
        src={currentSrc}
        alt={alt || 'HER TURN medical resource image'}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        {...props}
      />
    </div>
  )
}
