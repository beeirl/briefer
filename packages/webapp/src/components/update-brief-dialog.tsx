import { trpc } from '@/utils/trpc'
import type { Brief } from '@briefer/core/brief/index'
import {
  Dialog,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  useDialog,
} from '@briefer/ui/dialog'
import { useAppForm } from '@briefer/ui/form'
import { toast } from '@briefer/ui/toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { z } from 'zod'

const UpdateBriefDialogContext = React.createContext<{
  brief: Brief.Info
} | null>(null)
function useUpdateBriefDialog() {
  const context = React.useContext(UpdateBriefDialogContext)
  if (!context) throw new Error('useUpdateBriefDialog must be used within a UpdateBriefDialog')
  return context
}

export function UpdateBriefDialog({
  brief,
  ...props
}: React.ComponentProps<typeof Dialog> & { brief: Brief.Info }) {
  return (
    <UpdateBriefDialogContext.Provider value={{ brief }}>
      <Dialog {...props} />
    </UpdateBriefDialogContext.Provider>
  )
}

export const UpdateBriefDialogTrigger = DialogTrigger

export function UpdateBriefDialogPopup() {
  const { setOpen } = useDialog()
  const { brief } = useUpdateBriefDialog()
  const queryClient = useQueryClient()

  const updateBriefMutation = useMutation(trpc.brief.update.mutationOptions())

  const form = useAppForm({
    defaultValues: {
      prompt: brief.prompt,
    },
    validators: {
      onSubmit: z.object({
        prompt: z.string().min(1, 'Please enter a prompt'),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      await updateBriefMutation.mutateAsync({
        id: brief.id,
        prompt: value.prompt,
      })
      queryClient.invalidateQueries({ queryKey: trpc.brief.fromID.queryKey(brief.id) })
      toast('Brief updated', {
        description: 'Blocks will be regenerated',
      })
      setOpen(false)
      formApi.reset()
    },
  })

  return (
    <DialogPopup className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Update brief</DialogTitle>
      </DialogHeader>
      <form
        className="mt-3 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField name="prompt">
          {(field) => <field.TextAreaField autoFocus autoSize label="Prompt" />}
        </form.AppField>
        <form.AppForm>
          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <form.SubmitButton className="mt-2" disabled={!canSubmit} size="lg">
                Update brief
              </form.SubmitButton>
            )}
          </form.Subscribe>
        </form.AppForm>
      </form>
    </DialogPopup>
  )
}
