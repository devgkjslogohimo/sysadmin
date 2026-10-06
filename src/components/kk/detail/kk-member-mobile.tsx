import type { KKMemberView } from './types'
import { GenderBadge } from './gender-badge'

type Props = {
  member: KKMemberView
  nik: string
}

export function KKMemberMobile({ member, nik }: Props) {
  return (
    <div className="space-y-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground">
            Anggota #{member.no}
          </div>

          <div className="mt-1 font-semibold">{member.nama}</div>
        </div>

        <GenderBadge value={member.jenisKelamin} />
      </div>

      <div className="rounded-lg bg-slate-50 p-3">
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          NIK
        </div>

        <div className="font-mono text-sm">{nik}</div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
        <MobileInfo label="Tempat Lahir" value={member.tempatLahir} />

        <MobileInfo label="Tanggal Lahir" value={member.tanggalLahir} />

        <MobileInfo label="Agama" value={member.agama} />

        <MobileInfo label="Gol. Darah" value={member.golonganDarah} />

        <div className="col-span-2">
          <MobileInfo label="Pendidikan" value={member.pendidikan} />
        </div>

        <div className="col-span-2">
          <MobileInfo label="Pekerjaan" value={member.pekerjaan} />
        </div>
      </div>
    </div>
  )
}

function MobileInfo({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>

      <div className="font-medium">{value ?? '-'}</div>
    </div>
  )
}
