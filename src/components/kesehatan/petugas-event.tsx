import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, UsersRound } from 'lucide-react'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { FormField } from '@/components/kesehatan/form-field'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { hapusPetugasEvent, tambahPetugasEvent } from '@/server/kesehatan'

import { petugasEventFormSchema } from '@/server/kesehatan/schemas'

import type { PetugasEventFormValues } from '@/server/kesehatan/schemas'

type Petugas = {
  id: number
  nama: string
}

type Props = {
  eventId: number
  petugas: Petugas[]

  onChanged: () => void | Promise<void>
}

export function PetugasEvent({ eventId, petugas, onChanged }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const form = useForm<PetugasEventFormValues>({
    resolver: zodResolver(petugasEventFormSchema),

    defaultValues: {
      nama: '',
    },
  })

  const {
    register,
    reset,
    setError,

    formState: { errors, isSubmitting },
  } = form

  async function onSubmit(values: PetugasEventFormValues) {
    const exists = petugas.some(
      (item) => item.nama.toLowerCase() === values.nama.trim().toLowerCase(),
    )

    if (exists) {
      setError('nama', {
        type: 'manual',
        message: 'Petugas tersebut sudah ditambahkan.',
      })

      return
    }

    try {
      await tambahPetugasEvent({
        data: {
          eventId,
          nama: values.nama,
        },
      })

      toast.success('Petugas berhasil ditambahkan.')

      reset({
        nama: '',
      })

      await onChanged()
    } catch (error) {
      toast.error('Gagal menambahkan petugas', {
        description:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan pada server.',
      })
    }
  }

  async function handleDelete(item: Petugas) {
    const confirmed = window.confirm(
      `Hapus ${item.nama} dari daftar petugas event?`,
    )

    if (!confirmed) {
      return
    }

    setDeletingId(item.id)

    try {
      await hapusPetugasEvent({
        data: {
          id: item.id,
        },
      })

      toast.success('Petugas berhasil dihapus.')

      await onChanged()
    } catch (error) {
      toast.error('Gagal menghapus petugas', {
        description:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan pada server.',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const isBusy = isSubmitting || deletingId !== null

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UsersRound className="size-4" />
            </div>

            <div className="min-w-0">
              <CardTitle className="text-base font-semibold text-slate-900">
                Petugas Event
              </CardTitle>

              <p className="mt-0.5 text-xs text-slate-500">
                Kelola petugas yang terlibat dalam kegiatan ini.
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
            {petugas.length.toLocaleString('id-ID')} petugas
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6">
        <form
          className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField label="Tambah Petugas" error={errors.nama?.message}>
            <Input
              {...register('nama')}
              disabled={isBusy}
              placeholder="Masukkan nama petugas"
              autoComplete="off"
              className="h-10 rounded-lg border-slate-200 bg-white shadow-none"
            />
          </FormField>

          <Button
            type="submit"
            variant="outline"
            disabled={isBusy}
            className="h-10 rounded-lg border-slate-200 bg-white px-4 shadow-none"
          >
            <Plus className="size-4" />

            {isSubmitting ? 'Menambahkan...' : 'Tambah'}
          </Button>
        </form>

        <div className="mt-5 border-t border-slate-100 pt-5">
          {petugas.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-5 py-8 text-center">
              <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-200">
                <UsersRound className="size-4" />
              </div>

              <div className="mt-3 text-sm font-medium text-slate-700">
                Belum ada petugas
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Tambahkan petugas yang bertanggung jawab pada event kesehatan
                ini.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {petugas.map((item) => {
                const isDeleting = deletingId === item.id

                return (
                  <div
                    key={item.id}
                    className="inline-flex max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  >
                    <span className="truncate font-medium">{item.nama}</span>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleDelete(item)}
                      className="flex size-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Hapus ${item.nama}`}
                      title={`Hapus ${item.nama}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>

                    {isDeleting && (
                      <span className="sr-only">Menghapus...</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
