import { Loader } from '@/components/loader'
import { routeTree } from '@/routeTree.gen'
import { createRouter } from '@tanstack/react-router'
import { type AllParams } from '@tanstack/router-core'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const router = createRouter({
  routeTree,
  defaultPendingComponent: Loader,
})

export function getRouteParam(key: keyof AllParams<typeof router.routeTree>) {
  const param = (router.state.matches.at(-1) as any)?.params?.[key]
  const pendingParam = (router.state.pendingMatches?.at(-1) as any)?.params?.[key]
  return (pendingParam ?? param) as string | undefined
}
