import * as LineIcon from '@/assets/icons/line'
import {
  UpdateBriefDialog,
  UpdateBriefDialogPopup,
  UpdateBriefDialogTrigger,
} from '@/components/update-brief-dialog'
import { VideoPlayer, VideoPlayerRef } from '@/components/video-player'
import { DashboardLayout, DashboardLayoutContent, DashboardLayoutTitle } from '@/layouts/dashboard'
import { queryClient, trpc } from '@/utils/trpc'
import { IconButton } from '@briefer/ui/icon-button'
import { cn } from '@briefer/ui/util/cn'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/_dashboard/brief/$briefID')({
  beforeLoad: async ({ params }) => {
    try {
      await queryClient.ensureQueryData(trpc.brief.fromID.queryOptions(params.briefID))
    } catch {
      throw redirect({ to: '/' })
    }
  },
  component: Brief,
})

function Brief() {
  const params = Route.useParams()
  const videoPlayerRef = React.useRef<VideoPlayerRef>(null)
  const [currentTime, setCurrentTime] = React.useState(0)

  const briefQuery = useQuery(
    trpc.brief.fromID.queryOptions(params.briefID, {
      refetchInterval: (query) => (query.state.data?.status !== 'completed' ? 5000 : false),
    })
  )
  const brief = briefQuery.data!

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const jumpToChapter = (startTime: number) => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seek(startTime)
      videoPlayerRef.current.play().catch((err) => {
        console.error('Error playing video:', err)
      })
    }
  }

  return (
    <DashboardLayout>
      <DashboardLayoutContent>
        <div className="flex items-center gap-2">
          <DashboardLayoutTitle>{brief.title}</DashboardLayoutTitle>
          <UpdateBriefDialog brief={brief}>
            <UpdateBriefDialogTrigger
              render={
                <IconButton
                  className="shadow-xs rounded-full"
                  color="gray"
                  size="xs"
                  variant="outline"
                >
                  <LineIcon.Pen />
                </IconButton>
              }
            />
            <UpdateBriefDialogPopup />
          </UpdateBriefDialog>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="shadow-xs sticky top-14 rounded-2xl border border-gray-200 bg-white p-1">
            <div className="rounded-xl border border-gray-100 bg-gray-50">
              <VideoPlayer
                ref={videoPlayerRef}
                videoUrl={brief.videoUrl}
                chapters={brief.blocks?.map((block) => ({
                  title: block.name,
                  startTime: block.startTime,
                  endTime: block.endTime,
                }))}
                onTimeUpdate={setCurrentTime}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 px-1">
            {brief.status === 'completed' ? (
              brief.blocks?.map((block, index) => {
                const active = currentTime >= block.startTime && currentTime < block.endTime
                return (
                  <div
                    className={cn(
                      'shadow-xs flex cursor-pointer flex-col rounded-lg p-4 ring ring-gray-200 hover:bg-gray-50',
                      active && 'ring-accent-600 bg-accent-50 hover:bg-accent-50 ring-2'
                    )}
                    key={`block-${index}`}
                    onClick={() => jumpToChapter(block.startTime)}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium">{block.name}</span>
                      <span className="text-sm text-gray-500">
                        {formatTime(block.startTime)} - {formatTime(block.endTime)}
                      </span>
                    </div>
                    <span className="text-sm">{block.description}</span>
                  </div>
                )
              })
            ) : (
              <React.Fragment>
                <div className="h-20 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-20 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-20 animate-pulse rounded-lg bg-gray-100" />
              </React.Fragment>
            )}
          </div>
        </div>
      </DashboardLayoutContent>
    </DashboardLayout>
  )
}
