import * as DuotoneIcon from '@/assets/icons/duotone'
import {
  CreateBriefDialog,
  CreateBriefDialogPopup,
  CreateBriefDialogTrigger,
} from '@/components/create-brief-dialog'
import { DashboardLayout, DashboardLayoutContent, DashboardLayoutTitle } from '@/layouts/dashboard'
import { queryClient, trpc } from '@/utils/trpc'
import { Button } from '@briefer/ui/button'
import { Card } from '@briefer/ui/card'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/')({
  component: Briefs,
  loader: async () => {
    await queryClient.ensureQueryData(trpc.brief.list.queryOptions())
  },
})

function Briefs() {
  const briefListQuery = useQuery(trpc.brief.list.queryOptions())
  const briefList = briefListQuery.data ?? []

  return (
    <DashboardLayout className="min-h-screen">
      {briefList.length === 0 ? (
        <DashboardLayoutContent className="flex-1 justify-center">
          <div className="flex h-full flex-col items-center justify-between gap-6">
            <div className="shadow-xs rounded-full border border-gray-200 bg-gray-100 p-6">
              <DuotoneIcon.Inbox className="size-12 text-gray-400" />
            </div>
            <div className="flex max-w-[260px] flex-col justify-center gap-2 text-center">
              <span className="font-medium">No briefs</span>
              <span className="text-balance text-sm text-gray-400">
                We couldn't find any briefs. Create one to get started.
              </span>
            </div>
            <CreateBriefDialog>
              <CreateBriefDialogTrigger
                render={
                  <Button color="gray" highContrast>
                    Create brief
                  </Button>
                }
              />
              <CreateBriefDialogPopup />
            </CreateBriefDialog>
          </div>
        </DashboardLayoutContent>
      ) : (
        <DashboardLayoutContent>
          <DashboardLayoutTitle>Briefs</DashboardLayoutTitle>
          <div className="flex flex-col gap-2">
            {briefList.map((brief, index) => (
              <Card asChild key={brief.id}>
                <Link to="/$briefID" params={{ briefID: brief.id }}>
                  <span className="flex-1 truncate">Brief #{index + 1}</span>
                  <span className="text-gray-400">
                    {new Date(brief.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              </Card>
            ))}
          </div>
        </DashboardLayoutContent>
      )}
    </DashboardLayout>
  )
}
