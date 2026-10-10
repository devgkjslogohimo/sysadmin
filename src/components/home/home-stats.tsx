import { Link } from '@tanstack/react-router'

import type { ReactNode } from 'react'

import {
  ArrowRight,
  CalendarHeart,
  IdCard,
  Stethoscope,
  UsersRound,
} from 'lucide-react'

type HomeStatsData = {
  totalKK: number
  totalAnggota: number
  eventAktif: number
  totalEvent: number
  totalPemeriksaan: number
}

type HomeStatsProps = {
  stats: HomeStatsData
}

type StatRoute = '/data-kk' | '/data-anggota' | '/event-kesehatan'

type StatCardProps = {
  icon: ReactNode
  label: string
  value: number
  description: string
  to: StatRoute
}

export function HomeStats({ stats }: HomeStatsProps) {
  return (
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
          description={`${stats.totalEvent.toLocaleString('id-ID')} total event`}
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
  )
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
