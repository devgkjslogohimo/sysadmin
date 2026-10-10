import { Link } from '@tanstack/react-router'

import {
  ArrowRight,
  Database,
  HeartPulse,
  IdCard,
  ShieldCheck,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export function HomeHero() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-1 bg-linear-to-r from-blue-600 via-blue-500 to-sky-400" />

      <div className="grid gap-8 px-5 py-7 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)] lg:items-center lg:px-8 lg:py-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            <Database className="size-4" />
            Sistem Data Jemaat
          </div>

          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Pengelolaan data jemaat dalam satu sistem
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Kelola data Kartu Keluarga, anggota jemaat, pemeriksaan kesehatan,
            dan proses input data secara terstruktur.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button className="h-11 px-5" asChild>
              <Link to="/data-kk" preload="intent">
                <IdCard className="size-4" />
                Buka Data KK
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-11 border-slate-200 bg-white px-5 shadow-none"
              asChild
            >
              <Link to="/event-kesehatan" preload="intent">
                <HeartPulse className="size-4" />
                Event Kesehatan
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-white text-blue-600 ring-1 ring-slate-200">
            <ShieldCheck className="size-5" />
          </div>

          <div className="mt-4 text-sm font-semibold text-slate-800">
            Perlindungan data sensitif
          </div>

          <p className="mt-2 text-xs leading-6 text-slate-500">
            Nomor KK dan NIK ditampilkan dalam keadaan terlindungi secara
            default. Data sensitif hanya dibuka ketika diperlukan.
          </p>
        </div>
      </div>
    </section>
  )
}
