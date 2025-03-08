import { mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'
import { id, timestamps } from '../drizzle/types'

export const userTable = mysqlTable(
  'user',
  {
    ...id,
    ...timestamps,
    email: varchar('email', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
  },
  (table) => ({
    uniqueEmailIdx: uniqueIndex('unique_email_idx').on(table.email),
  })
)
