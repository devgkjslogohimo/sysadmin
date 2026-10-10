import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Droplets,
  IdCard,
  MapPin,
  UserRound,
  UsersRound,
} from 'lucide-react'

import type { ReactNode } from 'react'

import { RiwayatPemeriksaan } from '@/components/kesehatan/riwayat-pemeriksaan'
import { RingkasanKesehatan } from '@/components/kesehatan/ringkasan-kesehatan'
import { TrenKesehatan } from '@/components/kesehatan/tren-kesehatan'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { getAnggotaDetail } from '@/server/anggota'

export const Route = createFileRoute('/data-anggota_/$id')({
  loader: async ({ params }) => {
    const id = Number(params.id)

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID anggota tidak valid.')
    }

    return getAnggotaDetail({
      data: {
        id,
      },
    })
  },

  component: DataAnggotaDetailPage,
})

function DataAnggotaDetailPage() {
  const anggota = Route.useLoaderData()

  const lokasi = [anggota.desaKelurahan, anggota.kecamatan]
    .filter(Boolean)
    .join(', ')

  return (
    <main className="bg-slate-50/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* BACK */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-9 rounded-lg px-2 text-slate-500 hover:bg-white hover:text-slate-900"
            asChild
          >
            <Link to="/data-anggota">
              <ArrowLeft className="size-4" />
              Kembali ke Data Anggota
            </Link>
          </Button>
        </div>

        {/* HEADER */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 bg-linear-to-r from-blue-600 via-blue-500 to-sky-400" />

          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                  <UserRound className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                    Data Anggota
                  </div>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                    {anggota.nama}
                  </h1>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <IdCard className="size-4 text-slate-400" />

                      <span className="font-mono tabular-nums">
                        NIK {anggota.nik}
                      </span>
                    </span>

                    <span className="flex min-w-0 items-center gap-1.5">
                      <MapPin className="size-4 shrink-0 text-slate-400" />

                      <span className="truncate">
                        {lokasi || 'Lokasi belum tersedia'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full shrink-0 sm:w-auto">
              <Button
                variant="outline"
                className="h-10 w-full rounded-lg border-slate-200 bg-white px-4 shadow-none hover:bg-slate-50 sm:w-auto"
                asChild
              >
                <Link
                  to="/data-kk/$id"
                  params={{
                    id: String(anggota.kkId),
                  }}
                  preload="intent"
                >
                  <UsersRound className="size-4" />
                  Buka Kartu Keluarga
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* DATA DASAR */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UserRound className="size-4" />
                </div>

                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Identitas
                  </CardTitle>

                  <p className="mt-0.5 text-xs leading-5 text-slate-500">
                    Informasi pribadi anggota
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
              <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <Info
                  label="Nama Lengkap"
                  value={anggota.nama}
                  className="sm:col-span-2"
                />

                <Info label="NIK" value={anggota.nik} mono />

                <Info label="Jenis Kelamin" value={anggota.jenisKelamin} />

                <Info label="Tempat Lahir" value={anggota.tempatLahir} />

                <Info
                  label="Tanggal Lahir"
                  value={anggota.tanggalLahir}
                  icon={<CalendarDays className="size-3.5" />}
                />

                <Info label="Agama" value={anggota.agama} />

                <Info
                  label="Golongan Darah"
                  value={anggota.golonganDarah}
                  icon={<Droplets className="size-3.5" />}
                />

                <Info label="Pendidikan" value={anggota.pendidikan} />

                <Info
                  label="Pekerjaan"
                  value={anggota.pekerjaan}
                  icon={<BriefcaseBusiness className="size-3.5" />}
                />

                <Info
                  label="Nomor Anggota Dalam KK"
                  value={String(anggota.noUrut)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin className="size-4" />
                </div>

                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Keluarga & Alamat
                  </CardTitle>

                  <p className="mt-0.5 text-xs leading-5 text-slate-500">
                    Informasi keluarga dan domisili anggota
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
              <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <Info
                  label="Kepala Keluarga"
                  value={anggota.kepalaKeluarga}
                  className="sm:col-span-2"
                />

                <Info
                  label="Alamat"
                  value={anggota.alamat}
                  className="sm:col-span-2"
                />

                <Info
                  label="RT / RW"
                  value={formatRtRw(anggota.rt, anggota.rw)}
                />

                <Info label="Kode Pos" value={anggota.kodePos} />

                <Info label="Desa / Kelurahan" value={anggota.desaKelurahan} />

                <Info label="Kecamatan" value={anggota.kecamatan} />

                <Info label="Kabupaten / Kota" value={anggota.kabupatenKota} />

                <Info label="Provinsi" value={anggota.provinsi} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DATA KELUARGA & GEREJAWI */}
        <Card className="mt-6 overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UsersRound className="size-4" />
              </div>

              <div>
                <CardTitle className="text-base font-semibold text-slate-900">
                  Keluarga & Data Gerejawi
                </CardTitle>

                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  Informasi keluarga, domisili, dan riwayat gerejawi anggota
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6">
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <Info
                label="Gereja"
                value={anggota.gereja}
                className="sm:col-span-2 lg:col-span-3"
              />

              <Info label="Ayah" value={anggota.ayah} />

              <Info label="Ibu" value={anggota.ibu} />

              <Info label="Domisili" value={anggota.domisili} />

              <Info label="Baptis Anak" value={anggota.baptisAnak} />

              <Info
                label="Sidi / Baptis Dewasa"
                value={anggota.sidiBaptisDewasa}
              />

              <Info label="Menikah" value={anggota.menikah} />
            </div>
          </CardContent>
        </Card>

        {/* KESEHATAN */}
        <section className="mt-8">
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
              Kesehatan
            </div>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Informasi Kesehatan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Ringkasan, perkembangan, dan riwayat pemeriksaan kesehatan
              anggota.
            </p>
          </div>

          <div className="space-y-6">
            <RingkasanKesehatan anggotaId={anggota.id} />

            <TrenKesehatan anggotaId={anggota.id} />

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <RiwayatPemeriksaan anggotaId={anggota.id} refreshKey={0} />
            </section>
          </div>
        </section>

        {/* META */}
        <div className="mt-6 flex flex-col gap-1 border-t border-slate-200 pt-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Data Anggota #{anggota.id}</span>

          <span>Terdaftar pada KK #{anggota.kkId}</span>
        </div>
      </div>
    </main>
  )
}

type InfoProps = {
  label: string
  value: string | null
  icon?: ReactNode
  mono?: boolean
  className?: string
}

function Info({ label, value, icon, mono = false, className = '' }: InfoProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
        {icon}
        {label}
      </div>

      <div
        className={[
          'mt-1 text-sm font-medium leading-6 text-slate-800',
          mono ? 'font-mono tabular-nums' : '',
        ].join(' ')}
      >
        {value || '-'}
      </div>
    </div>
  )
}

function formatRtRw(rt: string | null, rw: string | null) {
  if (!rt && !rw) {
    return '-'
  }

  return `${rt ?? '-'} / ${rw ?? '-'}`
}
