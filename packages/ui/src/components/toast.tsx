import { ExternalToast, Toaster as Sonner, toast as sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

let timeout: NodeJS.Timeout
export function toast(message: string, options?: ExternalToast) {
  let className
  if (options?.id) {
    className = `toast-${options.id}`
    const firstToast = document.querySelector<HTMLElement>('.toast')
    if (firstToast?.classList.contains(className)) {
      firstToast.style.transition = 'transform 0.2s ease'
      firstToast.style.transform = 'scale(1.075)'

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        firstToast.style.transition = 'transform 0.8s ease'
        firstToast.style.transform = 'scale(1)'

        setTimeout(() => {
          firstToast.style.transition = ''
          firstToast.style.transform = ''
        }, 800)
      }, 350)
    }
  }

  sonner(message, {
    ...options,
    className: [options?.className, className].filter(Boolean).join(' '),
  })
}

export const Toaster = (props: ToasterProps) => {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          toast:
            'toast bg-background rounded-lg px-4 py-3 border border-gray-200 shadow-xs w-(--width)',
          title: 'text-sm font-medium',
          description: 'text-gray-500! text-sm',
        },
        duration: 5000,
        unstyled: true,
      }}
      {...props}
    />
  )
}
