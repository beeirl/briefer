import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { useUserID } from '../actor'
import { useTransaction } from '../drizzle/transaction'
import { fn } from '../util/fn'
import { createID } from '../util/id'
import { briefTable } from './index.sql'

export namespace Brief {
  export const Info = z.object({
    createdAt: z.string().datetime(),
    id: z.string(),
  })
  export type Info = z.infer<typeof Info>

  export const create = fn(z.object({}), (input) =>
    useTransaction(async (tx) => {
      const id = createID('brief')
      await tx.insert(briefTable).values({
        id,
        userID: useUserID(),
      })
      return id
    })
  )

  export function list() {
    return useTransaction(async (tx) =>
      tx
        .select()
        .from(briefTable)
        .where(eq(briefTable.userID, useUserID()))
        .orderBy(desc(briefTable.createdAt))
        .then((rows) => rows.map(serialize))
    )
  }

  function serialize(input: typeof briefTable.$inferSelect): Info {
    return {
      createdAt: input.createdAt.toISOString(),
      id: input.id,
    }
  }
}
