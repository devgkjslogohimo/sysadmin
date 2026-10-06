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

type Props = {
  members: KKMemberView[]
  sensitiveVisible: boolean

  getNik: (memberNo: number, maskedNik: string) => string
}

export function KKMembersCard({ members, sensitiveVisible, getNik }: Props) {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-white px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100">
              <Users className="size-4 text-slate-600" />
            </div>

            <div>
              <CardTitle className="text-base">Anggota Keluarga</CardTitle>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Daftar anggota yang terdaftar pada KK ini
              </p>
            </div>
          </div>

          <Badge variant="secondary" className="rounded-full px-3">
            {members.length} orang
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <DesktopMembersTable
          members={members}
          sensitiveVisible={sensitiveVisible}
          getNik={getNik}
        />

        <div className="divide-y md:hidden">
          {members.map((member) => (
            <KKMemberMobile
              key={member.id}
              member={member}
              nik={getNik(member.no, member.nik)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DesktopMembersTable({ members, sensitiveVisible, getNik }: Props) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead className="w-14 pl-6">No</TableHead>

            <TableHead className="min-w-[210px]">Nama Lengkap</TableHead>

            <TableHead className="min-w-[180px]">NIK</TableHead>

            <TableHead className="min-w-[130px]">Jenis Kelamin</TableHead>

            <TableHead className="min-w-[180px]">Tempat / Tgl. Lahir</TableHead>

            <TableHead>Agama</TableHead>

            <TableHead className="min-w-[210px]">Pendidikan</TableHead>

            <TableHead className="min-w-[180px]">Pekerjaan</TableHead>

            <TableHead className="min-w-[110px] pr-6">Gol. Darah</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="pl-6 text-muted-foreground">
                <div className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold">
                  {member.no}
                </div>
              </TableCell>

              <TableCell>
                <div className="font-semibold text-slate-900">
                  {member.nama}
                </div>
              </TableCell>

              <TableCell>
                <code
                  className={
                    sensitiveVisible
                      ? 'rounded-md bg-amber-50 px-2 py-1 font-mono text-xs text-amber-900'
                      : 'rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700'
                  }
                >
                  {getNik(member.no, member.nik)}
                </code>
              </TableCell>

              <TableCell>
                <GenderBadge value={member.jenisKelamin} />
              </TableCell>

              <TableCell>
                <div className="font-medium">{member.tempatLahir ?? '-'}</div>

                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />

                  {member.tanggalLahir ?? '-'}
                </div>
              </TableCell>

              <TableCell>{member.agama ?? '-'}</TableCell>

              <TableCell className="max-w-[260px]">
                {member.pendidikan ?? '-'}
              </TableCell>

              <TableCell>{member.pekerjaan ?? '-'}</TableCell>

              <TableCell className="pr-6">
                {member.golonganDarah ?? '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
