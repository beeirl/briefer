import { useActor, withActor } from '@briefer/core/actor'
import { VisibleError } from '@briefer/core/error'
import { createClient } from '@openauthjs/openauth/client'
import { MiddlewareHandler } from 'hono'
import { Resource } from 'sst'
import { subjects } from '../auth/subjects'

const client = createClient({
  clientID: 'api',
  issuer: Resource.Auth.url,
})

export const auth: MiddlewareHandler = async (c, next) => {
  const authorization = c.req.header('authorization') ?? c.req.query('authorization')
  if (authorization) {
    const match = authorization.match(/^Bearer (.+)$/)
    if (!match || !match[1]) {
      throw new VisibleError(
        'input',
        'auth.token',
        ' Bearer token not found or improperly formatted'
      )
    }
    const accessToken = match[1]
    const verified = await client.verify(subjects, accessToken!)
    if (verified.err) {
      throw new VisibleError('auth', 'auth.invalid', 'Invalid bearer token')
    }
    if (verified.subject.type === 'user') {
      return withActor(
        {
          type: 'user',
          properties: {
            userID: verified.subject.properties.userID,
          },
        },
        next
      )
    }
  }
  return withActor({ type: 'public', properties: {} }, next)
}

export const notPublic: MiddlewareHandler = async (c, next) => {
  const actor = useActor()
  if (actor.type === 'public') {
    throw new VisibleError('auth', 'unauthorized', 'Unauthorized')
  }
  return next()
}
