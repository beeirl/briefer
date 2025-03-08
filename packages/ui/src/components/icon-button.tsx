import React from 'react'
import { cn } from '../util/cn'

export function IconButton({
  children,
  className,
  color,
  highContrast,
  feedback,
  radius,
  shadow,
  size = 'md',
  variant = 'solid',
  onClick,
  ...props
}: Omit<React.ComponentProps<'button'>, 'color'> & {
  color?: 'blue' | 'gray' | 'red'
  highContrast?: boolean
  feedback?: React.ReactNode
  radius?: 'full'
  shadow?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'plain' | 'soft' | 'solid' | 'surface'
}) {
  const feedbackTimeout = React.useRef<NodeJS.Timeout>(undefined)
  const [showFeedback, setShowFeedback] = React.useState(false)

  return (
    <button
      className={cn(
        // Base
        'relative isolate inline-flex cursor-pointer items-center justify-center whitespace-nowrap border border-transparent font-medium',
        // Disabled
        'disabled:pointer-events-none',
        // Focus
        'focus-visible:border-focus-600 focus-visible:ring-focus-600 focus-visible:outline-none focus-visible:ring',
        // Shadow
        shadow && 'shadow-xs',
        // Size
        {
          xs: 'size-6 rounded-md [&>svg]:size-3',
          sm: 'size-7.5 rounded-lg [&>svg]:size-4',
          md: '[&>svg]:size-4.5 size-9 rounded-lg',
          lg: 'size-11 rounded-lg [&>svg]:size-5',
        }[size],
        // Variant
        {
          outline: cn(
            'bg-background border-accent-200 text-accent-500 hover:bg-accent-50 border',
            'disabled:border-gray-200 disabled:text-gray-300',
            highContrast && 'text-accent-900',
            !highContrast && 'text-accent-500'
          ),
          plain: cn(
            'hover:bg-accent-100',
            'disabled:text-gray-300',
            highContrast && 'text-accent-900',
            !highContrast && 'text-accent-500'
          ),
          soft: cn(
            'bg-accent-200 text-accent-500 hover:bg-accent-300 hover:text-accent-600',
            'disabled:bg-gray-100 disabled:text-gray-300'
          ),
          solid: cn(
            'bg-accent-600 text-accent-contrast) hover:after:bg-accent-contrast)/10 after:absolute after:inset-0 after:-z-10',
            'focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:bg-gray-100 disabled:text-gray-300',
            highContrast && 'bg-accent-900',
            !highContrast && 'bg-accent-600'
          ),
          surface: cn(
            'border-accent-200 bg-accent-100 text-accent-500 hover:border-accent-300 border',
            'disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-300'
          ),
        }[variant],
        // Radius
        radius === 'full' && 'rounded-full',
        className
      )}
      data-accent-color={color}
      type="button"
      onClick={(e) => {
        if (showFeedback) return
        if (feedback) {
          setShowFeedback(true)
          clearTimeout(feedbackTimeout.current)
          feedbackTimeout.current = setTimeout(() => {
            setShowFeedback(false)
          }, 3000)
        }
        onClick?.(e)
      }}
      {...props}
    >
      {feedback && showFeedback ? feedback : children}
    </button>
  )
}
