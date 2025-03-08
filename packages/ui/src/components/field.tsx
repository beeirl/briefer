import { cn } from '../util/cn'

export function FieldLabel({ className, ...props }: React.ComponentProps<'label'>) {
  return <label className={cn('text-sm font-medium text-gray-900', className)} {...props} />
}

export function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-sm text-gray-500', className)} {...props} />
}

export function FieldError({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-sm text-red-600', className)} {...props} />
}
