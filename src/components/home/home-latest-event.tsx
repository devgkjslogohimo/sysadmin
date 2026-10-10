import { Link } from '@tanstack/react-router'

import { ArrowRight, HeartPulse } from 'lucide-react'

import { Button } from '@/components/ui/button'

type LatestEvent = {
  id: number
  nama: string
  tanggal: string
  lokasi: string | null
  isClosed: boolean
  jumlahPemeriksaan: number
}

type HomeLatestEventProps = {
  event: LatestEvent | null
}

export function HomeLatestEvent({ event }: HomeLatestEventProps) {
  if (!event) {
    return null
  }

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <HeartPulse className="size-4" />
          </div>

          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-400">
              Event Kesehatan Terbaru
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <div className="font-semibold text-slate-900">{event.nama}</div>

              <span
                className={[
                  'rounded-full px-2 py-0.5 text-[10px] font-medium',
                  event.isClosed
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-emerald-50 text-emerald-700',
                ].join(' ')}
              >
                {event.isClosed ? 'Selesai' : 'Aktif'}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>{formatTanggal(event.tanggal)}</span>

              {event.lokasi && <span>{event.lokasi}</span>}

              <span>
                {event.jumlahPemeriksaan.toLocaleString('id-ID')} pemeriksaan
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-10 shrink-0 border-slate-200 bg-white px-4 shadow-none"
          asChild
        >
          <Link
            to="/event-kesehatan/$id"
            params={{
              id: String(event.id),
            }}
            preload="intent"
          >
            Buka Event
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
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
