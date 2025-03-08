import { Auth } from '@/auth'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: Outlet,
  beforeLoad: async () => {
    await Auth.init()
  },
})
