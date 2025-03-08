import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { Resource } from 'sst'
import { z } from 'zod'
import { fn } from '../util/fn'

export namespace PublicStorage {
  let client: S3Client | undefined
  function useClient() {
    if (!client) {
      client = new S3Client({})
    }
    return client
  }

  export const getUploadUrl = fn(
    z.object({
      key: z.string(),
      contentType: z.string(),
    }),
    async (input) => {
      const client = useClient()
      const url = await getSignedUrl(
        client,
        new PutObjectCommand({
          Bucket: Resource.PublicStorage.name,
          Key: input.key,
          ContentType: input.contentType,
        }),
        { expiresIn: 3600 }
      )
      return url
    }
  )
}
