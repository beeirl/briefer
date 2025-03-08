import { Checkbox as BaseCheckbox } from '@base-ui-components/react'
import { Check } from '../assets/icons/line'
import { cn } from '../util/cn'

export function Checkbox({ className, ...props }: React.ComponentProps<typeof BaseCheckbox.Root>) {
  return (
    <BaseCheckbox.Root
      defaultChecked
      className={cn(
        'data-[checked]:bg-accent-600 data-[checked]:border-accent-600 shadow-xs data-[unchecked]:bg-background flex size-5 items-center justify-center rounded-md data-[unchecked]:border data-[unchecked]:border-gray-200',
        'focus-visible:ring-accent-600 data-[unchecked]:focus-visible:border-accent-600 focus-visible:outline-none data-[checked]:focus-visible:ring-2 data-[unchecked]:focus-visible:ring data-[checked]:focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="text-accent-contrast flex data-[unchecked]:hidden">
        <Check className="size-3" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
}
