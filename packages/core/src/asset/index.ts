import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { and, eq } from 'drizzle-orm'
import { Resource } from 'sst'
import { z } from 'zod'
import { useUserID } from '../actor'
import { useTransaction } from '../drizzle/transaction'
import { VisibleError } from '../error'
import { fn } from '../util/fn'
import { createID } from '../util/id'
import { assetTable } from './index.sql'

const s3Client = new S3Client({})

export namespace Asset {
  export const Info = z.object({
    contentType: z.string(),
    id: z.string(),
    fileName: z.string(),
    size: z.number(),
  })
  export type Info = z.infer<typeof Info>

  export const fromID = fn(z.string(), (id) =>
    useTransaction((tx) =>
      tx
        .select()
        .from(assetTable)
        .where(and(eq(assetTable.id, id), eq(assetTable.userID, useUserID())))
        .then((rows) => rows.map(serialize)[0])
    )
  )

  export const upload = fn(
    Info.pick({
      contentType: true,
      fileName: true,
      size: true,
    }),
    (input) =>
      useTransaction(async (tx) => {
        const id = createID('asset')
        await tx.insert(assetTable).values({
          id,
          contentType: input.contentType,
          fileName: input.fileName,
          size: input.size,
          userID: useUserID(),
        })
        const uploadUrl = await getSignedUrl(
          s3Client,
          new PutObjectCommand({
            Bucket: Resource.AssetStorage.name,
            ContentType: input.contentType,
            Key: useStorageKey(id),
          })
        )
        return {
          id,
          uploadUrl,
        }
      })
  )

  export const getBuffer = fn(z.string(), async (id) => {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: Resource.AssetStorage.name,
        Key: useStorageKey(id),
      })
    )
    if (!response.Body) {
      throw new VisibleError('input', 'asset.missing', 'Asset not found')
    }
    return Buffer.from(await response.Body.transformToByteArray())
  })

  export const getUrl = fn(z.string(), async (id) =>
    getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: Resource.AssetStorage.name,
        Key: useStorageKey(id),
      })
    )
  )

  function useStorageKey(id: string) {
    return `${useUserID()}/${id}`
  }

  function serialize(input: typeof assetTable.$inferSelect): Info {
    return {
      contentType: input.contentType,
      id: input.id,
      fileName: input.fileName,
      size: input.size,
    }
  }
}
