import { Auth } from '@/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: Outlet,
  beforeLoad: async () => {
    if (Auth.authenticated) throw redirect({ to: '/' })
  },
})
