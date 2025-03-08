import { AuthLayout } from '@/layouts/auth'
import { useAppForm } from '@briefer/ui/form'
import { OTPInputGroup, OTPInputSlot } from '@briefer/ui/otp-input'
import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/_auth/auth/code/verify')({
  component: CodeComponent,
})

function CodeComponent() {
  const formRef = React.useRef<HTMLFormElement>(null)

  const form = useAppForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onSubmit: z.object({
        code: z.string().length(6),
      }),
    },
    onSubmit: () => {
      formRef.current?.submit()
    },
  })

  return (
    <AuthLayout title="Check your email" description="Didn't get a code? Try again">
      <form
        className="flex flex-col gap-5"
        action={import.meta.env.VITE_AUTH_URL + '/code/authorize'}
        method="post"
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <input type="hidden" name="action" value="verify" />
        <form.AppField name="code">
          {(field) => (
            <field.OTPField autoFocus className="w-full" containerClassName="w-full" maxLength={6}>
              <OTPInputGroup className="w-full">
                <OTPInputSlot className="w-full" index={0} />
                <OTPInputSlot className="w-full" index={1} />
                <OTPInputSlot className="w-full" index={2} />
                <OTPInputSlot className="w-full" index={3} />
                <OTPInputSlot className="w-full" index={4} />
                <OTPInputSlot className="w-full" index={5} />
              </OTPInputGroup>
            </field.OTPField>
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="w-full">Weiter</form.SubmitButton>
        </form.AppForm>
      </form>
    </AuthLayout>
  )
}
