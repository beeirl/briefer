import { Switch as BaseSwitch } from '@base-ui-components/react/switch'
import { cn } from '../util/cn'

export function Switch({
  className,
  size = 'lg',
  ...props
}: BaseSwitch.Root.Props & {
  size?: 'sm' | 'lg'
}) {
  return (
    <BaseSwitch.Root
      className={cn(
        'focus-visible:ring-ring focus-visible:ring-offset-background data-[checked]:bg-accent-500 w-7.5 border-3 peer inline-flex h-5 shrink-0 cursor-pointer items-center rounded-full border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[unchecked]:bg-gray-200',
        className
      )}
      {...props}
    >
      <BaseSwitch.Thumb className="pointer-events-none block size-3.5 rounded-full bg-white ring-0 transition-transform data-[checked]:translate-x-2.5 data-[unchecked]:translate-x-0" />
    </BaseSwitch.Root>
  )
}
