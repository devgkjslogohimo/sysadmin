import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarPlus, Plus, UserRound, UsersRound, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { createEventKesehatan } from '@/server/kesehatan'
import type { CreateEventKesehatanInput } from '@/server/kesehatan'
import { createEventKesehatanSchema } from '@/server/kesehatan/schemas'

import { FormField } from './form-field'

type Props = {
  onCreated: () => void | Promise<void>
}

export function CreateEventForm({ onCreated }: Props) {
  const [petugasInput, setPetugasInput] = useState('')

  const form = useForm<CreateEventKesehatanInput>({
    resolver: zodResolver(createEventKesehatanSchema),

    defaultValues: {
      nama: '',
      tanggal: '',
      lokasi: '',
      petugas: [],
    },
  })

  const petugas = form.watch('petugas')

  function handleTambahPetugas() {
    const value = petugasInput.trim()

    if (!value) {
      return
    }

    const exists = petugas.some(
      (item) => item.toLowerCase() === value.toLowerCase(),
    )

    if (exists) {
      toast.error('Petugas tersebut sudah ditambahkan.')

      return
    }

    form.setValue('petugas', [...petugas, value], {
      shouldDirty: true,
      shouldValidate: true,
    })

    setPetugasInput('')
  }

  function handleHapusPetugas(nama: string) {
    form.setValue(
      'petugas',

      petugas.filter((item) => item !== nama),

      {
        shouldDirty: true,
        shouldValidate: true,
      },
    )
  }

  async function onSubmit(values: CreateEventKesehatanInput) {
    try {
      await createEventKesehatan({
        data: values,
      })

      toast.success('Event kesehatan berhasil dibuat.')

      form.reset({
        nama: '',
        tanggal: '',
        lokasi: '',
        petugas: [],
      })

      setPetugasInput('')

      await onCreated()
    } catch (error) {
      toast.error('Gagal membuat event', {
        description:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan pada server.',
      })
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarPlus className="size-4" />
          </div>

          <div className="min-w-0">
            <CardTitle className="text-base font-semibold text-slate-900">
              Buat Event
            </CardTitle>

            <p className="mt-0.5 text-xs text-slate-500">
              Tambahkan kegiatan kesehatan baru.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            label="Nama Event"
            error={form.formState.errors.nama?.message}
          >
            <Input
              {...form.register('nama')}
              disabled={isSubmitting}
              placeholder="Contoh: Cek Kesehatan Oktober 2026"
              className="h-10 rounded-lg border-slate-200 bg-white shadow-none"
            />
          </FormField>

          <FormField
            label="Tanggal"
            error={form.formState.errors.tanggal?.message}
          >
            <Input
              type="date"
              {...form.register('tanggal')}
              disabled={isSubmitting}
              className="h-10 rounded-lg border-slate-200 bg-white shadow-none"
            />
          </FormField>

          <FormField
            label="Lokasi"
            error={form.formState.errors.lokasi?.message}
          >
            <Input
              {...form.register('lokasi')}
              disabled={isSubmitting}
              placeholder="Lokasi kegiatan"
              className="h-10 rounded-lg border-slate-200 bg-white shadow-none"
            />
          </FormField>

          <div className="border-t border-slate-100 pt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                  <UsersRound className="size-4 text-slate-500" />
                  Petugas Event
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Tambahkan petugas yang bertugas pada event ini.
                </p>
              </div>

              {petugas.length > 0 && (
                <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                  {petugas.length} petugas
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                <Input
                  value={petugasInput}
                  disabled={isSubmitting}
                  placeholder="Nama petugas"
                  className="h-10 rounded-lg border-slate-200 bg-white pl-9 shadow-none"
                  onChange={(event) => setPetugasInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()

                      handleTambahPetugas()
                    }
                  }}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0 rounded-lg border-slate-200 bg-white px-3"
                disabled={isSubmitting || !petugasInput.trim()}
                onClick={handleTambahPetugas}
              >
                <Plus className="size-4" />

                <span className="hidden sm:inline">Tambah</span>
              </Button>
            </div>

            {petugas.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {petugas.map((nama) => (
                  <div
                    key={nama}
                    className="inline-flex max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700"
                  >
                    <span className="truncate">{nama}</span>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleHapusPetugas(nama)}
                      className="flex size-5 shrink-0 items-center justify-center rounded text-slate-400 transition hover:bg-white hover:text-red-600 disabled:pointer-events-none disabled:opacity-50"
                      aria-label={`Hapus ${nama}`}
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {form.formState.errors.petugas?.message && (
              <p className="mt-2 text-xs text-destructive">
                {form.formState.errors.petugas.message}
              </p>
            )}
          </div>

          <div className="border-t border-slate-100 pt-5">
            <Button
              type="submit"
              className="h-10 w-full rounded-lg"
              disabled={isSubmitting}
            >
              <CalendarPlus className="size-4" />

              {isSubmitting ? 'Menyimpan...' : 'Buat Event'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
