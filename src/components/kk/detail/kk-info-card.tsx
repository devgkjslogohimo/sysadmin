import { IdCard, MapPin } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { InfoItem } from './info-item'

type Props = {
  noKK: string

  kepalaKeluarga: string | null
  alamat: string | null

  rt: string | null
  rw: string | null

  desaKelurahan: string | null
  kecamatan: string | null
  kabupatenKota: string | null
  kodePos: string | null
  provinsi: string | null
}

export function KKInfoCard({
  noKK,
  kepalaKeluarga,
  alamat,
  rt,
  rw,
  desaKelurahan,
  kecamatan,
  kabupatenKota,
  kodePos,
  provinsi,
}: Props) {
  const rtRw = rt || rw ? `${rt ?? '-'} / ${rw ?? '-'}` : null

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <IdCard className="size-4" />
          </div>

          <div className="min-w-0">
            <CardTitle className="text-base font-semibold text-slate-900">
              Informasi Kartu Keluarga
            </CardTitle>

            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              Identitas utama dan alamat keluarga
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* IDENTITAS UTAMA */}
        <div className="grid border-b border-slate-100 md:grid-cols-2">
          <InfoItem label="Nomor KK" value={noKK} mono />

          <InfoItem label="Kepala Keluarga" value={kepalaKeluarga} />
        </div>

        {/* ALAMAT */}
        <div className="px-5 py-4 sm:px-6">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            <MapPin className="size-3.5" />
            Alamat
          </div>

          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoBlock
              label="Alamat"
              value={alamat}
              className="sm:col-span-2 lg:col-span-2"
            />

            <InfoBlock label="RT / RW" value={rtRw} />

            <InfoBlock label="Desa / Kelurahan" value={desaKelurahan} />

            <InfoBlock label="Kecamatan" value={kecamatan} />

            <InfoBlock label="Kabupaten / Kota" value={kabupatenKota} />

            <InfoBlock label="Provinsi" value={provinsi} />

            <InfoBlock label="Kode Pos" value={kodePos} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function InfoBlock({
  label,
  value,
  className = '',
}: {
  label: string
  value: string | null
  className?: string
}) {
  return (
    <div className={className}>
      <div className="text-xs font-medium text-slate-400">{label}</div>

      <div className="mt-1 text-sm font-medium leading-6 text-slate-800">
        {value || '-'}
      </div>
    </div>
  )
}
