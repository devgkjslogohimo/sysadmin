import { createFileRoute, Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import {
  ArrowRight,
  CalendarHeart,
  Database,
  FileJson2,
  HeartPulse,
  IdCard,
  ShieldCheck,
  Stethoscope,
  UserRound,
  UsersRound,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getHomeStats } from '#/server/home/get-home-stats'

export const Route = createFileRoute('/')({
  loader: () => getHomeStats(),

  component: HomePage,
})

function HomePage() {
  const stats = Route.useLoaderData()

  return (
    <main className="bg-slate-50/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* HERO */}
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
                Kelola data Kartu Keluarga, anggota jemaat, pemeriksaan
                kesehatan, dan proses input data secara terstruktur.
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

        {/* STATISTIK */}
        <section className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<IdCard className="size-5" />}
              label="Kartu Keluarga"
              value={stats.totalKK}
              description="Data KK tersimpan"
              to="/data-kk"
            />

            <StatCard
              icon={<UsersRound className="size-5" />}
              label="Total Anggota"
              value={stats.totalAnggota}
              description="Anggota dari seluruh KK"
              to="/data-anggota"
            />

            <StatCard
              icon={<CalendarHeart className="size-5" />}
              label="Event Aktif"
              value={stats.eventAktif}
              description={`${stats.totalEvent.toLocaleString(
                'id-ID',
              )} total event`}
              to="/event-kesehatan"
            />

            <StatCard
              icon={<Stethoscope className="size-5" />}
              label="Pemeriksaan"
              value={stats.totalPemeriksaan}
              description="Pemeriksaan tercatat"
              to="/event-kesehatan"
            />
          </div>
        </section>

        {/* EVENT TERBARU */}
        {stats.latestEvent && (
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
                    <div className="font-semibold text-slate-900">
                      {stats.latestEvent.nama}
                    </div>

                    <span
                      className={[
                        'rounded-full px-2 py-0.5 text-[10px] font-medium',
                        stats.latestEvent.isClosed
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-emerald-50 text-emerald-700',
                      ].join(' ')}
                    >
                      {stats.latestEvent.isClosed ? 'Selesai' : 'Aktif'}
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{formatTanggal(stats.latestEvent.tanggal)}</span>

                    {stats.latestEvent.lokasi && (
                      <span>{stats.latestEvent.lokasi}</span>
                    )}

                    <span>
                      {stats.latestEvent.jumlahPemeriksaan.toLocaleString(
                        'id-ID',
                      )}{' '}
                      pemeriksaan
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
                    id: String(stats.latestEvent.id),
                  }}
                  preload="intent"
                >
                  Buka Event
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </section>
        )}

        {/* MENU UTAMA */}
        <section className="mt-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
              Menu Utama
            </div>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Akses cepat
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Pilih bagian sistem yang ingin digunakan.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MenuCard
              icon={<IdCard className="size-5" />}
              title="Data Kartu Keluarga"
              description="Lihat, cari, dan kelola data Kartu Keluarga beserta anggota keluarga."
              to="/data-kk"
            />

            <MenuCard
              icon={<UserRound className="size-5" />}
              title="Data Anggota"
              description="Lihat data setiap anggota jemaat dan riwayat kesehatannya."
              to="/data-anggota"
            />

            <MenuCard
              icon={<HeartPulse className="size-5" />}
              title="Event Kesehatan"
              description="Kelola event pemeriksaan, petugas, peserta, dan hasil pemeriksaan."
              to="/event-kesehatan"
            />

            <MenuCard
              icon={<FileJson2 className="size-5" />}
              title="Parser Kartu Keluarga"
              description="Ubah teks hasil ekstraksi KK menjadi data terstruktur sebelum disimpan."
              to="/fitur/parser-kk"
            />
          </div>
        </section>

        {/* ALUR KERJA */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UsersRound className="size-4" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Alur Pengelolaan Data
                </h2>

                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  Urutan umum penggunaan sistem.
                </p>
              </div>
            </div>
          </div>

          <div className="grid divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">
            <WorkflowStep
              number="01"
              title="Input Kartu Keluarga"
              description="Masukkan data secara manual atau gunakan Parser KK untuk mempercepat input."
            />

            <WorkflowStep
              number="02"
              title="Kelola Data Anggota"
              description="Periksa identitas anggota dan buka detail setiap anggota dari data KK."
            />

            <WorkflowStep
              number="03"
              title="Pemeriksaan Kesehatan"
              description="Gunakan Event Kesehatan untuk mencatat hasil pemeriksaan dan riwayat warga."
            />
          </div>
        </section>
      </div>
    </main>
  )
}

type StatCardProps = {
  icon: ReactNode
  label: string
  value: number
  description: string
  to: '/data-kk' | '/data-anggota' | '/event-kesehatan'
}

function StatCard({ icon, label, value, description, to }: StatCardProps) {
  return (
    <Link
      to={to}
      preload="intent"
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-[border-color,box-shadow,background-color] duration-200 ease-out hover:border-blue-200 hover:bg-blue-50/10 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <ArrowRight className="size-4 text-slate-300 transition-colors duration-200 ease-out group-hover:text-blue-500" />
      </div>

      <div className="mt-5 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
        {value.toLocaleString('id-ID')}
      </div>

      <div className="mt-1 text-sm font-semibold text-slate-700">{label}</div>

      <div className="mt-1 text-xs text-slate-400">{description}</div>
    </Link>
  )
}

type MenuCardProps = {
  icon: ReactNode
  title: string
  description: string

  to: '/data-kk' | '/data-anggota' | '/event-kesehatan' | '/fitur/parser-kk'
}

function MenuCard({ icon, title, description, to }: MenuCardProps) {
  return (
    <Link
      to={to}
      preload="intent"
      className="group flex min-h-52 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-[border-color,box-shadow,background-color] duration-200 ease-out hover:border-blue-200 hover:bg-blue-50/10 hover:shadow-md"
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-200 ease-out group-hover:bg-blue-100">
        {icon}
      </div>

      <div className="mt-4 text-base font-semibold text-slate-900">{title}</div>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-600">
        Buka menu
        <ArrowRight className="size-4 transition-colors duration-200 ease-out" />
      </div>
    </Link>
  )
}

function WorkflowStep({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="p-5 sm:p-6">
      <div className="text-xs font-bold tracking-[0.14em] text-blue-600">
        {number}
      </div>

      <div className="mt-2 text-sm font-semibold text-slate-800">{title}</div>

      <p className="mt-1.5 text-xs leading-5 text-slate-500">{description}</p>
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
