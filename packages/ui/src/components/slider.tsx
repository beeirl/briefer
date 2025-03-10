import { Slider as BaseSlider } from '@base-ui-components/react/slider'
import { cn } from '../util/cn'

export const Slider = BaseSlider.Root

export function SliderControl({ className, ...props }: BaseSlider.Control.Props) {
  return (
    <BaseSlider.Control
      className={cn('flex w-32 touch-none select-none items-center px-2 py-3', className)}
      {...props}
    />
  )
}

export function SliderTrack({ className, ...props }: BaseSlider.Track.Props) {
  return (
    <BaseSlider.Track
      className={cn('h-[0.1875rem] w-full select-none rounded bg-gray-200', className)}
      {...props}
    />
  )
}

export function SliderIndicator({ className, ...props }: BaseSlider.Indicator.Props) {
  return (
    <BaseSlider.Indicator
      className={cn('bg-accent-600 select-none rounded', className)}
      {...props}
    />
  )
}

export function SliderThumb({ className, ...props }: BaseSlider.Thumb.Props) {
  return (
    <BaseSlider.Thumb
      className={cn('size-3 cursor-pointer select-none rounded-full bg-white', className)}
      {...props}
    />
  )
}
