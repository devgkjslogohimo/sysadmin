import {
  Activity,
  CalendarDays,
  ClipboardList,
  Clock3,
  History,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { getRiwayatPemeriksaan } from '@/server/kesehatan'

type Riwayat = Awaited<ReturnType<typeof getRiwayatPemeriksaan>>[number]

type Props = {
  anggotaId: number
  refreshKey?: number
}

export function RiwayatPemeriksaan({ anggotaId, refreshKey = 0 }: Props) {
  const [data, setData] = useState<Riwayat[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getRiwayatPemeriksaan({
          data: {
            anggotaId,
          },
        })

        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setData([])

          setError(
            err instanceof Error
              ? err.message
              : 'Gagal memuat riwayat kesehatan.',
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
  }, [anggotaId, refreshKey])

  if (isLoading) {
    return (
      <div className="space-y-3">
        <RiwayatHeader count={null} />

        <div className="space-y-3">
          {Array.from({
            length: 2,
          }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl border border-slate-200 p-4"
            >
              <div className="h-4 w-40 rounded bg-slate-100" />

              <div className="mt-2 h-3 w-28 rounded bg-slate-100" />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({
                  length: 6,
                }).map((__, itemIndex) => (
                  <div key={itemIndex}>
                    <div className="h-3 w-16 rounded bg-slate-100" />

                    <div className="mt-2 h-4 w-20 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3">
        <RiwayatHeader count={null} />

        <div className="rounded-xl border border-red-200 bg-red-50/60 px-5 py-6 text-center">
          <div className="text-sm font-semibold text-red-800">
            Riwayat kesehatan gagal dimuat
          </div>

          <p className="mt-1 text-xs leading-5 text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="space-y-3">
        <RiwayatHeader count={0} />

        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-200">
            <History className="size-4" />
          </div>

          <div className="mt-3 text-sm font-semibold text-slate-700">
            Belum ada riwayat kesehatan
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Riwayat pemeriksaan warga akan muncul di sini setelah pemeriksaan
            tersimpan.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <RiwayatHeader count={data.length} />

      <div className="space-y-3">
        {data.map((item, index) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            {/* EVENT */}
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-slate-900">
                    {item.event.nama}
                  </h3>

                  {index === 0 && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                      Terbaru
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <CalendarDays className="size-3.5" />

                  {formatTanggal(item.event.tanggal)}
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                <UsersRound className="size-3.5 shrink-0" />

                <span className="truncate">
                  {item.event.petugas.length > 0
                    ? item.event.petugas
                        .map((petugas) => petugas.nama)
                        .join(', ')
                    : 'Petugas tidak tercatat'}
                </span>
              </div>
            </div>

            {/* NILAI PEMERIKSAAN */}
            <div className="p-4">
              <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
                <Item
                  label="Tekanan Darah"
                  value={
                    item.tensiSistolik !== null && item.tensiDiastolik !== null
                      ? `${item.tensiSistolik}/${item.tensiDiastolik}`
                      : '-'
                  }
                  suffix={
                    item.tensiSistolik !== null && item.tensiDiastolik !== null
                      ? 'mmHg'
                      : undefined
                  }
                />

                <Item
                  label="Gula Darah"
                  value={item.gulaDarah !== null ? String(item.gulaDarah) : '-'}
                  suffix={item.gulaDarah !== null ? 'mg/dL' : undefined}
                />

                <Item
                  label="Kolesterol"
                  value={
                    item.kolesterol !== null ? String(item.kolesterol) : '-'
                  }
                  suffix={item.kolesterol !== null ? 'mg/dL' : undefined}
                />

                <Item
                  label="Asam Urat"
                  value={item.asamUrat !== null ? String(item.asamUrat) : '-'}
                  suffix={item.asamUrat !== null ? 'mg/dL' : undefined}
                />

                <Item
                  label="Berat Badan"
                  value={
                    item.beratBadan !== null ? String(item.beratBadan) : '-'
                  }
                  suffix={item.beratBadan !== null ? 'kg' : undefined}
                />

                <Item
                  label="Tinggi Badan"
                  value={
                    item.tinggiBadan !== null ? String(item.tinggiBadan) : '-'
                  }
                  suffix={item.tinggiBadan !== null ? 'cm' : undefined}
                />
              </div>

              {(item.keluhan || item.hasilRingkas) && (
                <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 lg:grid-cols-2">
                  {item.keluhan && (
                    <CatatanItem label="Keluhan" value={item.keluhan} />
                  )}

                  {item.hasilRingkas && (
                    <CatatanItem
                      label="Hasil Ringkas"
                      value={item.hasilRingkas}
                    />
                  )}
                </div>
              )}

              {/* AUDIT PENCATATAN */}
              <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Riwayat Pencatatan
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <AuditItem
                    icon={<UserRound className="size-4" />}
                    label="Dicatat oleh"
                    value={
                      item.createdBy
                        ? `${item.createdBy.nama} (${formatRole(
                            item.createdBy.role,
                          )})`
                        : '-'
                    }
                    description={formatDateTime(item.createdAt)}
                  />

                  <AuditItem
                    icon={<Clock3 className="size-4" />}
                    label={
                      item.updatedAt !== item.createdAt
                        ? 'Terakhir diubah oleh'
                        : 'Terakhir diperbarui'
                    }
                    value={
                      item.updatedBy
                        ? `${item.updatedBy.nama} (${formatRole(
                            item.updatedBy.role,
                          )})`
                        : '-'
                    }
                    description={formatDateTime(item.updatedAt)}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function RiwayatHeader({ count }: { count: number | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <History className="size-4 text-slate-400" />

        <div>
          <div className="text-sm font-semibold text-slate-800">
            Riwayat Kesehatan
          </div>

          <p className="mt-0.5 text-xs text-slate-500">
            Pemeriksaan kesehatan warga dari event sebelumnya.
          </p>
        </div>
      </div>

      {count !== null && (
        <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
          {count.toLocaleString('id-ID')} pemeriksaan
        </span>
      )}
    </div>
  )
}

function Item({
  label,
  value,
  suffix,
}: {
  label: string
  value: string
  suffix?: string
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
        <Activity className="size-3" />

        {label}
      </div>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-sm font-semibold tabular-nums text-slate-900">
          {value}
        </span>

        {suffix && <span className="text-[11px] text-slate-400">{suffix}</span>}
      </div>
    </div>
  )
}

function CatatanItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3.5 py-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <ClipboardList className="size-3.5" />
        {label}
      </div>

      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {value}
      </p>
    </div>
  )
}

function AuditItem({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode
  label: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-400">{label}</div>

          <div className="mt-1 truncate text-sm font-semibold text-slate-800">
            {value}
          </div>

          <div className="mt-0.5 text-xs text-slate-500">{description}</div>
        </div>
      </div>
    </div>
  )
}

function formatTanggal(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

function formatRole(role: 'ADMIN' | 'PETUGAS') {
  return role === 'ADMIN' ? 'Administrator' : 'Petugas'
}

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
