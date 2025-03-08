import { Brief } from '@briefer/core/brief/index'
import { PublicStorage } from '@briefer/core/storage/public'
import { trpc } from './trpc'

export const BriefRouter = trpc.router({
  create: trpc.procedure.mutation(async () => {
    const id = await Brief.create({})
    const uploadUrl = await PublicStorage.getUploadUrl({
      key: `briefs/${id}/raw.mp4`,
      contentType: 'video/mp4',
    })
    return {
      id,
      uploadUrl,
    }
  }),
  list: trpc.procedure.query(() => Brief.list()),
})
