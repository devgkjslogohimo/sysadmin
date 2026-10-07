import {
  createFileRoute,
  getRouteApi,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { KeyRound, ShieldCheck, UserPlus, UsersRound } from 'lucide-react'
import { useState } from 'react'

import type { FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  createUser,
  listUsers,
  resetUserPassword,
  setUserActive,
} from '@/server/users/users.functions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'

const rootRoute = getRouteApi('__root__')

export const Route = createFileRoute('/admin/users')({
  beforeLoad: ({ context }) => {
    if (context.user?.role !== 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },

  loader: () => listUsers(),

  component: UsersPage,
})

function UsersPage() {
  const { user: currentUser } = rootRoute.useRouteContext()
  const users = Route.useLoaderData()
  const router = useRouter()

  const [nama, setNama] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'PETUGAS'>('PETUGAS')

  const [resetTarget, setResetTarget] = useState<{
    id: number
    nama: string
  } | null>(null)

  const [resetPassword, setResetPassword] = useState('')
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState('')

  const [resetError, setResetError] = useState<string | null>(null)

  const [isResetting, setIsResetting] = useState(false)

  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingUserId, setProcessingUserId] = useState<number | null>(null)

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setMessage(null)
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await createUser({
        data: {
          nama,
          username,
          password,
          role,
        },
      })

      setNama('')
      setUsername('')
      setPassword('')
      setRole('PETUGAS')

      setMessage('User berhasil dibuat.')

      await router.invalidate()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'User tidak dapat dibuat.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!resetTarget || isResetting) {
      return
    }

    setResetError(null)

    if (resetPassword !== resetPasswordConfirm) {
      setResetError('Konfirmasi password tidak sama.')
      return
    }

    setIsResetting(true)

    try {
      await resetUserPassword({
        data: {
          id: resetTarget.id,
          newPassword: resetPassword,
        },
      })

      setMessage(`Password ${resetTarget.nama} berhasil direset.`)

      setResetTarget(null)
      setResetPassword('')
      setResetPasswordConfirm('')
    } catch (error) {
      setResetError(
        error instanceof Error
          ? error.message
          : 'Password tidak dapat direset.',
      )
    } finally {
      setIsResetting(false)
    }
  }

  async function handleToggleUser(id: number, isActive: boolean) {
    if (processingUserId !== null) {
      return
    }

    setMessage(null)
    setErrorMessage(null)
    setProcessingUserId(id)

    try {
      await setUserActive({
        data: {
          id,
          isActive: !isActive,
        },
      })

      await router.invalidate()
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Status user tidak dapat diubah.',
      )
    } finally {
      setProcessingUserId(null)
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UsersRound className="size-5" />
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              Administrator
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Kelola User
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Tambah dan atur akses pengguna internal Sistem Data Jemaat GKJ
              Slogohimo.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <UserPlus className="size-5 text-blue-600" />

            <h2 className="font-semibold text-slate-900">Tambah User</h2>
          </div>

          <form className="space-y-4" onSubmit={handleCreateUser}>
            <div className="space-y-2">
              <Label htmlFor="nama">Nama</Label>

              <Input
                id="nama"
                value={nama}
                onChange={(event) => setNama(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                autoComplete="off"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password Awal</Label>

              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                required
              />

              <p className="text-xs text-slate-400">Minimal 8 karakter.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>

              <select
                id="role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as 'ADMIN' | 'PETUGAS')
                }
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="PETUGAS">Petugas</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <UserPlus className="size-4" />

              {isSubmitting ? 'Menyimpan...' : 'Tambah User'}
            </Button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <ShieldCheck className="size-5 text-blue-600" />

            <h2 className="font-semibold text-slate-900">User Terdaftar</h2>
          </div>

          {message ? (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900">
                    {user.nama}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">
                    @{user.username}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {user.role === 'ADMIN' ? 'Administrator' : 'Petugas'}
                    </span>

                    <span
                      className={
                        user.isActive
                          ? 'rounded-lg bg-green-50 px-2 py-1 text-xs font-medium text-green-700'
                          : 'rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500'
                      }
                    >
                      {user.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {currentUser?.id !== user.id ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setResetError(null)
                        setResetPassword('')
                        setResetPasswordConfirm('')

                        setResetTarget({
                          id: user.id,
                          nama: user.nama,
                        })
                      }}
                    >
                      <KeyRound className="size-4" />
                      Reset Password
                    </Button>
                  ) : null}

                  <Button
                    type="button"
                    variant={user.isActive ? 'outline' : 'default'}
                    disabled={processingUserId !== null}
                    onClick={() =>
                      void handleToggleUser(user.id, user.isActive)
                    }
                  >
                    {processingUserId === user.id
                      ? 'Memproses...'
                      : user.isActive
                        ? 'Nonaktifkan'
                        : 'Aktifkan'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Dialog
        open={resetTarget !== null}
        onOpenChange={(open) => {
          if (!open && !isResetting) {
            setResetTarget(null)
            setResetPassword('')
            setResetPasswordConfirm('')
            setResetError(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>

            <DialogDescription>
              Buat password baru untuk{' '}
              <span className="font-medium text-slate-700">
                {resetTarget?.nama}
              </span>
              . Semua session user tersebut akan otomatis dikeluarkan.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5" onSubmit={handleResetPassword}>
            <div className="space-y-2">
              <Label htmlFor="resetPassword">Password Baru</Label>

              <Input
                id="resetPassword"
                type="password"
                autoComplete="new-password"
                value={resetPassword}
                onChange={(event) => setResetPassword(event.target.value)}
                disabled={isResetting}
                required
                autoFocus
              />

              <p className="text-xs text-slate-400">Minimal 8 karakter.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resetPasswordConfirm">Konfirmasi Password</Label>

              <Input
                id="resetPasswordConfirm"
                type="password"
                autoComplete="new-password"
                value={resetPasswordConfirm}
                onChange={(event) =>
                  setResetPasswordConfirm(event.target.value)
                }
                disabled={isResetting}
                required
              />
            </div>

            {resetError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {resetError}
              </div>
            ) : null}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isResetting}
                onClick={() => setResetTarget(null)}
              >
                Batal
              </Button>

              <Button type="submit" disabled={isResetting}>
                <KeyRound className="size-4" />

                {isResetting ? 'Mereset...' : 'Reset Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
