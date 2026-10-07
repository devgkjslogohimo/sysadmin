import {
  Activity,
  CalendarDays,
  Droplets,
  HeartPulse,
  Ruler,
  Scale,
  TestTube2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { getRingkasanKesehatan } from '@/server/kesehatan'

type Ringkasan = Awaited<ReturnType<typeof getRingkasanKesehatan>>

type Props = {
  anggotaId: number
}

export function RingkasanKesehatan({ anggotaId }: Props) {
  const [data, setData] = useState<Ringkasan | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getRingkasanKesehatan({
          data: {
            anggotaId,
          },
        })

        if (!cancelled) {
          setData(result)
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : 'Gagal memuat ringkasan kesehatan.',
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [anggotaId])

  if (isLoading) {
    return (
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <RingkasanHeader />
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="h-3 w-20 rounded bg-slate-200" />
                <div className="mt-3 h-5 w-24 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="overflow-hidden rounded-2xl border-red-200 bg-white shadow-sm">
        <CardHeader className="border-b border-red-100 px-5 py-4 sm:px-6">
          <RingkasanHeader />
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || !data.terakhir) {
    return (
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <RingkasanHeader />
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-200">
              <HeartPulse className="size-4" />
            </div>

            <div className="mt-3 text-sm font-semibold text-slate-700">
              Belum ada data kesehatan
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Ringkasan kesehatan akan muncul setelah anggota memiliki data
              pemeriksaan.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const terakhir = data.terakhir

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <RingkasanHeader />
      </CardHeader>

      <CardContent className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            icon={<Activity className="size-4" />}
            label="Pemeriksaan"
            value={`${data.jumlahPemeriksaan.toLocaleString('id-ID')} kali`}
          />

          <Metric
            icon={<CalendarDays className="size-4" />}
            label="Terakhir"
            value={formatTanggal(terakhir.tanggal)}
          />

          <Metric
            icon={<HeartPulse className="size-4" />}
            label="Tekanan Darah"
            value={formatTensi(terakhir.tensiSistolik, terakhir.tensiDiastolik)}
          />

          <Metric
            icon={<Droplets className="size-4" />}
            label="Gula Darah"
            value={formatNilai(terakhir.gulaDarah, 'mg/dL')}
          />

          <Metric
            icon={<TestTube2 className="size-4" />}
            label="Kolesterol"
            value={formatNilai(terakhir.kolesterol, 'mg/dL')}
          />

          <Metric
            icon={<TestTube2 className="size-4" />}
            label="Asam Urat"
            value={formatNilai(terakhir.asamUrat, 'mg/dL')}
          />

          <Metric
            icon={<Scale className="size-4" />}
            label="Berat Badan"
            value={formatNilai(terakhir.beratBadan, 'kg')}
          />

          <Metric
            icon={<Ruler className="size-4" />}
            label="Tinggi Badan"
            value={formatNilai(terakhir.tinggiBadan, 'cm')}
          />
        </div>

        <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 lg:grid-cols-2">
          <div className="rounded-xl bg-slate-50 px-4 py-3.5">
            <div className="text-xs font-medium text-slate-400">
              Pemeriksaan Terakhir
            </div>

            <div className="mt-1 text-sm font-semibold text-slate-800">
              {terakhir.eventNama}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3.5">
            <div className="text-xs font-medium text-slate-400">
              Tanggal Pemeriksaan
            </div>

            <div className="mt-1 text-sm font-semibold text-slate-800">
              {formatTanggal(terakhir.tanggal)}
            </div>
          </div>
        </div>

        {terakhir.hasilRingkas && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5">
            <div className="text-xs font-medium text-slate-400">
              Hasil Ringkas Terakhir
            </div>

            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {terakhir.hasilRingkas}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RingkasanHeader() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <HeartPulse className="size-4" />
      </div>

      <div>
        <CardTitle className="text-base font-semibold text-slate-900">
          Ringkasan Kesehatan
        </CardTitle>

        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          Kondisi berdasarkan pemeriksaan kesehatan terakhir
        </p>
      </div>
    </div>
  )
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        {icon}
        {label}
      </div>

      <div className="mt-2 text-base font-semibold leading-6 text-slate-900">
        {value}
      </div>
    </div>
  )
}

function formatTensi(sistolik: number | null, diastolik: number | null) {
  if (sistolik === null && diastolik === null) {
    return '-'
  }

  return `${sistolik ?? '-'}/${diastolik ?? '-'} mmHg`
}

function formatNilai(value: number | null, suffix: string) {
  if (value === null) {
    return '-'
  }

  return `${value.toLocaleString('id-ID')} ${suffix}`
}

function formatTanggal(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}
