import { OnboardingLayout } from '@/layouts/onboarding'
import { trpc } from '@/utils/trpc'
import { useAppForm } from '@briefer/ui/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_onboarding/onboarding')({
  component: Onboarding,
})

function Onboarding() {
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()

  const updateUserMutation = useMutation(trpc.user.update.mutationOptions())

  const form = useAppForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    validators: {
      onSubmit: z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      }),
    },
    onSubmit: async ({ value }) => {
      await updateUserMutation.mutateAsync(value)
      queryClient.removeQueries({ queryKey: trpc.user.getMe.queryKey() })
      navigate({ to: '/', replace: true })
    },
  })

  return (
    <OnboardingLayout title="Create your account">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField name="firstName">
          {(field) => <field.TextInputField autoFocus label="First name" />}
        </form.AppField>
        <form.AppField name="lastName">
          {(field) => <field.TextInputField label="Last name" />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="w-full">Create account</form.SubmitButton>
        </form.AppForm>
      </form>
    </OnboardingLayout>
  )
}
