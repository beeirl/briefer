import { Asset } from '@briefer/core/asset/index'
import { trpc } from './trpc'

export const AssetRouter = trpc.router({
  upload: trpc.procedure.input(Asset.upload.schema).mutation(({ input }) => Asset.upload(input)),
})
