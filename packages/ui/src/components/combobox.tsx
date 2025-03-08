import { Check } from 'lucide-react'
import * as React from 'react'
import { cn } from '../util/cn'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command'
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from './popover'

type ComboboxContextType = {
  value: string[]
  setValue: (value: string) => void
}

const ComboboxContext = React.createContext<ComboboxContextType | null>(null)

const useComboboxContext = () => {
  const context = React.useContext(ComboboxContext)
  if (!context) {
    throw new Error('Combobox must be used within a ComboboxProvider')
  }
  return context
}

export const Combobox = ({
  children,
  defaultValue = [],
  value: valueProp = [],
  onChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof Popover> & {
  defaultValue?: string[]
  value?: string[]
  onChange?: (value: string[]) => void
}) => {
  const [_value, _setValue] = React.useState<string[]>(defaultValue)
  const value = valueProp ?? _value
  const setValue = React.useCallback(
    (value: string) => {
      if (_value.includes(value)) {
        _value.splice(_value.indexOf(value), 1)
        const newValue = _value.filter((_value) => _value !== value)
        _setValue(newValue)
        onChange?.(newValue)
      } else {
        const newValue = [..._value, value]
        _setValue(newValue)
        onChange?.(newValue)
      }
    },
    [_value, onChange]
  )

  return (
    <Popover {...props}>
      <ComboboxContext.Provider value={{ value, setValue }}>{children}</ComboboxContext.Provider>
    </Popover>
  )
}

export const ComboboxTrigger = PopoverTrigger

export const ComboboxAnchor = PopoverAnchor

export const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ children, className, ...props }, ref) => {
  return (
    <PopoverContent ref={ref} className={cn('p-0', className)} {...props}>
      <Command>{children}</Command>
    </PopoverContent>
  )
})

export const ComboboxSearch = React.forwardRef<
  React.ElementRef<typeof CommandInput>,
  React.ComponentPropsWithoutRef<typeof CommandInput>
>(({ children, ...props }, ref) => {
  return <CommandInput ref={ref} {...props} />
})

export const ComboboxList = CommandList

export const ComboboxGroup = CommandGroup

export const ComboboxEmpty = CommandEmpty

export const ComboboxItem = React.forwardRef<
  React.ElementRef<typeof CommandItem>,
  React.ComponentPropsWithoutRef<typeof CommandItem> & {
    value: string
  }
>(({ children, ...props }, ref) => {
  const { value, setValue } = useComboboxContext()

  return (
    <CommandItem ref={ref} onSelect={() => setValue(props.value)} {...props}>
      <Check className={cn('h-4 w-4', value.includes(props.value) ? 'opacity-100' : 'opacity-0')} />
      {children}
    </CommandItem>
  )
})
