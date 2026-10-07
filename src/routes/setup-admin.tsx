import { createFileRoute, redirect } from '@tanstack/react-router'
import { ShieldCheck, UserRoundPlus } from 'lucide-react'
import { useState } from 'react'

import type { FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  createInitialAdmin,
  getInitialSetupStatus,
} from '@/server/auth/actions.functions'

export const Route = createFileRoute('/setup-admin')({
  loader: async () => {
    const status = await getInitialSetupStatus()

    if (!status.requiresSetup) {
      throw redirect({
        to: '/login',
      })
    }

    return status
  },

  component: SetupAdminPage,
})

function SetupAdminPage() {
  const navigate = Route.useNavigate()

  const [nama, setNama] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setErrorMessage(null)

    if (password !== passwordConfirm) {
      setErrorMessage('Konfirmasi password tidak sama.')
      return
    }

    setIsSubmitting(true)

    try {
      await createInitialAdmin({
        data: {
          nama,
          username,
          password,
        },
      })

      await navigate({
        to: '/',
        replace: true,
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Administrator tidak dapat dibuat.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserRoundPlus className="size-6" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Buat Administrator
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Buat akun administrator pertama untuk Sistem Data Jemaat GKJ
              Slogohimo.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="nama">Nama</Label>

              <Input
                id="nama"
                name="nama"
                autoComplete="name"
                value={nama}
                onChange={(event) => setNama(event.target.value)}
                placeholder="Nama administrator"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                disabled={isSubmitting}
                required
              />

              <p className="text-xs text-slate-400">
                Gunakan minimal 3 karakter.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 8 karakter"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">Konfirmasi Password</Label>

              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                placeholder="Ulangi password"
                disabled={isSubmitting}
                required
              />
            </div>

            {errorMessage ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <ShieldCheck className="size-4" />

              {isSubmitting ? 'Membuat administrator...' : 'Buat Administrator'}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          Halaman ini hanya tersedia selama belum ada user di sistem.
        </p>
      </div>
    </main>
  )
}
