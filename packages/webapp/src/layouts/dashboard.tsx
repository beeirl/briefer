import { BrieferLogoIcon } from '@/assets'
import * as LineIcon from '@/assets/icons/line'
import { Auth } from '@/auth'
import {
  CreateBriefDialog,
  CreateBriefDialogPopup,
  CreateBriefDialogTrigger,
} from '@/components/create-brief-dialog'
import { trpc } from '@/utils/trpc'
import { Button } from '@briefer/ui/button'
import { IconButton } from '@briefer/ui/icon-button'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuPositioner,
  MenuTrigger,
} from '@briefer/ui/menu'
import { cn } from '@briefer/ui/util/cn'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import React from 'react'

export function DashboardLayout({
  children,
  className,
}: React.ComponentProps<'div'> & { title?: string }) {
  const userQuery = useQuery(trpc.user.getMe.queryOptions())
  const user = userQuery.data!

  return (
    <div className={cn('mx-auto flex max-w-2xl flex-col', className)}>
      <div className="sticky top-0 z-50 flex h-14 items-center justify-between bg-white px-4">
        <Link className="flex items-center gap-2" to="/">
          <BrieferLogoIcon className="h-auto w-4" />
          <span className="font-medium">Briefer</span>
        </Link>
        <div className="flex items-center gap-2">
          <CreateBriefDialog>
            <CreateBriefDialogTrigger
              render={
                <Button
                  className="rounded-full"
                  color="gray"
                  radius="full"
                  shadow
                  size="sm"
                  variant="outline"
                >
                  <LineIcon.Plus />
                  Create
                </Button>
              }
            />
            <CreateBriefDialogPopup />
          </CreateBriefDialog>
          <Menu>
            <MenuTrigger
              render={
                <IconButton color="gray" radius="full" shadow size="sm" variant="outline">
                  <LineIcon.User />
                </IconButton>
              }
            />
            <MenuPositioner align="end" keepMounted sideOffset={5}>
              <MenuPopup className="w-40 rounded-lg">
                <MenuGroup>
                  <MenuGroupLabel>{user.name}</MenuGroupLabel>
                  <MenuItem className="text-red-600" onClick={Auth.logout}>
                    Abmelden
                  </MenuItem>
                </MenuGroup>
              </MenuPopup>
            </MenuPositioner>
          </Menu>
        </div>
      </div>
      {children}
    </div>
  )
}

export function DashboardLayoutContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-6 px-4 pb-6 pt-3', className)} {...props} />
}

export function DashboardLayoutTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-lg font-medium', className)} {...props} />
}
