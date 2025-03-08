import { Tooltip as BaseTooltip } from '@base-ui-components/react'
import * as React from 'react'
import { cn } from '../util/cn'

export const TooltipProvider = BaseTooltip.Provider

export const Tooltip = BaseTooltip.Root

export const TooltipTrigger = BaseTooltip.Trigger

export function TooltipPositioner({
  ...props
}: React.ComponentProps<typeof BaseTooltip.Positioner>) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner {...props} />
    </BaseTooltip.Portal>
  )
}

export function TooltipPopup({
  className,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Popup>) {
  return (
    <BaseTooltip.Popup
      className={cn(
        'bg-background flex origin-[var(--transform-origin)] flex-col rounded-md px-2 py-1 text-sm outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[starting-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[instant]:duration-0',
        className
      )}
      {...props}
    />
  )
}
