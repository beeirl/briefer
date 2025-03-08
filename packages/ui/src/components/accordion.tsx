import { Accordion as BaseAccordion } from '@base-ui-components/react/accordion'
import * as React from 'react'
import { ChevronDown } from '../assets/icons/line'
import { cn } from '../util/cn'

export function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Root>) {
  return (
    <BaseAccordion.Root
      className={cn('flex flex-col gap-2', className)}
      openMultiple={false}
      {...props}
    />
  )
}

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Item>) {
  return (
    <BaseAccordion.Item className={cn('rounded-xl border border-gray-200', className)} {...props} />
  )
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Header className="flex">
      <BaseAccordion.Trigger
        className={cn(
          'flex flex-1 items-center justify-between rounded-xl p-4 text-left text-sm font-medium text-gray-600 transition-transform [&[data-panel-open]>svg]:rotate-180',
          'focus-visible:ring-focus-600 focus-visible:outline-none focus-visible:ring-2',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200" />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  )
}

export function AccordionPanel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Panel>) {
  return (
    <BaseAccordion.Panel className="overflow-hidden" {...props}>
      <div className={cn('p-4 pt-0 text-sm', className)}>{children}</div>
    </BaseAccordion.Panel>
  )
}
