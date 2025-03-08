import { VisibleError } from '@briefer/core/error'
import { initTRPC } from '@trpc/server'
import { TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/unstable-core-do-not-import'

export const trpc = initTRPC.create({
  errorFormatter: ({ error, shape }) => {
    if (error.cause instanceof VisibleError) {
      return {
        ...shape,
        code: {
          auth: TRPC_ERROR_CODES_BY_KEY.UNAUTHORIZED,
          billing: TRPC_ERROR_CODES_BY_KEY.FORBIDDEN,
          input: TRPC_ERROR_CODES_BY_KEY.BAD_REQUEST,
        }[error.cause.kind],
        data: {
          ...shape.data,
          code: error.cause.code,
          httpStatus: {
            auth: 401,
            billing: 402,
            input: 400,
          }[error.cause.kind],
        },
        message: error.cause.message,
      }
    }
    return shape
  },
})
