import * as LineIcon from '@/assets/icons/line'
import { trpc } from '@/utils/trpc'
import {
  Dialog,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  useDialog,
} from '@briefer/ui/dialog'
import { FieldError, FieldLabel } from '@briefer/ui/field'
import { useAppForm } from '@briefer/ui/form'
import { toast } from '@briefer/ui/toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { z } from 'zod'

export const CreateBriefDialog = Dialog

export const CreateBriefDialogTrigger = DialogTrigger

const CreateBriefFormValues = z.object({
  prompt: z.string().min(1, 'Please enter a prompt'),
  title: z.string().min(1, 'Please enter a title'),
  videoAssetID: z.string(),
  videoFile: z
    .instanceof(File)
    .optional()
    .transform((val, ctx) => {
      if (val === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          fatal: true,
          message: 'Please upload a video',
        })
        return z.NEVER
      }
      return val
    }),
})

export function CreateBriefDialogPopup() {
  const queryClient = useQueryClient()
  const { setOpen } = useDialog()

  const videoFileInputRef = React.useRef<HTMLInputElement>(null)

  const createBriefMutation = useMutation(trpc.brief.create.mutationOptions())
  const uploadAssetMutation = useMutation(trpc.asset.upload.mutationOptions())

  const [videoPreviewUrl, setVideoPreviewUrl] = React.useState<string>()
  const [videoUploading, setVideoUploading] = React.useState(false)
  const [videoUploadProgress, setVideoUploadProgress] = React.useState(0)

  const form = useAppForm({
    defaultValues: {
      prompt:
        'Break up the footage into these components: problem hook, solution, benefit, social proof, offer. Also add the respective timestamps.',
      title: 'My new brief',
      videoAssetID: '',
      videoFile: undefined,
    } as z.input<typeof CreateBriefFormValues>,
    validators: {
      onSubmit: CreateBriefFormValues,
    },
    onSubmit: async ({ value, formApi }) => {
      if (videoUploading) {
        toast('Upload in progress', {
          description: 'Please wait for the upload to finish before submitting your brief',
        })
        return
      }
      await createBriefMutation.mutateAsync({
        prompt: value.prompt,
        title: value.title,
        videoAssetID: value.videoAssetID,
      })
      queryClient.invalidateQueries({ queryKey: trpc.brief.list.queryKey() })
      setOpen(false)
      formApi.reset()
      setVideoUploadProgress(0)
      setVideoPreviewUrl(undefined)
      toast('Brief created')
    },
  })

  async function uploadVideo(file: File) {
    setVideoUploading(true)
    const asset = await uploadAssetMutation.mutateAsync({
      contentType: file.type,
      fileName: file.name,
      size: file.size,
    })
    form.setFieldValue('videoAssetID', asset.id)
    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100)
        setVideoUploadProgress(percentComplete)
      }
    })
    xhr.onload = () => {
      setVideoUploading(false)
      // if (xhr.status >= 200 && xhr.status < 300) {
      //   resolve()
      // } else {
      //   reject(new Error(`Upload failed with status ${xhr.status}`))
      // }
    }
    // xhr.onerror = () => reject(new Error('Upload failed'))
    xhr.open('PUT', asset.uploadUrl, true)
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.send(file)
  }

  return (
    <DialogPopup className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Create new brief</DialogTitle>
      </DialogHeader>
      <form
        className="mt-3 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field name="videoAssetID">
          {(field) => (
            <input
              hidden
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <form.AppField name="title">
          {(field) => <field.TextInputField autoFocus label="Title" />}
        </form.AppField>
        <form.Field name="videoFile">
          {(field) => (
            <div className="flex flex-col gap-1">
              <FieldLabel>Video</FieldLabel>
              <div className="shadow-xs flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-md border border-gray-200">
                <input
                  accept="video/*"
                  hidden
                  ref={videoFileInputRef}
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl)
                    if (file) {
                      uploadVideo(file)
                      setVideoPreviewUrl(URL.createObjectURL(file))
                    } else {
                      setVideoPreviewUrl(undefined)
                    }
                    field.handleChange(file)
                  }}
                />
                {videoPreviewUrl ? (
                  <div className="relative size-full overflow-hidden rounded-md">
                    {videoUploading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/75">
                        <svg className="size-7 -rotate-90" viewBox="0 0 36 36">
                          <circle
                            className="stroke-black/20"
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            strokeWidth="5"
                          />
                          <circle
                            className="stroke-gray-600"
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            strokeWidth="5"
                            strokeDasharray={`${videoUploadProgress} 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    )}
                    <video
                      className="size-full object-contain"
                      controls={!videoUploading}
                      src={videoPreviewUrl}
                    />
                  </div>
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center hover:bg-gray-50"
                    onClick={() => videoFileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <LineIcon.Upload className="size-7 text-gray-400" />
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
              {field.state.meta.errors.length > 0 && (
                <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
              )}
            </div>
          )}
        </form.Field>
        <form.AppField name="prompt">
          {(field) => <field.TextAreaField autoSize label="Prompt" />}
        </form.AppField>
        <form.AppForm>
          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <form.SubmitButton className="mt-2" disabled={!canSubmit} size="lg">
                Create brief
              </form.SubmitButton>
            )}
          </form.Subscribe>
        </form.AppForm>
      </form>
    </DialogPopup>
  )
}
