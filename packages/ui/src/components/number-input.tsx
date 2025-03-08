import React from 'react'
import { cn } from '../util/cn'

export function NumberInput({
  className,
  integer,
  onInput,
  onKeyDown,
  ...props
}: Omit<React.ComponentProps<'input'>, 'size' | 'type'> & {
  integer?: boolean
}) {
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    let valueString = e.target.value
    let valueNumber = Number(valueString)

    if (integer) {
      const regex = /[.,]/g
      if (regex.test(valueString)) {
        valueString = valueString.replace(regex, '')
        valueNumber = Number(valueString)
      }
    }

    if (valueString) {
      if (props.maxLength) {
        const maxLength = Number.parseInt(String(props.maxLength))
        if (valueString.length > maxLength) {
          valueString = e.target.value.slice(0, maxLength)
          valueNumber = Number(valueString)
          return
        }
      }

      if ('min' in props) {
        const minString = String(props.min)
        const minNumber = Number(minString)
        if (minNumber >= 0) {
          valueString = valueString.replace(/[-+]/g, '')
          valueNumber = Number(valueString)
        }
        if (valueNumber < minNumber) {
          valueString = minString
          valueNumber = minNumber
        } else if (minNumber >= 0 && valueNumber < 0) {
          valueNumber = Math.abs(minNumber)
          valueString = String(valueNumber)
        }
      }

      if ('max' in props) {
        const maxString = String(props.max)
        const maxNumber = Number(maxString)
        if (valueNumber > maxNumber) {
          valueString = maxString
          valueNumber = maxNumber
        }
      }

      // Resolve exponent i.e. 1e7
      e.target.value = String(valueNumber)
    }

    onInput?.(e)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (integer) {
      if (/[.,]/g.test(e.key)) {
        e.preventDefault()
      }
    }

    if ('min' in props) {
      if (Number(props.min) >= 0) {
        if (/[-+]/g.test(e.key)) {
          e.preventDefault()
        }
      }
    }

    onKeyDown?.(e)
  }

  return (
    <input
      className={cn(
        // Base styles
        'shadow-xs bg-background flex h-9 w-full rounded-md px-3 py-1 text-sm ring ring-gray-200 placeholder:text-gray-400',
        // Focus state
        'focus-visible:ring-accent-600 focus-visible:outline-none focus-visible:ring-2',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Hide arrows
        '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
        className
      )}
      type="number"
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}
