import { useUserID } from '@briefer/core/actor'
import { User } from '@briefer/core/user/index'
import { trpc } from './trpc'

export const UserRouter = trpc.router({
  getMe: trpc.procedure.query(() => User.fromID(useUserID())),
  update: trpc.procedure
    .input(User.update.schema)
    .mutation(async ({ input }) => User.update(input)),
})
