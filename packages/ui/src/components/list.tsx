import React from 'react'
import { cn } from '../util/cn'

export function List({
  className,
  variant,
  ...props
}: React.ComponentPropsWithoutRef<'ul'> & {
  variant?: 'outline'
}) {
  return (
    <ul
      className={cn(
        'flex flex-col',
        !variant && 'divide-y divide-zinc-200 dark:divide-zinc-800 [&>li]:py-2',
        variant === 'outline' &&
          'gap-3 [&>li]:rounded-lg [&>li]:border [&>li]:p-3 [&>li]:dark:border-zinc-800',
        className
      )}
      {...props}
    />
  )
}

export function ListItem({ className, onClick, ...props }: React.ComponentPropsWithoutRef<'li'>) {
  return (
    <li
      className={cn(
        // Base
        'grid grid-cols-[1fr_auto] items-center [&:has([data-slot=avatar]:first-child,[data-slot=icon]:first-child)]:grid-cols-[auto_1fr_auto]',
        // Avatar
        'data-[slot=avatar]:*:row-span-full data-[slot=avatar]:*:mr-3 data-[slot=avatar]:*:size-8 data-[slot=avatar]:*:shrink-0 sm:data-[slot=avatar]:*:size-7',
        // Icon
        '[&>svg]:row-span-full [&>svg]:size-8 [&>svg]:shrink-0 sm:[&>svg]:size-7',
        // Button
        '[&>button]:row-span-full [&>button]:shrink-0',
        // Leading icon
        '[&>svg:first-child]:mr-3',
        // Trailing icon
        '[&>svg:last-child]:ml-3',
        // Description
        '[&:has([data-slot="description"])]:grid-rows-[auto_auto]',
        // Clickable
        onClick && 'hover:bg-muted/50 cursor-pointer',
        // Rest
        className
      )}
      onClick={onClick}
      {...props}
    />
  )
}

export function ListItemTitle({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={cn('row-start-1 text-sm font-medium', className)}
      data-slot="title"
    />
  )
}

export function ListItemDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={cn('text-muted-foreground row-start-2 text-xs', className)}
      data-slot="description"
    />
  )
}
