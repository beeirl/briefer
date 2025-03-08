import { Auth } from '@/auth'
import { queryClient, trpc } from '@/utils/trpc'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard')({
  component: Outlet,
  beforeLoad: async () => {
    if (!Auth.authenticated) throw redirect({ to: '/auth' })
    const user = await queryClient.ensureQueryData(trpc.user.getMe.queryOptions())
    if (!user?.name) throw redirect({ to: '/onboarding' })
  },
})
