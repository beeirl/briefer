import { AuthLayout } from '@/layouts/auth'
import { useAppForm } from '@briefer/ui/form'
import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/_auth/auth/code/')({
  component: Code,
})

function Code() {
  const formRef = React.useRef<HTMLFormElement>(null)

  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email(),
      }),
    },
    onSubmit: () => {
      formRef.current?.submit()
    },
  })

  return (
    <AuthLayout
      title="Wie lautet deine E-Mail-Adresse?"
      description="Wir senden dir einen PIN-Code per E-Mail"
    >
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
        <input type="hidden" name="action" value="request" />
        <form.AppField name="email">
          {(field) => <field.TextInputField autoFocus placeholder="E-Mail-Adresse eingeben..." />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="w-full">Anmelden</form.SubmitButton>
        </form.AppForm>
      </form>
    </AuthLayout>
  )
}
