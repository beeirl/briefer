import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import React from 'react'
import { cn } from '../util/cn'

export const DialogClose = BaseDialog.Close

export const DialogTrigger = BaseDialog.Trigger

const DialogContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)
export function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  return context
}

export function Dialog(props: BaseDialog.Root.Props) {
  const [open, setOpen] = React.useState(props.open ?? false)

  React.useEffect(() => {
    setOpen(props.open ?? false)
  }, [props.open])

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      <BaseDialog.Root
        {...props}
        open={open}
        onOpenChange={(open, event, reason) => {
          if (!('open' in props)) setOpen(open)
          props.onOpenChange?.(open, event, reason)
        }}
      />
    </DialogContext.Provider>
  )
}

export function DialogPopup({ children, className, ...props }: BaseDialog.Popup.Props) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <BaseDialog.Popup
        className="group fixed inset-0 z-50 h-dvh scale-[calc(1-0.1*var(--nested-dialogs))] outline-none transition-all duration-150 data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
        {...props}
      >
        <div className="no-scrollbar absolute inset-0 h-dvh overflow-y-auto">
          <div className="relative flex min-h-dvh flex-col">
            <BaseDialog.Close className="absolute inset-0" render={<div />} tabIndex={-1} />
            <div className="m-auto w-full">
              <div
                className={cn(
                  'bg-background relative mx-auto my-[3rem] w-[calc(100%-4rem)] max-w-sm gap-4 overflow-hidden rounded-xl border border-gray-300 p-6 text-gray-900 shadow-xl',
                  className
                )}
              >
                {children}
                <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-150 group-data-[has-nested-dialogs]:opacity-100" />
              </div>
            </div>
          </div>
        </div>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}

export function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('-mt-1 flex flex-col gap-1', className)} {...props} />
}

export function DialogFooter(props: React.ComponentProps<'div'>) {
  return <div {...props} />
}

export function DialogTitle({ className, ...props }: BaseDialog.Title.Props) {
  return <BaseDialog.Title className={cn('text-lg font-semibold', className)} {...props} />
}

export function DialogDescription({ className, ...props }: BaseDialog.Description.Props) {
  return <BaseDialog.Description className={cn('text-sm text-gray-500', className)} {...props} />
}
