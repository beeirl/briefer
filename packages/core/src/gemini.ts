import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { FileState, GoogleAIFileManager } from '@google/generative-ai/server'
import { Resource } from 'sst'
import { z } from 'zod'
import { Asset } from './asset'
import { BriefBlock } from './brief/types'
import { VisibleError } from './error'
import { fn } from './util/fn'

const client = new GoogleGenerativeAI(Resource.GeminiApiKey.value)
const fileManager = new GoogleAIFileManager(Resource.GeminiApiKey.value)

export namespace Gemini {
  export const generateBriefBlocks = fn(
    z.object({
      prompt: z.string(),
      videoUri: z.string(),
      videoContentType: z.string(),
    }),
    async (input) => {
      const model = client.getGenerativeModel({
        model: 'gemini-2.0-flash',
      })
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                fileData: {
                  fileUri: input.videoUri,
                  mimeType: input.videoContentType,
                },
              },
              {
                text: input.prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            description: 'List of the sell blocks of a brief',
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: {
                  type: SchemaType.STRING,
                  description: 'Name of the sell block',
                  nullable: false,
                },
                description: {
                  type: SchemaType.STRING,
                  description: 'Transcript of the sell block',
                  nullable: false,
                },
                startTime: {
                  type: SchemaType.NUMBER,
                  description: 'Start time of the sell block in integer seconds',
                  nullable: false,
                },
                endTime: {
                  type: SchemaType.NUMBER,
                  description: 'End time of the sell block in integer seconds',
                  nullable: false,
                },
              },
              required: ['name', 'description', 'startTime', 'endTime'],
            },
          },
        },
      })
      const response = JSON.parse(result.response.text())
      return z.array(BriefBlock).parse(response)
    }
  )

  export const uploadAsset = fn(
    z.object({
      contentType: z.string(),
      id: z.string(),
    }),
    async (asset) => {
      const assetBuffer = await Asset.getBuffer(asset.id)
      const result = await fileManager.uploadFile(assetBuffer, {
        mimeType: asset.contentType,
      })
      let file = await fileManager.getFile(result.file.name)
      while (file.state === FileState.PROCESSING) {
        await new Promise((resolve) => setTimeout(resolve, 5_000))
        file = await fileManager.getFile(result.file.name)
      }
      if (file.state === FileState.FAILED) {
        throw new VisibleError('input', 'gemini.upload.failed', 'Asset processing failed')
      }
      return {
        uri: file.uri,
      }
    }
  )
}
