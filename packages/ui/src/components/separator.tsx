import { Separator as BaseSeparator } from '@base-ui-components/react'
import { cn } from '../util/cn'

export function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof BaseSeparator> & {
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <BaseSeparator
      className={cn(
        'bg-gray-200',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
}
