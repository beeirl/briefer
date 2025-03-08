import * as FilledIcon from '@/assets/icons/filled'
import React from 'react'

export function AuthLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title: string
  description?: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="bg-background shadow-xs mx-auto flex w-full max-w-sm flex-col gap-5 rounded-xl border border-gray-200 p-7">
        <div className="bg-accent-100 w-fit rounded-lg p-2">
          <FilledIcon.Bolt className="size-5.5 text-accent-600" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">{title}</span>
          {description && <span className="text-sm font-medium text-gray-500">{description}</span>}
        </div>
        {children}
      </div>
    </div>
  )
}
