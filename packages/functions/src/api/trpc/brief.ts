import { Brief } from '@briefer/core/brief/index'
import { trpc } from './trpc'

export const BriefRouter = trpc.router({
  create: trpc.procedure
    .input(Brief.create.schema)
    .mutation(async ({ input }) => Brief.create(input)),
  fromID: trpc.procedure.input(Brief.fromID.schema).query(async ({ input }) => Brief.fromID(input)),
  list: trpc.procedure.query(() => Brief.list()),
  update: trpc.procedure
    .input(Brief.update.schema)
    .mutation(async ({ input }) => Brief.update(input)),
})
