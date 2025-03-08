import { Slot } from '@radix-ui/react-slot'
import { cn } from '../util/cn'

export function Card({
  asChild,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  asChild?: React.ReactNode
}) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      className={cn(
        'bg-background flex gap-2 rounded-lg p-3 text-sm ring ring-gray-200',
        asChild && [
          'hover:ring-gray-300',
          'focus-visible:outline-focus-600 focus-visible:outline-2',
        ],
        className
      )}
      {...props}
    />
  )
}
