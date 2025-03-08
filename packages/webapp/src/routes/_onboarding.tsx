import { queryClient, trpc } from '@/utils/trpc'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_onboarding')({
  component: Outlet,
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData({
      ...trpc.user.getMe.queryOptions(),
      revalidateIfStale: true,
    })
    if (user?.name) throw redirect({ to: '/' })
  },
})
