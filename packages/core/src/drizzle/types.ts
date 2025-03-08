import { sql } from 'drizzle-orm'
import { timestamp as baseTimestamp, varchar } from 'drizzle-orm/mysql-core'

export const ulid = (name: string) => varchar(name, { length: 26 + 4 })

export const id = {
  get id() {
    return ulid('id').primaryKey()
  },
}

export const timestamp = (name: string) =>
  baseTimestamp(name, {
    fsp: 3,
  })

export const timestamps = {
  archivedAt: timestamp('archived_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
}
