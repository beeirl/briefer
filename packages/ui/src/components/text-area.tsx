import React from 'react'
import { cn } from '../util/cn'

export function TextArea({
  autoSize,
  className,
  ...props
}: Omit<React.ComponentProps<'textarea'>, 'size'> & {
  autoSize?: boolean
}) {
  return (
    <textarea
      className={cn(
        // Base styles
        'shadow-xs bg-background flex min-h-9 w-full resize-none rounded-md px-3 py-2 text-sm ring ring-gray-200 placeholder:text-gray-400',
        // Focus state
        'focus-visible:ring-accent-600 focus-visible:outline-none focus-visible:ring-2',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50',
        autoSize && 'field-sizing-content',
        className
      )}
      {...props}
    />
  )
}
