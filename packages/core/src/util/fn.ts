import { ZodSchema, z } from 'zod'

export function fn<TSchema extends ZodSchema, TCallback extends (schema: z.output<TSchema>) => any>(
  schema: TSchema,
  cb: TCallback
) {
  const result = function (input: z.input<typeof schema>): ReturnType<TCallback> {
    const parsed = schema.parse(input)
    return cb.apply(cb, [parsed as any])
  }
  result.schema = schema
  return result
}
