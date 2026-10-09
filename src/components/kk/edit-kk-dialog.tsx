import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Pencil, Save, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { kkSchema } from '@/lib/kk-parser/schema'
import type { ValidatedKK } from '@/lib/kk-parser/schema'

import { getKKPrivateLocal, updateKKLocal } from '@/server/kk.local.functions'

import { createEmptyKK, normalizeKKFormValues } from './form/kk-form-defaults'

import { KKFormFields } from './form/kk-form-fields'

type Props = {
  id: number

  open: boolean

  onOpenChange: (open: boolean) => void

  onSaved?: () => void | Promise<void>
}

type PrivateKKResponse = Awaited<ReturnType<typeof getKKPrivateLocal>>

function normalizeJenisKelamin(
  value: string | null,
): 'LAKI-LAKI' | 'PEREMPUAN' | null {
  if (value === 'LAKI-LAKI') {
    return 'LAKI-LAKI'
  }

  if (value === 'PEREMPUAN') {
    return 'PEREMPUAN'
  }

  return null
}

function toFormValues(data: PrivateKKResponse['kk']): ValidatedKK {
  return {
    noKK: data.noKK,

    kepalaKeluarga: data.kepalaKeluarga ?? '',

    alamat: data.alamat,

    rt: data.rt,

    rw: data.rw,

    desaKelurahan: data.desaKelurahan,

    kecamatan: data.kecamatan,

    kabupatenKota: data.kabupatenKota,

    kodePos: data.kodePos,

    provinsi: data.provinsi,

    anggota: data.anggota.map((member, index) => ({
      id: member.id,

      no: index + 1,

      nama: member.nama,

      nik: member.nik,

      jenisKelamin: normalizeJenisKelamin(member.jenisKelamin),

      tempatLahir: member.tempatLahir,

      tanggalLahir: member.tanggalLahir,

      agama: member.agama,

      pendidikan: member.pendidikan,

      pekerjaan: member.pekerjaan,

      golonganDarah: member.golonganDarah,

      ayah: member.ayah,
      ibu: member.ibu,
      baptisAnak: member.baptisAnak,
      sidiBaptisDewasa: member.sidiBaptisDewasa,
      menikah: member.menikah,
      domisili: member.domisili,
    })),
  }
}

export function EditKKDialog({ id, open, onOpenChange, onSaved }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const [loadError, setLoadError] = useState<string | null>(null)

  const form = useForm<ValidatedKK>({
    resolver: zodResolver(kkSchema),

    defaultValues: createEmptyKK(),
  })

  const {
    reset,
    handleSubmit,

    formState: { isSubmitting },
  } = form

  useEffect(() => {
    if (!open) {
      return
    }

    let cancelled = false

    async function loadData() {
      setIsLoading(true)
      setLoadError(null)

      try {
        const response = await getKKPrivateLocal({
          data: {
            id,
          },
        })

        if (cancelled) {
          return
        }

        reset(toFormValues(response.kk))
      } catch (error) {
        if (cancelled) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'Gagal mengambil data.'

        setLoadError(message)

        toast.error('Gagal membuka data', {
          description: message,
        })
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [open, id, reset])

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) {
      return
    }

    onOpenChange(nextOpen)
  }

  async function onSubmit(values: ValidatedKK) {
    const normalizedValues = normalizeKKFormValues(values)

    try {
      await updateKKLocal({
        data: {
          id,
          kk: normalizedValues,
        },
      })

      toast.success('Data berhasil diperbarui', {
        description: 'Perubahan Kartu Keluarga berhasil disimpan.',
      })

      onOpenChange(false)

      await onSaved?.()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan pada server.'

      toast.error('Gagal memperbarui data', {
        description: message,
      })
    }
  }

  const disabled = isLoading || isSubmitting

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="
          flex
          max-h-[92dvh]
          w-[calc(100vw-1.5rem)]
          max-w-[calc(100vw-1.5rem)]
          flex-col
          gap-0
          overflow-hidden
          rounded-2xl
          border-slate-200
          bg-white
          p-0
          shadow-xl
          sm:w-[calc(100vw-3rem)]
          sm:max-w-5xl
        "
      >
        {/* HEADER */}
        <DialogHeader className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 pr-12 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Pencil className="size-4" />
            </div>

            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold text-slate-900 sm:text-lg">
                Edit Kartu Keluarga
              </DialogTitle>

              <DialogDescription className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Perbarui informasi Kartu Keluarga dan data anggota keluarga.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          /* LOADING */
          <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-50/40 px-6 py-16">
            <div className="text-center">
              <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white text-blue-600 ring-1 ring-slate-200">
                <Loader2 className="size-5 animate-spin" />
              </div>

              <div className="mt-3 text-sm font-medium text-slate-700">
                Memuat data Kartu Keluarga...
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Data sensitif sedang dibuka dengan aman.
              </p>
            </div>
          </div>
        ) : loadError ? (
          /* ERROR */
          <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-50/40 px-5 py-12 sm:px-6">
            <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-5 text-center">
              <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <TriangleAlert className="size-5" />
              </div>

              <div className="mt-3 text-sm font-semibold text-slate-800">
                Data tidak dapat dibuka
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {loadError}
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4 h-9 rounded-lg border-slate-200 bg-white"
                onClick={() => handleOpenChange(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        ) : (
          /* FORM */
          <form
            id="edit-kk-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            {/* SCROLL AREA */}
            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/40">
              <div className="p-4 sm:p-6">
                <KKFormFields form={form} disabled={disabled} />
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter className="shrink-0 border-t border-slate-200 bg-white px-4 pt-4 pb-5 sm:px-6 sm:pt-4 sm:pb-6">
              <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-lg border-slate-200 bg-white px-5 shadow-none"
                  disabled={disabled}
                  onClick={() => handleOpenChange(false)}
                >
                  Batal
                </Button>

                <Button
                  type="submit"
                  form="edit-kk-form"
                  className="h-10 rounded-lg px-5 sm:min-w-44"
                  disabled={disabled}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
