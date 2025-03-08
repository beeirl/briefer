import { z } from 'zod'
import { VisibleError } from './error'
import { createContext } from './util/context'

export const PublicActor = z.object({
  type: z.literal('public'),
  properties: z.object({}),
})
export type PublicActor = z.infer<typeof PublicActor>

export const SystemActor = z.object({
  type: z.literal('system'),
  properties: z.object({
    userID: z.string(),
  }),
})
export type SystemActor = z.infer<typeof SystemActor>

export const UserActor = z.object({
  type: z.literal('user'),
  properties: z.object({
    userID: z.string(),
  }),
})
export type UserActor = z.infer<typeof UserActor>

export const Actor = z.discriminatedUnion('type', [PublicActor, SystemActor, UserActor])
export type Actor = z.infer<typeof Actor>

export const ActorContext = createContext<Actor>()

export function useUserID() {
  const actor = ActorContext.use()
  if ('userID' in actor.properties) return actor.properties.userID
  throw new VisibleError(
    'auth',
    'unauthorized',
    `You don't have permission to access this resource`
  )
}

export function useActor() {
  try {
    return ActorContext.use()
  } catch {
    return { type: 'public', properties: {} } as PublicActor
  }
}

export const withActor = ActorContext.with

export function assertActor<T extends Actor['type']>(type: T) {
  const actor = useActor()
  if (actor.type !== type) {
    throw new VisibleError('auth', 'actor.invalid', `Actor is not "${type}"`)
  }
  return actor as Extract<Actor, { type: T }>
}
