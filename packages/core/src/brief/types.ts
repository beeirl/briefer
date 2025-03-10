import { z } from 'zod'

export const BriefBlock = z.object({
  name: z.string(),
  description: z.string(),
  startTime: z.number(),
  endTime: z.number(),
})
export type BriefBlock = z.infer<typeof BriefBlock>

export const briefStatuses = ['pending', 'processing', 'completed', 'failed'] as const
