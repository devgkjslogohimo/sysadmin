import { Link } from '@tanstack/react-router'

import type { ReactNode } from 'react'

import {
  ArrowRight,
  FileJson2,
  FileSpreadsheet,
  HeartPulse,
  IdCard,
  UserRound,
} from 'lucide-react'

type MenuRoute =
  | '/data-kk'
  | '/data-anggota'
  | '/event-kesehatan'
  | '/fitur/parser-kk'
  | '/fitur/import-excel'

type MenuCardProps = {
  icon: ReactNode
  title: string
  description: string
  to: MenuRoute
}

export function HomeMenu() {
  return (
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

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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

        <MenuCard
          icon={<FileSpreadsheet className="size-5" />}
          title="Import Excel"
          description="Import banyak data Kartu Keluarga dan anggota jemaat sekaligus dari Excel."
          to="/fitur/import-excel"
        />
      </div>
    </section>
  )
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
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
