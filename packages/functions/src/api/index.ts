import { VisibleError } from '@briefer/core/error'
import { Hono } from 'hono'
import { handle, streamHandle } from 'hono/aws-lambda'
import { HTTPException } from 'hono/http-exception'
import { ContentfulStatusCode } from 'hono/utils/http-status'
import { ZodError } from 'zod'
import { auth } from './auth'
import { TrpcRoute } from './trpc'

export const app = new Hono()
  .use(auth)
  .route('/trpc', TrpcRoute)
  .onError((error, c) => {
    console.error(error)
    if (error instanceof VisibleError) {
      return c.json(
        {
          code: error.code,
          message: error.message,
        },
        {
          auth: 401,
          billing: 402,
          input: 400,
        }[error.kind] as ContentfulStatusCode
      )
    }
    if (error instanceof ZodError) {
      const e = error.errors[0]
      if (e) {
        return c.json(
          {
            code: e?.code,
            message: e?.message,
          },
          400
        )
      }
    }
    if (error instanceof HTTPException) {
      return c.json(
        {
          code: 'request',
          message: 'Invalid request',
        },
        400
      )
    }
    return c.json(
      {
        code: 'internal',
        message: 'Internal server error',
      },
      500
    )
  })

export const handler = process.env.SST_LIVE ? handle(app) : streamHandle(app)
