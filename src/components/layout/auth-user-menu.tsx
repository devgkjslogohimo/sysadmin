import { getRouteApi, Link, useRouter } from '@tanstack/react-router'
import {
  ChevronDown,
  KeyRound,
  LogOut,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { logout } from '@/server/auth/actions.functions'

const rootRoute = getRouteApi('__root__')

export function AuthUserMenu() {
  const router = useRouter()

  const { user } = rootRoute.useRouteContext()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!user) {
    return null
  }

  async function handleLogout() {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      await logout()

      await router.navigate({
        to: '/login',
        replace: true,
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const roleLabel = user.role === 'ADMIN' ? 'Administrator' : 'Petugas'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="ml-2 h-10 gap-2 border border-slate-200 bg-white px-3 text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50"
        >
          <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <UserRound className="size-4" />
          </div>

          <div className="hidden text-left xl:block">
            <div className="max-w-32 truncate text-xs font-semibold text-slate-800">
              {user.nama}
            </div>

            <div className="text-[10px] text-slate-400">{roleLabel}</div>
          </div>

          <ChevronDown className="size-3.5 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64 rounded-xl border-blue-100/80 p-2 shadow-xl shadow-slate-900/5"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="font-semibold text-slate-800">{user.nama}</div>

          <div className="mt-1 text-xs font-normal text-slate-400">
            @{user.username}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500">
          <ShieldCheck className="size-4 text-blue-600" />
          {roleLabel}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="rounded-lg">
          <Link to="/akun">
            <KeyRound className="size-4" />
            Ganti Password
          </Link>
        </DropdownMenuItem>

        {user.role === 'ADMIN' ? (
          <>
            <DropdownMenuItem asChild className="rounded-lg">
              <Link to="/admin/users">
                <UsersRound className="size-4" />
                Kelola User
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        ) : null}

        <DropdownMenuItem
          variant="destructive"
          disabled={isLoggingOut}
          onSelect={() => void handleLogout()}
          className="rounded-lg"
        >
          <LogOut className="size-4" />

          {isLoggingOut ? 'Keluar...' : 'Keluar'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
