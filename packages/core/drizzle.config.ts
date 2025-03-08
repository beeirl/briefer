import { defineConfig } from 'drizzle-kit'
import { Resource } from 'sst'

export default defineConfig({
  dbCredentials: {
    url: `mysql://${Resource.Database.username}:${Resource.Database.password}@${Resource.Database.host}/${Resource.Database.database}`,
  },
  dialect: 'mysql',
  out: './migrations/',
  schema: './src/**/*.sql.ts',
  strict: true,
  verbose: true,
})
