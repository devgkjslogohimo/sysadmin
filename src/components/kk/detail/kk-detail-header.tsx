import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  IdCard,
  Loader2,
  MapPin,
  Pencil,
  ShieldCheck,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Props = {
  kepalaKeluarga: string | null
  desaKelurahan: string | null
  kecamatan: string | null
  jumlahAnggota: number

  sensitiveVisible: boolean
  sensitiveLoading: boolean

  onEdit: () => void
  onToggleSensitive: () => void
}

export function KKDetailHeader({
  kepalaKeluarga,
  desaKelurahan,
  kecamatan,
  jumlahAnggota,
  sensitiveVisible,
  sensitiveLoading,
  onEdit,
  onToggleSensitive,
}: Props) {
  return (
    <>
      <div className="mb-5">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link to="/data-kk">
            <ArrowLeft className="size-4" />
            Kembali ke Data KK
          </Link>
        </Button>
      </div>

      <section className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1.5 bg-white">
              <IdCard className="size-3.5" />
              Kartu Keluarga
            </Badge>

            <Badge
              variant={sensitiveVisible ? 'destructive' : 'secondary'}
              className="gap-1.5"
            >
              <ShieldCheck className="size-3.5" />

              {sensitiveVisible
                ? 'Data sensitif terbuka'
                : 'Data sensitif terlindungi'}
            </Badge>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {kepalaKeluarga ?? 'Kartu Keluarga'}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />

              {desaKelurahan ?? '-'}
              {', '}
              {kecamatan ?? '-'}
            </span>

            <span className="flex items-center gap-1.5">
              <Users className="size-4" />
              {jumlahAnggota} anggota keluarga
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="bg-white" onClick={onEdit}>
            <Pencil className="size-4" />
            Edit Data
          </Button>

          <Button
            variant={sensitiveVisible ? 'secondary' : 'default'}
            onClick={onToggleSensitive}
            disabled={sensitiveLoading}
          >
            {sensitiveLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : sensitiveVisible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}

            {sensitiveVisible ? 'Tutup Semua NIK' : 'Buka Semua NIK'}
          </Button>
        </div>
      </section>
    </>
  )
}
