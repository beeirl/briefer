import { Menu as BaseMenu } from '@base-ui-components/react/menu'
import { Check, ChevronRight } from '../assets/icons/line'
import { cn } from '../util/cn'

export const Menu = BaseMenu.Root

export const MenuTrigger = BaseMenu.Trigger

export const MenuGroup = BaseMenu.Group

export const MenuPortal = BaseMenu.Portal

export const MenuRadioGroup = BaseMenu.RadioGroup

export function MenuPositioner({
  className,
  keepMounted,
  ...props
}: BaseMenu.Positioner.Props & {
  keepMounted?: boolean
}) {
  return (
    <BaseMenu.Portal keepMounted={keepMounted}>
      <BaseMenu.Positioner className={cn('z-50 outline-none', className)} {...props} />
    </BaseMenu.Portal>
  )
}

export function MenuPopup({ className, ...props }: BaseMenu.Popup.Props) {
  return (
    <BaseMenu.Popup
      className={cn(
        'bg-popup-background min-w-[8rem] rounded-lg py-1 shadow-sm outline outline-gray-200',
        'origin-(--transform-origin) transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[starting-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
        className
      )}
      {...props}
    />
  )
}

export function MenuItem({
  className,
  inset,
  ...props
}: BaseMenu.Item.Props & {
  inset?: boolean
}) {
  return (
    <BaseMenu.Item
      className={cn(
        'relative flex cursor-default select-none items-center gap-2 px-3.5 py-1.5 text-sm outline-none [&>svg]:size-4 [&>svg]:shrink-0',
        'select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-md data-[highlighted]:before:bg-gray-100',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  )
}

export function MenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: BaseMenu.CheckboxItem.Props) {
  return (
    <BaseMenu.CheckboxItem
      className={cn(
        'grid cursor-default select-none grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pl-2.5 pr-8 text-sm leading-4 outline-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-100',
        className
      )}
      checked={checked}
      {...props}
    >
      <BaseMenu.CheckboxItemIndicator className="col-start-1">
        <Check className="size-4" />
      </BaseMenu.CheckboxItemIndicator>
      <div className="col-start-2">{children}</div>
    </BaseMenu.CheckboxItem>
  )
}

export function MenuRadioItem({ className, children, ...props }: BaseMenu.RadioItem.Props) {
  return (
    <BaseMenu.RadioItem
      className={cn(
        'grid cursor-default select-none grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pl-2.5 pr-8 text-sm leading-4 outline-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-100',
        className
      )}
      {...props}
    >
      <BaseMenu.RadioItemIndicator className="col-start-1">
        <Check className="size-4" />
      </BaseMenu.RadioItemIndicator>
      <div className="col-start-2">{children}</div>
    </BaseMenu.RadioItem>
  )
}

export function MenuGroupLabel({
  className,
  inset,
  ...props
}: BaseMenu.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <BaseMenu.GroupLabel
      className={cn('px-3.5 py-1.5 text-xs font-medium text-gray-500', inset && 'pl-8', className)}
      {...props}
    />
  )
}

export function MenuSeparator({
  className,
  inset,
  ...props
}: BaseMenu.Separator.Props & {
  inset?: boolean
}) {
  return (
    <BaseMenu.Separator
      className={cn('mx-3.5 my-1.5 h-px bg-gray-200', inset && 'ml-7.5', className)}
      {...props}
    />
  )
}

export function SubmenuTrigger({ children, className, ...props }: BaseMenu.SubmenuTrigger.Props) {
  return (
    <BaseMenu.SubmenuTrigger
      className={cn(
        'flex cursor-default select-none items-center justify-between gap-4 py-2 pl-4 pr-2 text-sm leading-4 outline-none data-[highlighted]:relative data-[popup-open]:relative data-[highlighted]:z-0 data-[popup-open]:z-0 data-[highlighted]:before:absolute data-[popup-open]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[popup-open]:before:inset-x-1 data-[popup-open]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[popup-open]:before:z-[-1] data-[highlighted]:before:rounded-md data-[popup-open]:before:rounded-md data-[highlighted]:before:bg-gray-100 data-[highlighted]:data-[popup-open]:before:bg-gray-100 data-[popup-open]:before:bg-gray-100',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="size-4 text-gray-500" />
    </BaseMenu.SubmenuTrigger>
  )
}
