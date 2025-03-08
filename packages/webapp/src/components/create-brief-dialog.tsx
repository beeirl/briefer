import * as DuotoneIcon from '@/assets/icons/duotone'
import { trpc } from '@/utils/trpc'
import {
  Dialog,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  useDialog,
} from '@briefer/ui/dialog'
import { FieldLabel } from '@briefer/ui/field'
import { useAppForm } from '@briefer/ui/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'

export const CreateBriefDialog = Dialog

export const CreateBriefDialogTrigger = DialogTrigger

export function CreateBriefDialogPopup() {
  const queryClient = useQueryClient()
  const { setOpen } = useDialog()

  const videoInputRef = React.useRef<HTMLInputElement>(null)
  const [videoUrl, setVideoUrl] = React.useState<string>()

  const createBriefMutation = useMutation(trpc.brief.create.mutationOptions())

  const [videoUploadProgress, setVideoUploadProgress] = React.useState(0)

  const form = useAppForm({
    defaultValues: {
      blockTypes: '',
      video: undefined as File | undefined,
    },
    onSubmit: async ({ value, formApi }) => {
      const brief = await createBriefMutation.mutateAsync()
      queryClient.invalidateQueries({ queryKey: trpc.brief.list.queryKey() })

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100)
            setVideoUploadProgress(percentComplete)
          }
        })
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        }
        xhr.onerror = () => reject(new Error('Upload failed'))
        xhr.open('PUT', brief.uploadUrl, true)
        xhr.setRequestHeader('Content-Type', value.video?.type ?? 'video/mp4')
        xhr.send(value.video)
      })

      setOpen(false)
      formApi.reset()
      setVideoUrl(undefined)
    },
  })

  return (
    <DialogPopup className="max-w-md">
      <DialogHeader>
        <DialogTitle>Create brief</DialogTitle>
      </DialogHeader>
      <form
        className="mt-3 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field name="video">
          {(field) => (
            <div className="flex flex-col gap-1">
              <FieldLabel>Video</FieldLabel>
              <div className="shadow-xs flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-md border border-gray-200">
                <input
                  accept="video/*"
                  hidden
                  ref={videoInputRef}
                  type="file"
                  onChange={(e) => {
                    const video = e.target.files?.[0]
                    field.handleChange(video)
                    if (videoUrl) URL.revokeObjectURL(videoUrl)
                    setVideoUrl(video ? URL.createObjectURL(video) : undefined)
                  }}
                />
                {videoUrl ? (
                  <video
                    className="h-full w-full rounded-md object-contain"
                    controls
                    src={videoUrl}
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center hover:bg-gray-50"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <DuotoneIcon.VideoPlus className="size-10 text-gray-400" />
                      <div className="flex max-w-[280px] flex-col gap-1 text-center text-sm">
                        <span className="font-medium">Upload video</span>
                        <span className="text-balance text-gray-500">
                          Upload the video you want to create a brief from.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </form.Field>
        <form.AppField name="blockTypes">
          {(field) => (
            <field.TextAreaField
              label="Blocks"
              placeholder="e.g. hook, problem, solution, benefit, offer, call to action"
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton color="gray" highContrast size="lg">
            Create brief
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </DialogPopup>
  )
}
