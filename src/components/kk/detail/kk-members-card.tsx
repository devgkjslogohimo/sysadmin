import { CalendarDays, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { GenderBadge } from './gender-badge'
import { KKMemberMobile } from './kk-member-mobile'

import type { KKMemberView } from './types'
import { Link } from '@tanstack/react-router'

type Props = {
  members: KKMemberView[]
  sensitiveVisible: boolean

  getNik: (memberNo: number, maskedNik: string) => string
}

export function KKMembersCard({ members, sensitiveVisible, getNik }: Props) {
  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="size-4" />
            </div>

            <div className="min-w-0">
              <CardTitle className="text-base font-semibold text-slate-900">
                Anggota Keluarga
              </CardTitle>

              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                Daftar anggota yang terdaftar pada Kartu Keluarga ini
              </p>
            </div>
          </div>

          <Badge
            variant="secondary"
            className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
          >
            {members.length.toLocaleString('id-ID')} orang
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {members.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <Users className="size-4" />
            </div>

            <div className="mt-3 text-sm font-semibold text-slate-700">
              Belum ada anggota keluarga
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Data anggota keluarga belum tersedia pada Kartu Keluarga ini.
            </p>
          </div>
        ) : (
          <>
            <DesktopMembersTable
              members={members}
              sensitiveVisible={sensitiveVisible}
              getNik={getNik}
            />

            <div className="divide-y divide-slate-100 md:hidden">
              {members.map((member) => (
                <KKMemberMobile
                  key={member.id}
                  member={member}
                  nik={getNik(member.no, member.nik)}
                  sensitiveVisible={sensitiveVisible}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function DesktopMembersTable({ members, sensitiveVisible, getNik }: Props) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 bg-slate-50/70 hover:bg-slate-50/70">
            <TableHead className="w-16 pl-6 text-xs font-semibold text-slate-500">
              No
            </TableHead>

            <TableHead className="min-w-52.5 text-xs font-semibold text-slate-500">
              Nama Lengkap
            </TableHead>

            <TableHead className="min-w-45 text-xs font-semibold text-slate-500">
              NIK
            </TableHead>

            <TableHead className="min-w-32.5 text-xs font-semibold text-slate-500">
              Jenis Kelamin
            </TableHead>

            <TableHead className="min-w-47.5 text-xs font-semibold text-slate-500">
              Tempat / Tgl. Lahir
            </TableHead>

            <TableHead className="min-w-27.5 text-xs font-semibold text-slate-500">
              Agama
            </TableHead>

            <TableHead className="min-w-52.5 text-xs font-semibold text-slate-500">
              Pendidikan
            </TableHead>

            <TableHead className="min-w-45 text-xs font-semibold text-slate-500">
              Pekerjaan
            </TableHead>

            <TableHead className="min-w-27.5 text-xs font-semibold text-slate-500">
              Gol. Darah
            </TableHead>

            <TableHead className="min-w-40 text-xs font-semibold text-slate-500">
              Ayah
            </TableHead>

            <TableHead className="min-w-40 text-xs font-semibold text-slate-500">
              Ibu
            </TableHead>

            <TableHead className="min-w-40 text-xs font-semibold text-slate-500">
              Domisili
            </TableHead>

            <TableHead className="min-w-35 text-xs font-semibold text-slate-500">
              Baptis Anak
            </TableHead>

            <TableHead className="min-w-45 text-xs font-semibold text-slate-500">
              Sidi / Baptis Dewasa
            </TableHead>

            <TableHead className="min-w-35 pr-6 text-xs font-semibold text-slate-500">
              Menikah
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {members.map((member) => (
            <TableRow
              key={member.id}
              className="border-slate-100 transition-colors hover:bg-slate-50/60"
            >
              <TableCell className="pl-6">
                <div className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold tabular-nums text-slate-500">
                  {member.no}
                </div>
              </TableCell>

              <TableCell>
                <Link
                  to="/data-anggota/$id"
                  params={{
                    id: String(member.id),
                  }}
                  preload="intent"
                  className="font-semibold text-slate-900 transition-colors hover:text-blue-600 hover:underline hover:underline-offset-4"
                >
                  {member.nama}
                </Link>
              </TableCell>

              <TableCell>
                <code
                  className={[
                    'inline-flex rounded-md px-2 py-1 font-mono text-xs font-medium tabular-nums',
                    sensitiveVisible
                      ? 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200'
                      : 'bg-slate-100 text-slate-600',
                  ].join(' ')}
                >
                  {getNik(member.no, member.nik)}
                </code>
              </TableCell>

              <TableCell>
                <GenderBadge value={member.jenisKelamin} />
              </TableCell>

              <TableCell>
                <div className="text-sm font-medium text-slate-700">
                  {member.tempatLahir ?? '-'}
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <CalendarDays className="size-3.5 shrink-0" />

                  {member.tanggalLahir ?? '-'}
                </div>
              </TableCell>

              <TableCell className="text-sm text-slate-700">
                {member.agama ?? '-'}
              </TableCell>

              <TableCell className="max-w-65 text-sm text-slate-700">
                {member.pendidikan ?? '-'}
              </TableCell>

              <TableCell className="text-sm text-slate-700">
                {member.pekerjaan ?? '-'}
              </TableCell>

              <TableCell className="text-sm font-medium text-slate-700">
                {member.golonganDarah ?? '-'}
              </TableCell>

              <TableCell className="text-sm text-slate-700">
                {member.ayah ?? '-'}
              </TableCell>

              <TableCell className="text-sm text-slate-700">
                {member.ibu ?? '-'}
              </TableCell>

              <TableCell className="text-sm text-slate-700">
                {member.domisili ?? '-'}
              </TableCell>

              <TableCell className="text-sm text-slate-700">
                {member.baptisAnak ?? '-'}
              </TableCell>

              <TableCell className="text-sm text-slate-700">
                {member.sidiBaptisDewasa ?? '-'}
              </TableCell>

              <TableCell className="pr-6 text-sm text-slate-700">
                {member.menikah ?? '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
