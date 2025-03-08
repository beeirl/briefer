import React from 'react'
import { cn } from '../util/cn'

export function TextInput({ className, ...props }: Omit<React.ComponentProps<'input'>, 'size'>) {
  return (
    <input
      className={cn(
        // Base styles
        'shadow-xs bg-background flex h-9 w-full rounded-md px-3 py-1 text-sm ring ring-gray-200 file:bg-transparent file:text-sm file:font-medium file:text-gray-950 placeholder:text-gray-400',
        // Focus state
        'focus-visible:ring-accent-600 focus-visible:outline-none focus-visible:ring-2',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Hide clock icon
        '[&::-webkit-calendar-picker-indicator]:hidden',
        className
      )}
      {...props}
    />
  )
}
