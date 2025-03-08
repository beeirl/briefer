import { Auth } from '@/auth'
import { QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { Router } from '../../../functions/src/api/trpc'

export const queryClient = new QueryClient()

const trpcClient = createTRPCClient<Router>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL + '/trpc',
      fetch: Auth.fetch,
    }),
  ],
})

export const trpc = createTRPCOptionsProxy<Router>({
  client: trpcClient,
  queryClient,
})
