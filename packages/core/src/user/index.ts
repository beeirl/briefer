import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { useUserID } from '../actor'
import { createTransaction, useTransaction } from '../drizzle/transaction'
import { fn } from '../util/fn'
import { createID } from '../util/id'
import { userTable } from './index.sql'

export namespace User {
  export const Info = z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    name: z.string().optional(),
  })
  export type Info = z.infer<typeof Info>

  export const create = fn(
    Info.pick({
      email: true,
      firstName: true,
      lastName: true,
    }),
    async (input) => {
      const id = createID('user')
      await createTransaction((tx) =>
        tx.insert(userTable).values({
          id,
          email: input.email,
          firstName: input.firstName ?? '',
          lastName: input.lastName ?? '',
        })
      )
      return id
    }
  )

  export const fromEmail = fn(z.string(), (email) =>
    useTransaction((tx) =>
      tx
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .then((rows) => rows.map(serialize).at(0))
    )
  )

  export const fromID = fn(z.string(), (id) =>
    useTransaction((tx) =>
      tx
        .select()
        .from(userTable)
        .where(eq(userTable.id, id))
        .then((rows) => rows.map(serialize).at(0))
    )
  )

  export const remove = fn(z.string(), (id) =>
    useTransaction((tx) =>
      tx
        .update(userTable)
        .set({
          archivedAt: new Date(),
        })
        .where(eq(userTable.id, id))
    )
  )

  export const update = fn(Info.pick({ firstName: true, lastName: true }), (input) =>
    useTransaction((tx) =>
      tx
        .update(userTable)
        .set({
          firstName: input.firstName,
          lastName: input.lastName,
        })
        .where(eq(userTable.id, useUserID()))
    )
  )

  function serialize(input: typeof userTable.$inferSelect): Info {
    return {
      id: input.id,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      name: `${input.firstName} ${input.lastName}`.trim(),
    }
  }
}
