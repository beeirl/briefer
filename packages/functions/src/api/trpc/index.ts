import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { notPublic } from '../auth'
import { AssetRouter } from './asset'
import { BriefRouter } from './brief'
import { trpc } from './trpc'
import { UserRouter } from './user'

export const router = trpc.router({
  asset: AssetRouter,
  brief: BriefRouter,
  user: UserRouter,
})
export type Router = typeof router

export const TrpcRoute = new Hono().use(notPublic).use(trpcServer({ router }))
