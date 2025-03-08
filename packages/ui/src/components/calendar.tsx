import React from 'react'
import { DayPicker } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from '../assets/icons/line'
import { cn } from '../util/cn'

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      formatters={{
        formatCaption: (date) => date.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      }}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-between pt-1 relative items-center',
        caption_label: 'text-sm font-semibold px-1.5',
        nav: 'flex items-center ml-1.5',
        nav_button:
          'flex items-center justify-center rounded-md size-7 text-gray-400 bg-transparent p-0 hover:bg-accent',
        nav_button_previous:
          'hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
        nav_button_next:
          'hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-gray-400 rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: 'h-8 w-8 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center cursor-pointer rounded-md hover:bg-gray-100',
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected: '!bg-accent-600 !text-accent-contrast',
        day_today: 'bg-gray-100 rounded-full font-semibold text-gray-900',
        day_outside:
          'day-outside text-gray-400 aria-selected:bg-accent/50 aria-selected:text-gray-400',
        day_disabled: 'text-gray-400 opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="size-5" />,
        IconRight: () => <ChevronRight className="size-5" />,
      }}
      {...props}
    />
  )
}
