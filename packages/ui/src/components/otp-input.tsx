import { OTPInput as InputOTP, OTPInputContext as InputOTPContext } from 'input-otp'
import * as React from 'react'
import { cn } from '../util/cn'

export function OTPInput({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof InputOTP> & {
  children?: React.ReactNode
}) {
  return (
    <InputOTP
      containerClassName={cn(
        'flex items-center gap-2 has-[:disabled]:opacity-50',
        containerClassName
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  )
}

export function OTPInputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex items-center', className)} {...props} />
}

export function OTPInputSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number
}) {
  const inputOTPContext = React.useContext(InputOTPContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]
  return (
    <div
      className={cn(
        'shadow-xs relative -ml-px flex h-9 w-9 items-center justify-center border-y border-l border-r border-gray-200 border-l-transparent text-sm transition-all first:rounded-l-md first:border-l-gray-200 last:rounded-r-md',
        isActive &&
          'ring-accent-600 border-accent-600 border-l-accent-600 first:border-l-accent-600 z-10 ring',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret h-4 w-px bg-gray-950 duration-1000 dark:bg-white" />
        </div>
      )}
    </div>
  )
}

export function OTPInputSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('h-px w-full rounded-full bg-gray-300', className)}
      role="separator"
      {...props}
    />
  )
}
