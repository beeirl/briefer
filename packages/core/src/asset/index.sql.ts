import { bigint, mysqlTable, varchar } from 'drizzle-orm/mysql-core'
import { id, timestamps, ulid } from '../drizzle/types'

export const assetTable = mysqlTable('asset', {
  ...id,
  ...timestamps,
  contentType: varchar('content_type', { length: 255 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  size: bigint('size', { mode: 'number' }).notNull(),
  userID: ulid('user_id').notNull(),
})
