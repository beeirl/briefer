import { Client } from '@planetscale/database'
import { sql } from 'drizzle-orm'
import { MySqlColumn } from 'drizzle-orm/mysql-core'
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { isPlainObject } from 'remeda'
import { Resource } from 'sst'

const client = new Client({
  host: Resource.Database.host,
  username: Resource.Database.username,
  password: Resource.Database.password,
})

export const db = drizzle(client, {
  logger:
    process.env.DRIZZLE_LOG === 'true'
      ? {
          logQuery(query, params) {
            console.log('query', query)
            console.log('params', params)
          },
        }
      : undefined,
})

export function setJson(column: MySqlColumn, json: Record<string, any>) {
  function mapToPathValuePairs(obj: any, path = '$'): any[] {
    return Object.entries(obj).flatMap(([key, value]) => {
      const newPath = `${path}.${key}`
      if (isPlainObject(value)) return mapToPathValuePairs(value, newPath)
      return [newPath, value]
    })
  }
  const pathValuePairs = mapToPathValuePairs(json).map((value) => sql`${value}`)
  return sql`JSON_SET(${column}, ${sql.join(pathValuePairs, sql`, `)})`
}
