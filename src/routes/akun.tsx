import { createFileRoute, useRouter } from '@tanstack/react-router'
import { KeyRound, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

import type { FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { changeOwnPassword } from '@/server/users/users.functions'

export const Route = createFileRoute('/akun')({
  component: AccountPage,
})

function AccountPage() {
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setErrorMessage(null)

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi password baru tidak sama.')
      return
    }

    setIsSubmitting(true)

    try {
      await changeOwnPassword({
        data: {
          currentPassword,
          newPassword,
        },
      })

      await router.navigate({
        to: '/login',
        replace: true,
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Password tidak dapat diubah.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <KeyRound className="size-5" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Ganti Password
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Ubah password akun anda. Setelah password berhasil diubah, anda
              perlu login kembali.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Password Saat Ini</Label>

              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>

              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                disabled={isSubmitting}
                required
              />

              <p className="text-xs text-slate-400">Minimal 8 karakter.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>

              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
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

              {isSubmitting ? 'Mengubah password...' : 'Ganti Password'}
            </Button>
          </form>
        </section>
      </div>
    </main>
  )
}
