import { Avatar as BaseAvatar } from '@base-ui-components/react/avatar'
import { composeRefs } from '@radix-ui/react-compose-refs'
import React from 'react'
import { cn } from '../util/cn'
import {
  Tooltip,
  TooltipPopup,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

export function Avatar({ className, ...props }: React.ComponentProps<typeof BaseAvatar.Root>) {
  return (
    <BaseAvatar.Root
      className={cn('relative flex size-10 shrink-0 overflow-hidden', className)}
      {...props}
    />
  )
}

export function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Image>) {
  return <BaseAvatar.Image className={cn('aspect-square h-full w-full', className)} {...props} />
}

export function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Fallback>) {
  return (
    <BaseAvatar.Fallback
      className={cn(
        'flex h-full w-full items-center justify-center bg-gray-100 font-medium uppercase text-gray-500 [&>svg]:size-6 ',
        className
      )}
      {...props}
    />
  )
}

export function AvatarInput({
  children,
  className,
  defaultValue,
  disabled,
  fallback,
  name,
  placeholder,
  ref,
  onValueChange,
  ...props
}: {
  children?: React.ReactNode
  className?: string
  defaultValue?: string
  disabled?: boolean
  fallback?: React.ReactNode
  name?: string
  placeholder?: string
  ref?: React.Ref<HTMLInputElement>
  value?: string
  onValueChange?: (value: string) => void
}) {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [value, setValue] = React.useState<string | undefined>(defaultValue)

  React.useEffect(() => {
    setValue(props.value ?? defaultValue)
  }, [props.value])

  function handleChange(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const value = e.target?.result as string
      setValue(value)
      onValueChange?.(value)
    }
    reader.readAsDataURL(file)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              ref={buttonRef}
              className={cn(
                'focus-visible:ring-accent-600 relative flex w-fit cursor-pointer items-center justify-center rounded-md p-1.5 ring ring-gray-200 focus-visible:outline-none focus-visible:ring-2',
                'after:absolute after:inset-0 after:rounded-md hover:after:bg-gray-100/50',
                className
              )}
              disabled={disabled}
              type="button"
              onClick={() => {
                if (disabled) return
                inputRef.current?.click()
              }}
              onDragOver={(e: React.DragEvent<HTMLButtonElement>) => {
                e.preventDefault()
                if (!disabled) buttonRef.current?.focus()
              }}
              onDrop={(e: React.DragEvent<HTMLButtonElement>) => {
                e.preventDefault()
                if (!disabled && e.dataTransfer.files.length > 0) {
                  handleChange(e.dataTransfer.files[0])
                }
              }}
            >
              <Avatar className="rounded-sm" color="gray">
                <AvatarImage className="object-cover" src={value} />
                <AvatarFallback className="text-gray-400">{fallback}</AvatarFallback>
              </Avatar>
              <input
                accept="image/*"
                className="hidden"
                disabled={disabled}
                name={name}
                type="file"
                ref={composeRefs(inputRef, ref)}
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  // Prevents that onChange gets triggered when selection gets canceled
                  if (!e.target.files?.length) return
                  handleChange(e.target.files[0])
                }}
              />
            </button>
          }
        />
        <TooltipPositioner side="bottom">
          <TooltipPopup color="gray">{placeholder}</TooltipPopup>
        </TooltipPositioner>
      </Tooltip>
    </TooltipProvider>
  )
}
