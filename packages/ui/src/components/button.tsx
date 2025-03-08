import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import { cn } from '../util/cn'

export function Button({
  asChild,
  children,
  className,
  color,
  feedback,
  highContrast,
  radius,
  shadow,
  size = 'md',
  variant = 'solid',
  onClick,
  ...props
}: Omit<React.ComponentProps<'button'>, 'color'> & {
  asChild?: boolean
  color?: 'blue' | 'gray' | 'red'
  feedback?: string
  highContrast?: boolean
  radius?: 'full'
  shadow?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'plain' | 'soft' | 'solid' | 'surface'
}) {
  const Comp = asChild ? Slot : 'button'

  const feedbackTimeout = React.useRef<NodeJS.Timeout>(undefined)
  const [showFeedback, setShowFeedback] = React.useState(false)

  return (
    <Comp
      className={cn(
        // Base
        'relative isolate inline-flex cursor-pointer items-center justify-center whitespace-nowrap border border-transparent font-medium',
        // Focus
        'focus-visible:border-focus-600 focus-visible:ring-focus-600 focus-visible:outline-none focus-visible:ring',
        // Disabled
        'disabled:pointer-events-none',
        // Shadow
        shadow && 'shadow-xs',
        // Icons
        '[&>svg:first-child]:-ml-0.5 [&>svg:last-child]:-mr-0.5',
        // Size
        {
          xs: 'h-6 gap-1.5 rounded-md px-2 text-xs [&>svg]:size-3.5',
          sm: 'h-7.5 gap-2 rounded-md px-3 text-sm [&>svg]:size-4',
          md: '[&>svg]:size-4.5 h-9 gap-2 rounded-lg px-4 text-sm',
          lg: 'h-10.5 gap-2.5 rounded-lg px-4 text-base [&>svg]:size-5',
        }[size],
        // Variant
        {
          outline: cn(
            'bg-background border-accent-200 hover:bg-accent-50',
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
            'bg-accent-200 hover:bg-accent-300',
            'disabled:bg-gray-100 disabled:text-gray-300',
            highContrast && 'text-accent-900',
            !highContrast && 'text-accent-500'
          ),
          solid: cn(
            'text-accent-contrast hover:after:bg-accent-contrast/10 [&>svg]:text-accent-100 after:absolute after:inset-0 after:-z-10',
            'focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:bg-gray-100 disabled:text-gray-300',
            highContrast && 'bg-accent-900',
            !highContrast && 'bg-accent-600'
          ),
          surface: cn(
            'border-accent-200 bg-accent-50 hover:border-accent-300',
            'disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-300',
            highContrast && 'text-accent-900',
            !highContrast && 'text-accent-500'
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
      {feedback && showFeedback ? <span>{feedback}</span> : children}
    </Comp>
  )
}
