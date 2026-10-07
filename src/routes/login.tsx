import { createFileRoute, redirect } from '@tanstack/react-router'
import { LogIn, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

import type { FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getCurrentUser,
  getInitialSetupStatus,
  login,
} from '@/server/auth/actions.functions'

export const Route = createFileRoute('/login')({
  loader: async () => {
    const [user, setup] = await Promise.all([
      getCurrentUser(),
      getInitialSetupStatus(),
    ])

    if (setup.requiresSetup) {
      throw redirect({
        to: '/setup-admin',
      })
    }

    if (user) {
      throw redirect({
        to: user.role === 'PETUGAS' ? '/event-kesehatan' : '/',
      })
    }

    return null
  },

  component: LoginPage,
})

function LoginPage() {
  const navigate = Route.useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const result = await login({
        data: {
          username,
          password,
        },
      })

      if (!result.success) {
        setErrorMessage(result.message)
        return
      }

      await navigate({
        to: result.user.role === 'PETUGAS' ? '/event-kesehatan' : '/',
        replace: true,
      })
    } catch {
      setErrorMessage('Login tidak dapat diproses. Silakan coba kembali.')
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
              <ShieldCheck className="size-6" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Masuk
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Masuk ke Sistem Data Jemaat GKJ Slogohimo.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Masukkan username"
                disabled={isSubmitting}
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan password"
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
              <LogIn className="size-4" />

              {isSubmitting ? 'Memeriksa...' : 'Masuk'}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          Akses hanya untuk pengguna internal yang telah terdaftar.
        </p>
      </div>
    </main>
  )
}
