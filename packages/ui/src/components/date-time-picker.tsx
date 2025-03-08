import { format as formatDate } from 'date-fns'
import React from 'react'
import { cn } from '../util/cn'
import { Calendar } from './calendar'

const DateTimePickerContext = React.createContext<{
  date: Date
  time: string
  update: (date: Date, time: string) => void
} | null>(null)
function useDateTimePicker() {
  const context = React.useContext(DateTimePickerContext)
  if (!context) {
    throw new Error('useDateTimePicker must be used within a DateTimePicker')
  }
  return context
}

export function DateTimePicker({
  children,
  className,
  defaultValue = new Date(),
  onValueChange,
  ...props
}: {
  children?: React.ReactNode
  className?: string
  defaultValue?: Date
  value?: Date
  onValueChange?: (date: Date) => void
}) {
  const [value, setValue] = React.useState<Date>(defaultValue)
  const time = formatDate(value, 'HH:mm')

  React.useEffect(() => {
    setValue(props.value ?? defaultValue)
  }, [props.value])

  function update(date: Date, time: string) {
    const [hours, minutes] = time.split(':')
    const value = new Date(date)
    value.setHours(parseInt(hours), parseInt(minutes))
    setValue(value)
    onValueChange?.(value)
  }

  return (
    <DateTimePickerContext.Provider value={{ date: value, time, update }}>
      <div className={cn('flex flex-col', className)}>{children}</div>
    </DateTimePickerContext.Provider>
  )
}

export function DateTimePickerInput() {
  const { date, time, update } = useDateTimePicker()
  return (
    <div className="flex items-center overflow-hidden rounded-md border border-gray-200 px-2 py-1">
      <div className="flex flex-1">
        <input
          className="w-full text-sm focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden"
          type="date"
          value={date.toISOString().split('T')[0]}
          onChange={(e) => update(new Date(e.target.value), time)}
          onKeyDown={(e) => {
            e.stopPropagation()
          }}
        />
      </div>
      <div className="ml-1.5 mr-3 h-3.5 w-px bg-gray-200" />
      <div className="flex flex-1">
        <input
          className="w-full text-sm focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden"
          type="time"
          value={time}
          onChange={(e) => update(date, e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation()
          }}
        />
      </div>
    </div>
  )
}

export function DateTimePickerCalendar(
  props?: Omit<React.ComponentProps<typeof Calendar>, 'mode' | 'selected' | 'onSelect'>
) {
  const { date, time, update } = useDateTimePicker()
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(value) => {
        if (!value) return
        update(value, time)
      }}
      {...props}
    />
  )
}
