import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/$briefID')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/$briefID"!</div>
}
