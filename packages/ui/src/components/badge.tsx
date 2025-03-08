import { Slot } from '@radix-ui/react-slot'
import { cn } from '../util/cn'

export function Badge({
  asChild,
  className,
  color,
  highContrast,
  size = 'md',
  ...props
}: React.ComponentProps<'span'> & {
  asChild?: boolean
  color?: string
  highContrast?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const Comp = asChild ? Slot : 'span'
  return (
    <Comp
      className={cn(
        'bg-accent-100 text-accent-600 rounded-sm font-medium',
        highContrast && 'bg-accent-600 text-accent-contrast',
        {
          sm: 'px-1.5 py-0.5 text-xs',
          md: 'px-2 py-1 text-xs',
          lg: 'px-2.5 py-1 text-sm',
        }[size],
        className
      )}
      data-accent-color={color}
      {...props}
    />
  )
}
