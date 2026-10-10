import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, IdCard, Loader2, Save, TriangleAlert } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { KKFormFields } from './kk-form-fields'
import { createEmptyKK, normalizeKKFormValues } from './kk-form-defaults'

import { kkSchema } from '@/lib/kk-parser/schema'
import type { ValidatedKK } from '@/lib/kk-parser/schema'
import { normalizeGereja } from '@/lib/gereja'

import { saveKK } from '@/server/kk.functions'
import { getKKPrivateLocal, updateKKLocal } from '@/server/kk.local.functions'

type Props = { mode: 'create' } | { mode: 'edit'; id: number }

type PrivateKKResponse = Awaited<ReturnType<typeof getKKPrivateLocal>>

function normalizeJenisKelamin(
  value: string | null,
): 'LAKI-LAKI' | 'PEREMPUAN' | null {
  if (value === 'LAKI-LAKI' || value === 'PEREMPUAN') {
    return value
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
      gereja: normalizeGereja(member.gereja) ?? null,
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

export function KKPageForm(props: Props) {
  const router = useRouter()
  const mode = props.mode
  const id = props.mode === 'edit' ? props.id : null
  const isEdit = mode === 'edit'

  const [isLoading, setIsLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState<string | null>(null)

  const form = useForm<ValidatedKK>({
    resolver: zodResolver(kkSchema),
    defaultValues: createEmptyKK(),
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = form

  // Ambil data lama hanya ketika mode Edit.
  useEffect(() => {
    if (!isEdit) return

    if (id === null || !Number.isInteger(id) || id <= 0) {
      setLoadError('ID Kartu Keluarga tidak valid.')
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function loadData() {
      setIsLoading(true)
      setLoadError(null)

      try {
        const response = await getKKPrivateLocal({
          data: { id: id! },
        })

        if (cancelled) return

        const invalidGereja = response.kk.anggota.find(
          (member) => normalizeGereja(member.gereja) === undefined,
        )

        if (invalidGereja) {
          throw new Error(
            `Gereja pada anggota ${invalidGereja.nama} tidak sesuai daftar pilihan. Periksa data tersebut sebelum diedit.`,
          )
        }

        reset(toFormValues(response.kk))
      } catch (error) {
        if (cancelled) return

        setLoadError(
          error instanceof Error ? error.message : 'Gagal mengambil data KK.',
        )
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [id, isEdit, reset])

  function handleCancel() {
    if (
      isDirty &&
      !window.confirm('Ada perubahan yang belum disimpan. Yakin ingin keluar?')
    ) {
      return
    }

    if (isEdit && id !== null) {
      void router.navigate({
        to: '/data-kk/$id',
        params: { id: String(id) },
      })
    } else {
      void router.navigate({ to: '/data-kk' })
    }
  }

  async function onSubmit(values: ValidatedKK) {
    const normalized = normalizeKKFormValues(values)

    try {
      let targetId: number

      if (isEdit) {
        if (id === null || !Number.isInteger(id) || id <= 0) {
          throw new Error('ID Kartu Keluarga tidak valid.')
        }

        await updateKKLocal({
          data: {
            id,
            kk: normalized,
          },
        })

        targetId = id
      } else {
        const response = await saveKK({
          data: normalized,
        })

        targetId = response.id
      }

      toast.success(
        isEdit ? 'Data KK berhasil diperbarui.' : 'Data KK berhasil disimpan.',
      )

      await router.invalidate()

      await router.navigate({
        to: '/data-kk/$id',
        params: { id: String(targetId) },
      })
    } catch (error) {
      toast.error('Gagal menyimpan data', {
        description:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan pada server.',
      })
    }
  }

  const disabled = isLoading || isSubmitting

  return (
    <main className="min-h-screen bg-slate-50/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* NAVIGASI KEMBALI */}
        <Button
          type="button"
          variant="ghost"
          className="mb-5 -ml-2 text-slate-600"
          disabled={isSubmitting}
          onClick={handleCancel}
        >
          <ArrowLeft className="size-4" />
          Kembali
        </Button>

        {/* HEADER HALAMAN */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-sky-400" />

          <div className="flex items-start gap-4 p-5 sm:p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <IdCard className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Database Jemaat
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {isEdit ? 'Edit Kartu Keluarga' : 'Tambah Kartu Keluarga'}
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isEdit
                  ? 'Perbarui informasi KK dan anggota keluarga.'
                  : 'Masukkan informasi KK beserta seluruh anggota keluarga.'}
              </p>
            </div>
          </div>
        </section>

        {/* LOADING */}
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center rounded-xl border bg-white">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Loader2 className="size-5 animate-spin" />
              Memuat data Kartu Keluarga...
            </div>
          </div>
        ) : loadError ? (
          <div className="rounded-xl border border-red-200 bg-white p-6">
            <div className="flex items-start gap-3 text-red-700">
              <TriangleAlert className="size-5 shrink-0" />
              <div>
                <h2 className="font-semibold">Data tidak dapat dibuka</h2>
                <p className="mt-1 text-sm">{loadError}</p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-5"
              onClick={handleCancel}
            >
              Kembali
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* KOMPONEN FORM LAMA */}
            <KKFormFields form={form} disabled={disabled} />

            {/* ACTION BAR */}
            <div className="sticky bottom-0 z-10 mt-6 border-t border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-xl sm:border">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 sm:min-w-32"
                  disabled={disabled}
                  onClick={handleCancel}
                >
                  Batal
                </Button>

                <Button
                  type="submit"
                  className="h-11 sm:min-w-48"
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
                      {isEdit ? 'Simpan Perubahan' : 'Simpan Data'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
