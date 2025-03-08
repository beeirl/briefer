import { index, mysqlTable } from 'drizzle-orm/mysql-core'
import { id, timestamps, ulid } from '../drizzle/types'

export const briefTable = mysqlTable(
  'brief',
  {
    ...id,
    ...timestamps,
    userID: ulid('user_id').notNull(),
  },
  (table) => ({
    userIDIdx: index('user_id_idx').on(table.userID),
  })
)
