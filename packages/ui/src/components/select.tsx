import { Select as BaseSelect } from '@base-ui-components/react/select'
import * as React from 'react'
import { Check, ChevronUpDown } from '../assets/icons/line'
import { cn } from '../util/cn'

export const Select = BaseSelect.Root

export const SelectGroup = BaseSelect.Group

export const SelectTrigger = BaseSelect.Trigger

export const SelectValue = BaseSelect.Value

export function SelectInput({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'focus:ring-accent-600 shadow-xs bg-background flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md py-2 pl-3.5 pr-3 text-sm ring ring-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon
        className="flex"
        render={<ChevronUpDown className="size-3 text-gray-400" />}
      />
    </div>
  )
}

export function SelectPositioner({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Positioner>) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner className={cn('outline-none', className)} {...props} />
    </BaseSelect.Portal>
  )
}

export function SelectPopup({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup>) {
  return (
    <BaseSelect.Popup
      className={cn(
        'group origin-[var(--transform-origin)] rounded-md bg-[canvas] py-1 text-gray-900 shadow-sm outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-100 data-[side=none]:data-[starting-style]:scale-100 data-[starting-style]:scale-90 data-[ending-style]:opacity-100 data-[side=none]:data-[starting-style]:opacity-100 data-[starting-style]:opacity-0 data-[startingx-style]:opacity-0 data-[ending-style]:transition-none data-[side=none]:data-[starting-style]:transition-none',
        className
      )}
      {...props}
    />
  )
}

export function SelectItem({
  className,
  children,
  indicator,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item> & {
  indicator?: boolean
}) {
  return (
    <BaseSelect.Item
      className={cn(
        'grid min-w-[var(--anchor-width)] cursor-default select-none grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pl-2.5 pr-4 text-sm leading-4 outline-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-md data-[highlighted]:before:bg-gray-100 group-data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4',
        className
      )}
      {...props}
    >
      <BaseSelect.ItemIndicator className="col-start-1">
        <Check className="size-4" />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className="col-start-2 flex items-center gap-2 text-sm">
        {children}
      </BaseSelect.ItemText>
    </BaseSelect.Item>
  )
}

export function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Separator>) {
  return (
    <BaseSelect.Separator className={cn('-mx-1 my-1 h-px bg-gray-100', className)} {...props} />
  )
}
