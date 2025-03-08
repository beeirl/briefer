import * as LineIcon from '@/assets/icons/line'

export function Loader() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <LineIcon.Spinner className="size-4 animate-spin text-gray-400" />
    </div>
  )
}
