import { IdCard } from 'lucide-react'

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
    <Card className="mb-6 overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-slate-50/60 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border bg-white">
            <IdCard className="size-4 text-slate-600" />
          </div>

          <div>
            <CardTitle className="text-base">
              Informasi Kartu Keluarga
            </CardTitle>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Data identitas dan wilayah keluarga
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Nomor KK" value={noKK} mono />

          <InfoItem label="Kepala Keluarga" value={kepalaKeluarga} />

          <InfoItem label="Alamat" value={alamat} />

          <InfoItem label="RT / RW" value={rtRw} />

          <InfoItem label="Desa / Kelurahan" value={desaKelurahan} />

          <InfoItem label="Kecamatan" value={kecamatan} />

          <InfoItem label="Kabupaten / Kota" value={kabupatenKota} />

          <InfoItem label="Kode Pos" value={kodePos} />

          <InfoItem label="Provinsi" value={provinsi} />
        </div>
      </CardContent>
    </Card>
  )
}
