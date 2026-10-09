import { CalendarDays } from 'lucide-react'

import { GenderBadge } from './gender-badge'

import type { KKMemberView } from './types'

type Props = {
  member: KKMemberView
  nik: string
  sensitiveVisible: boolean
}

export function KKMemberMobile({ member, nik, sensitiveVisible }: Props) {
  return (
    <article className="px-5 py-5">
      {/* IDENTITAS */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-slate-400">
            Anggota #{member.no}
          </div>

          <div className="mt-1 truncate text-base font-semibold text-slate-900">
            {member.nama}
          </div>
        </div>

        <GenderBadge value={member.jenisKelamin} />
      </div>

      {/* NIK */}
      <div
        className={[
          'mt-4 rounded-xl border px-3.5 py-3',
          sensitiveVisible
            ? 'border-amber-200 bg-amber-50/70'
            : 'border-slate-200 bg-slate-50',
        ].join(' ')}
      >
        <div
          className={[
            'text-[11px] font-medium',
            sensitiveVisible ? 'text-amber-700' : 'text-slate-400',
          ].join(' ')}
        >
          NIK
        </div>

        <div
          className={[
            'mt-1 break-all font-mono text-sm font-semibold tabular-nums',
            sensitiveVisible ? 'text-amber-900' : 'text-slate-700',
          ].join(' ')}
        >
          {nik}
        </div>
      </div>

      {/* DATA PRIBADI */}
      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4">
        <MobileInfo label="Tempat Lahir" value={member.tempatLahir} />

        <div>
          <div className="text-xs font-medium text-slate-400">
            Tanggal Lahir
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <CalendarDays className="size-3.5 shrink-0 text-slate-400" />

            {member.tanggalLahir ?? '-'}
          </div>
        </div>

        <MobileInfo label="Agama" value={member.agama} />

        <MobileInfo label="Gol. Darah" value={member.golonganDarah} />

        <div className="col-span-2 border-t border-slate-100 pt-4">
          <MobileInfo label="Pendidikan" value={member.pendidikan} />
        </div>

        <div className="col-span-2">
          <MobileInfo label="Pekerjaan" value={member.pekerjaan} />
        </div>

        <div className="col-span-2 mt-1 border-t border-slate-100 pt-4">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Keluarga & Data Gerejawi
          </div>
        </div>

        <MobileInfo label="Ayah" value={member.ayah} />

        <MobileInfo label="Ibu" value={member.ibu} />

        <MobileInfo label="Domisili" value={member.domisili} />

        <MobileInfo label="Baptis Anak" value={member.baptisAnak} />

        <MobileInfo
          label="Sidi / Baptis Dewasa"
          value={member.sidiBaptisDewasa}
        />

        <MobileInfo label="Menikah" value={member.menikah} />
      </div>
    </article>
  )
}

function MobileInfo({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="min-w-0">
      <div className="text-xs font-medium text-slate-400">{label}</div>

      <div className="mt-1 text-sm font-medium leading-6 text-slate-700">
        {value || '-'}
      </div>
    </div>
  )
}
