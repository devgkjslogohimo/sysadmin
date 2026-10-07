import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  IdCard,
  Loader2,
  MapPin,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react'

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
  const lokasi = [desaKelurahan, kecamatan].filter(Boolean).join(', ')

  return (
    <>
      {/* BACK */}
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 h-9 rounded-lg px-2 text-slate-500 hover:bg-white hover:text-slate-900"
          asChild
        >
          <Link to="/data-kk">
            <ArrowLeft className="size-4" />
            Kembali ke Data KK
          </Link>
        </Button>
      </div>

      {/* HEADER */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400" />

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            {/* INFORMASI */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                  <IdCard className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                      Kartu Keluarga
                    </span>

                    {sensitiveVisible ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700">
                        <ShieldAlert className="size-3.5" />
                        Data sensitif terbuka
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        <ShieldCheck className="size-3.5" />
                        Data sensitif terlindungi
                      </span>
                    )}
                  </div>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                    {kepalaKeluarga ?? 'Kartu Keluarga'}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <MapPin className="size-4 shrink-0 text-slate-400" />

                      <span className="truncate">
                        {lokasi || 'Lokasi belum tersedia'}
                      </span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Users className="size-4 text-slate-400" />
                      {jumlahAnggota.toLocaleString('id-ID')} anggota keluarga
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row lg:w-auto">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full rounded-lg border-slate-200 bg-white px-4 text-slate-700 shadow-none hover:bg-slate-50 sm:w-auto"
                disabled={sensitiveLoading}
                onClick={onEdit}
              >
                <Pencil className="size-4" />
                Edit Data
              </Button>

              <Button
                type="button"
                variant="outline"
                className={[
                  'h-10 w-full rounded-lg px-4 shadow-none sm:w-auto',
                  sensitiveVisible
                    ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                ].join(' ')}
                disabled={sensitiveLoading}
                onClick={onToggleSensitive}
              >
                {sensitiveLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : sensitiveVisible ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}

                {sensitiveLoading
                  ? 'Memuat...'
                  : sensitiveVisible
                    ? 'Sembunyikan Data Sensitif'
                    : 'Tampilkan Data Sensitif'}
              </Button>
            </div>
          </div>

          {/* PRIVACY NOTICE */}
          {sensitiveVisible && (
            <div className="mt-5 flex items-start gap-2.5 border-t border-slate-100 pt-4 text-xs leading-5 text-red-600">
              <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />

              <span>
                Nomor KK dan NIK sedang ditampilkan. Sembunyikan kembali data
                sensitif setelah selesai digunakan.
              </span>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
