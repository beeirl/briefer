import { index, json, mysqlEnum, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core'
import { id, timestamps, ulid } from '../drizzle/types'
import { BriefBlock, briefStatuses } from './types'

export const briefTable = mysqlTable(
  'brief',
  {
    ...id,
    ...timestamps,
    blocks: json('blocks').$type<BriefBlock[]>(),
    geminiVideoUri: text('gemini_video_uri'),
    model: mysqlEnum('model', ['gemini-2.0-flash', 'twelvelabs-pegasus']).notNull(),
    prompt: text('prompt').notNull(),
    status: mysqlEnum('status', briefStatuses).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    userID: ulid('user_id').notNull(),
    videoAssetID: ulid('video_asset_id').notNull(),
  },
  (table) => ({
    userIDIdx: index('user_id_idx').on(table.userID),
  })
)
