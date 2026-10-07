import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Search,
  Stethoscope,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { PemeriksaanForm } from '@/components/kesehatan/pemeriksaan-form'
import { DataPagination } from '@/components/data-list/data-pagination'

import type { PageSize } from '@/components/data-list/data-pagination'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { usePemeriksaanEvent } from '@/components/kesehatan/use-pemeriksaan-event'

import type { PemeriksaanEventItem } from '@/components/kesehatan/use-pemeriksaan-event'

type PetugasEventItem = {
  id: number
  nama: string
}

type Props = {
  eventId: number

  refreshKey: number
  readOnly?: boolean

  onChanged: () => void | Promise<void>
}

export function DaftarPemeriksaanEvent({
  eventId,
  refreshKey,
  readOnly = false,
  onChanged,
}: Props) {
  const { data, isLoading } = usePemeriksaanEvent({
    eventId,
    refreshKey,
  })

  const [q, setQ] = useState('')

  const [page, setPage] = useState(1)

  const [limit, setLimit] = useState<PageSize>(10)

  const [expandedId, setExpandedId] = useState<number | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    if (readOnly) {
      setEditingId(null)
    }
  }, [readOnly])

  const filteredData = useMemo(() => {
    const query = q.trim().toLowerCase()

    if (!query) {
      return data
    }

    return data.filter((item) => {
      const searchable = [item.nama, item.nik]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchable.includes(query)
    })
  }, [data, q])

  const total = filteredData.length

  const totalPages = Math.max(Math.ceil(total / limit), 1)

  const safePage = Math.min(page, totalPages)

  const visibleData = filteredData.slice(
    (safePage - 1) * limit,
    safePage * limit,
  )

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  function handleSearchChange(value: string) {
    setQ(value)
    setPage(1)
    setExpandedId(null)
    setEditingId(null)
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage)
    setExpandedId(null)
    setEditingId(null)
  }

  function handlePageSizeChange(nextLimit: PageSize) {
    setLimit(nextLimit)
    setPage(1)
    setExpandedId(null)
    setEditingId(null)
  }

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardContent className="py-10 text-center text-sm text-slate-500">
          Memuat daftar pemeriksaan...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Stethoscope className="size-4" />
            </div>

            <div className="min-w-0">
              <CardTitle className="text-base font-semibold text-slate-900">
                Pemeriksaan Event Ini
              </CardTitle>

              <p className="mt-0.5 text-xs text-slate-500">
                Daftar warga yang sudah diperiksa pada event ini.
              </p>
            </div>
          </div>

          <span className="w-fit shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
            {data.length.toLocaleString('id-ID')} warga
          </span>
        </div>
      </CardHeader>

      {data.length === 0 ? (
        <CardContent className="p-6">
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-200">
              <Stethoscope className="size-4" />
            </div>

            <div className="mt-3 text-sm font-semibold text-slate-700">
              Belum ada pemeriksaan
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Data warga yang sudah diperiksa pada event ini akan muncul di
              sini.
            </p>
          </div>
        </CardContent>
      ) : (
        <>
          {/* TOOLBAR */}
          <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={q}
                placeholder="Cari nama atau NIK..."
                className="h-10 rounded-lg border-slate-200 bg-white pl-9 pr-10 shadow-none"
                onChange={(event) => handleSearchChange(event.target.value)}
              />

              {q && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Hapus pencarian"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {q && (
              <p className="mt-2 text-xs text-slate-500">
                {total.toLocaleString('id-ID')} warga ditemukan
              </p>
            )}
          </div>

          {/* LIST */}
          {visibleData.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {visibleData.map((item) => (
                <PemeriksaanItem
                  key={item.id}
                  item={item}
                  eventId={eventId}
                  petugas={item.petugas}
                  expanded={expandedId === item.id}
                  editing={editingId === item.id}
                  readOnly={readOnly}
                  onToggle={() => {
                    setExpandedId((current) =>
                      current === item.id ? null : item.id,
                    )

                    if (editingId === item.id) {
                      setEditingId(null)
                    }
                  }}
                  onEdit={() => {
                    setExpandedId(item.id)

                    setEditingId(item.id)
                  }}
                  onCancelEdit={() => {
                    setEditingId(null)
                  }}
                  onSaved={async () => {
                    setEditingId(null)

                    await onChanged()
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="text-sm font-semibold text-slate-700">
                Warga tidak ditemukan
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Coba ubah nama atau NIK yang dicari.
              </p>
            </div>
          )}

          {/* PAGINATION */}
          {total > 0 && (
            <div className="border-t border-slate-200 bg-slate-50/60 px-4 py-4 sm:px-5">
              <DataPagination
                pagination={{
                  page: safePage,

                  limit,

                  total,

                  totalPages,
                }}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </>
      )}
    </Card>
  )
}

type PemeriksaanItemProps = {
  item: PemeriksaanEventItem

  eventId: number

  petugas: PetugasEventItem[]

  expanded: boolean
  editing: boolean
  readOnly: boolean

  onToggle: () => void
  onEdit: () => void
  onCancelEdit: () => void

  onSaved: () => void | Promise<void>
}

function PemeriksaanItem({
  item,
  eventId,
  petugas,
  expanded,
  editing,
  readOnly,
  onToggle,
  onEdit,
  onCancelEdit,
  onSaved,
}: PemeriksaanItemProps) {
  const petugasText =
    item.petugas.length > 0
      ? item.petugas.map((value) => value.nama).join(', ')
      : '-'

  return (
    <div className={expanded ? 'bg-slate-50/30' : 'bg-white'}>
      {/* ROW */}
      <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
        <button
          type="button"
          className="grid min-w-0 flex-1 gap-3 text-left sm:grid-cols-[minmax(0,1.5fr)_140px_130px]"
          onClick={onToggle}
        >
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900">
              {item.nama}
            </div>

            <div className="mt-1 truncate text-xs text-slate-500">
              NIK {item.nik}
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="text-[11px] font-medium text-slate-400">
              Tekanan Darah
            </div>

            <div className="mt-1 text-sm font-medium tabular-nums text-slate-700">
              {formatTensi(item.tensiSistolik, item.tensiDiastolik)}
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="text-[11px] font-medium text-slate-400">
              Gula Darah
            </div>

            <div className="mt-1 text-sm font-medium tabular-nums text-slate-700">
              {formatNilai(item.gulaDarah, 'mg/dL')}
            </div>
          </div>
        </button>

        {!readOnly && !editing && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="hidden h-9 rounded-lg border-slate-200 bg-white shadow-none sm:flex"
            onClick={onEdit}
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
        )}

        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="shrink-0"
          onClick={onToggle}
          aria-label={expanded ? 'Tutup detail' : 'Buka detail'}
        >
          {expanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </Button>
      </div>

      {/* MOBILE SUMMARY */}
      <div className="flex gap-4 px-4 pb-3 text-xs text-slate-500 sm:hidden">
        <span>
          Tensi: {formatTensi(item.tensiSistolik, item.tensiDiastolik)}
        </span>

        <span>Gula: {formatNilai(item.gulaDarah, 'mg/dL')}</span>
      </div>

      {/* EXPANDED */}
      {expanded && (
        <div className="border-t border-slate-100 bg-white px-4 py-5 sm:px-5">
          {editing ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
              <PemeriksaanForm
                eventId={eventId}
                anggotaId={item.anggotaId}
                petugas={petugas}
                initialValues={{
                  id: item.id,

                  tensiSistolik: item.tensiSistolik,

                  tensiDiastolik: item.tensiDiastolik,

                  gulaDarah: item.gulaDarah,

                  kolesterol: item.kolesterol,

                  asamUrat: item.asamUrat,

                  beratBadan: item.beratBadan,

                  tinggiBadan: item.tinggiBadan,

                  keluhan: item.keluhan,

                  hasilRingkas: item.hasilRingkas,
                }}
                onCancel={onCancelEdit}
                onSaved={onSaved}
              />
            </div>
          ) : (
            <>
              {!readOnly && (
                <div className="mb-4 flex justify-end sm:hidden">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={onEdit}
                  >
                    <Pencil className="size-3.5" />
                    Edit Pemeriksaan
                  </Button>
                </div>
              )}

              <PemeriksaanDetail item={item} petugasText={petugasText} />
            </>
          )}
        </div>
      )}
    </div>
  )
}

function PemeriksaanDetail({
  item,
  petugasText,
}: {
  item: PemeriksaanEventItem
  petugasText: string
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Metric
          label="Tekanan Darah"
          value={formatTensi(item.tensiSistolik, item.tensiDiastolik)}
        />

        <Metric
          label="Gula Darah"
          value={formatNilai(item.gulaDarah, 'mg/dL')}
        />

        <Metric
          label="Kolesterol"
          value={formatNilai(item.kolesterol, 'mg/dL')}
        />

        <Metric label="Asam Urat" value={formatNilai(item.asamUrat, 'mg/dL')} />

        <Metric
          label="Berat Badan"
          value={formatNilai(item.beratBadan, 'kg')}
        />

        <Metric
          label="Tinggi Badan"
          value={formatNilai(item.tinggiBadan, 'cm')}
        />
      </div>

      <div className="grid gap-4 border-t border-slate-100 pt-4 lg:grid-cols-2">
        <TextDetail label="Keluhan" value={item.keluhan} />

        <TextDetail label="Hasil Ringkas" value={item.hasilRingkas} />
      </div>

      <TextDetail label="Petugas" value={petugasText} />
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3.5 py-3">
      <div className="text-[11px] font-medium text-slate-400">{label}</div>

      <div className="mt-1 text-sm font-semibold tabular-nums text-slate-800">
        {value}
      </div>
    </div>
  )
}

function TextDetail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div className="text-xs font-medium text-slate-400">{label}</div>

      <div className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {value || '-'}
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
