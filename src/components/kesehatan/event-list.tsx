import { Link } from '@tanstack/react-router'

import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  MapPin,
  UsersRound,
} from 'lucide-react'

type EventItem = {
  id: number
  nama: string
  tanggal: string
  lokasi: string | null
  jumlahPemeriksaan: number
  isClosed: boolean

  petugas: Array<{
    id: number
    nama: string
  }>
}

type Props = {
  events: EventItem[]
}

export function EventList({ events }: Props) {
  if (events.length === 0) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="divide-y divide-slate-100">
        {events.map((event) => (
          <Link
            key={event.id}
            to="/event-kesehatan/$id"
            params={{
              id: String(event.id),
            }}
            className="group block px-4 py-4 transition-colors hover:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 sm:px-5"
          >
            <div className="flex items-start gap-3">
              {/* DATE ICON */}
              <div className="mt-0.5 hidden size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:flex">
                <CalendarDays className="size-4" />
              </div>

              {/* CONTENT */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="min-w-0 truncate font-semibold text-slate-900">
                    {event.nama}
                  </h3>

                  {event.isClosed ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      <CheckCircle2 className="size-3" />
                      Selesai
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Aktif
                    </span>
                  )}
                </div>

                {/* META */}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 sm:hidden" />

                    {formatTanggal(event.tanggal)}
                  </span>

                  {event.lokasi && (
                    <span className="flex min-w-0 items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" />

                      <span className="truncate">{event.lokasi}</span>
                    </span>
                  )}
                </div>

                {/* PETUGAS */}
                <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                  <UsersRound className="size-3.5 shrink-0" />

                  <span className="truncate">
                    {formatPetugas(event.petugas)}
                  </span>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex shrink-0 items-center gap-2 self-center">
                <div className="hidden items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 sm:flex">
                  <ClipboardList className="size-3.5 text-slate-400" />

                  {event.jumlahPemeriksaan.toLocaleString('id-ID')}

                  <span className="hidden lg:inline">pemeriksaan</span>
                </div>

                <ChevronRight className="size-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
              </div>
            </div>

            {/* MOBILE COUNT */}
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500 sm:hidden">
              <ClipboardList className="size-3.5" />
              {event.jumlahPemeriksaan.toLocaleString('id-ID')} pemeriksaan
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function formatPetugas(petugas: EventItem['petugas']) {
  if (petugas.length === 0) {
    return 'Belum ada petugas'
  }

  const visible = petugas
    .slice(0, 3)
    .map((item) => item.nama)
    .join(', ')

  const remaining = petugas.length - 3

  if (remaining <= 0) {
    return `Petugas: ${visible}`
  }

  return `Petugas: ${visible} +${remaining} lainnya`
}

function formatTanggal(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}
