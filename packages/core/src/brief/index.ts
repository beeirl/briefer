import { and, desc, eq, getTableColumns } from 'drizzle-orm'
import { Resource } from 'sst'
import { bus } from 'sst/aws/bus'
import { z } from 'zod'
import { useUserID } from '../actor'
import { Asset } from '../asset'
import { assetTable } from '../asset/index.sql'
import { db } from '../drizzle'
import { afterTx, useTransaction } from '../drizzle/transaction'
import { VisibleError } from '../error'
import { createEvent } from '../event'
import { Gemini } from '../gemini'
import { fn } from '../util/fn'
import { createID } from '../util/id'
import { briefTable } from './index.sql'

export namespace Brief {
  export const Info = z.object({
    createdAt: z.string().datetime(),
    id: z.string(),
    prompt: z.string(),
    title: z.string(),
    videoUrl: z.string().url().optional(),
  })
  export type Info = z.infer<typeof Info>

  export const Event = {
    Created: createEvent(
      'brief.created',
      z.object({
        briefID: z.string(),
      })
    ),
    Updated: createEvent(
      'brief.updated',
      z.object({
        briefID: z.string(),
      })
    ),
  }

  export const create = fn(
    z.object({
      prompt: z.string(),
      title: z.string(),
      videoAssetID: z.string(),
    }),
    (input) =>
      useTransaction(async (tx) => {
        const id = createID('brief')
        await tx.insert(briefTable).values({
          id,
          model: 'gemini-2.0-flash',
          prompt: input.prompt,
          status: 'pending',
          title: input.title,
          userID: useUserID(),
          videoAssetID: input.videoAssetID,
        })
        await afterTx(() => bus.publish(Resource.Bus, Event.Created, { briefID: id }))
        return id
      })
  )

  export const fromID = fn(z.string(), async (id) =>
    useTransaction(async (tx) => {
      const brief = await tx
        .select()
        .from(briefTable)
        .where(and(eq(briefTable.id, id), eq(briefTable.userID, useUserID())))
        .then((rows) => rows[0])
      if (!brief) {
        throw new VisibleError('input', 'brief.missing', 'Brief not found')
      }
      const videoUrl = await Asset.getUrl(brief.videoAssetID)
      return {
        blocks: brief.blocks,
        createdAt: brief.createdAt.toISOString(),
        id: brief.id,
        model: brief.model,
        prompt: brief.prompt,
        status: brief.status,
        title: brief.title,
        videoUrl,
      }
    })
  )

  export const generateBlocks = fn(z.string(), async (briefID) => {
    const brief = await db
      .select({
        ...getTableColumns(briefTable),
        videoContentType: assetTable.contentType,
      })
      .from(briefTable)
      .where(and(eq(briefTable.id, briefID), eq(briefTable.userID, useUserID())))
      .innerJoin(assetTable, eq(assetTable.id, briefTable.videoAssetID))
      .then((rows) => rows[0])
    if (!brief) {
      throw new VisibleError('input', 'brief.missing', 'Brief not found')
    }
    if (brief.status !== 'pending') {
      throw new VisibleError('input', 'brief.invalid', 'Brief is not pending')
    }
    await db.update(briefTable).set({ status: 'processing' }).where(eq(briefTable.id, briefID))
    let geminiVideoUri = brief.geminiVideoUri
    if (!geminiVideoUri) {
      const geminiVideo = await Gemini.uploadAsset({
        id: brief.videoAssetID,
        contentType: brief.videoContentType,
      })
      geminiVideoUri = geminiVideo.uri
    }
    const blocks = await Gemini.generateBriefBlocks({
      prompt: brief.prompt,
      videoUri: geminiVideoUri,
      videoContentType: brief.videoContentType,
    })
    await db
      .update(briefTable)
      .set({
        blocks,
        geminiVideoUri,
        status: 'completed',
      })
      .where(eq(briefTable.id, briefID))
  })

  export function list() {
    return useTransaction(async (tx) =>
      tx
        .select()
        .from(briefTable)
        .where(eq(briefTable.userID, useUserID()))
        .orderBy(desc(briefTable.createdAt))
        .then((rows) =>
          rows.map((row) => ({
            createdAt: row.createdAt.toISOString(),
            id: row.id,
            model: row.model,
            status: row.status,
            title: row.title,
          }))
        )
    )
  }

  export const update = fn(
    z.object({
      id: z.string(),
      prompt: z.string().optional(),
      title: z.string().optional(),
    }),
    async (input) =>
      useTransaction(async (tx) => {
        await tx
          .update(briefTable)
          .set({
            prompt: input.prompt,
            status: input.prompt ? 'pending' : undefined,
            title: input.title,
          })
          .where(and(eq(briefTable.id, input.id), eq(briefTable.userID, useUserID())))
        await afterTx(() => bus.publish(Resource.Bus, Event.Updated, { briefID: input.id }))
      })
  )
}
