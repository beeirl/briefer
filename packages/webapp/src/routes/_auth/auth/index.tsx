import { Google } from '@/assets/icons/brand'
import { Email } from '@/assets/icons/duotone'
import { Auth } from '@/auth'
import { AuthLayout } from '@/layouts/auth'
import { queryClient } from '@/utils/trpc'
import { Button } from '@briefer/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/auth/')({
  component: Login,
  beforeLoad: async () => {
    await queryClient.invalidateQueries()
  },
})

function Login() {
  return (
    <AuthLayout title="Welcome to Briefer" description="Choose a login option to get started">
      <div className="flex flex-col gap-3">
        <Button color="gray" variant="outline" onClick={() => Auth.login('google')}>
          <Google />
          Continue with Google
        </Button>
        <Button color="gray" variant="outline" onClick={() => Auth.login('code')}>
          <Email />
          Continue with Email
        </Button>
      </div>
    </AuthLayout>
  )
}
