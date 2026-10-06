import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
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
    })),
  }
}

export function EditKKDialog({ id, open, onOpenChange, onSaved }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ValidatedKK>({
    resolver: zodResolver(kkSchema),

    defaultValues: createEmptyKK(),
  })

  useEffect(() => {
    if (!open) {
      return
    }

    let cancelled = false

    async function loadData() {
      setIsLoading(true)

      try {
        const response = await getKKPrivateLocal({
          data: {
            id,
          },
        })

        if (cancelled) {
          return
        }

        form.reset(toFormValues(response.kk))
      } catch (err) {
        if (cancelled) {
          return
        }

        const message =
          err instanceof Error ? err.message : 'Gagal mengambil data.'

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
  }, [open, id, form])

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && form.formState.isSubmitting) {
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

      toast.success('Data berhasil diperbarui')

      onOpenChange(false)

      await onSaved?.()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Terjadi kesalahan pada server.'

      toast.error('Gagal memperbarui data', {
        description: message,
      })
    }
  }

  const disabled = isLoading || form.formState.isSubmitting

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="
    flex
    max-h-[92vh]
    w-[calc(100vw-2rem)]
    max-w-[calc(100vw-2rem)]
    flex-col
    gap-0
    overflow-hidden
    p-0
    sm:max-w-5xl
  "
      >
        <div className="px-6 pt-6">
          <DialogHeader>
            <DialogTitle>Edit Kartu Keluarga</DialogTitle>

            <DialogDescription>
              Perbarui informasi Kartu Keluarga dan anggota keluarga.
            </DialogDescription>
          </DialogHeader>
        </div>

        {isLoading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Memuat data...
            </div>
          </div>
        ) : (
          <form
            id="create-kk-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-w-0"
          >
            <div className="px-6 py-6">
              <KKFormFields form={form} disabled={disabled} />
            </div>

            <DialogFooter className="sticky bottom-0 z-20 border-t bg-background/95 px-6 py-4 backdrop-blur">
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={() => handleOpenChange(false)}
              >
                Batal
              </Button>

              <Button type="submit" disabled={disabled}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
