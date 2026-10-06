import { Link } from '@tanstack/react-router'

import type { ColumnDef } from '@tanstack/react-table'

import { ChevronRight, MapPin, MoreHorizontal, Users } from 'lucide-react'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

import { Badge } from '@/components/ui/badge'

import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { AnggotaListItem } from './types'

export const anggotaColumns: ColumnDef<AnggotaListItem>[] = [
  {
    accessorKey: 'nama',

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),

    cell: ({ row }) => (
      <div className="min-w-[190px]">
        <div className="font-semibold text-slate-900">{row.original.nama}</div>

        <div className="mt-1 text-xs text-muted-foreground">
          Anggota #{row.original.no}
        </div>
      </div>
    ),
  },

  {
    accessorKey: 'nik',

    enableSorting: false,

    header: 'NIK',

    cell: ({ row }) => (
      <code className="whitespace-nowrap rounded-md bg-slate-100 px-2 py-1 font-mono text-xs">
        {row.original.nik}
      </code>
    ),
  },

  {
    accessorKey: 'jenisKelamin',

    enableSorting: false,

    header: 'Jenis Kelamin',

    cell: ({ row }) =>
      row.original.jenisKelamin ? (
        <Badge variant="outline" className="whitespace-nowrap">
          {row.original.jenisKelamin}
        </Badge>
      ) : (
        '-'
      ),
  },

  {
    id: 'lahir',

    enableSorting: false,

    header: 'Tempat / Tgl. Lahir',

    cell: ({ row }) => (
      <div className="min-w-[160px]">
        <div>{row.original.tempatLahir ?? '-'}</div>

        <div className="mt-1 text-xs text-muted-foreground">
          {row.original.tanggalLahir ?? '-'}
        </div>
      </div>
    ),
  },

  {
    id: 'kepalaKeluarga',

    accessorFn: (row) => row.kepalaKeluarga ?? '',

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kepala Keluarga" />
    ),

    cell: ({ row }) => (
      <div className="min-w-[180px]">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-muted-foreground" />

          <Link
            to="/data-kk/$id"
            params={{
              id: String(row.original.kkId),
            }}
            className="font-medium hover:text-primary"
          >
            {row.original.kepalaKeluarga ?? '-'}
          </Link>
        </div>
      </div>
    ),
  },

  {
    id: 'alamat',

    accessorFn: (row) => row.alamat ?? '',

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Alamat" />
    ),

    cell: ({ row }) => (
      <div className="flex min-w-[230px] items-start gap-2">
        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <div>
          <div className="font-medium">{row.original.alamat ?? '-'}</div>

          <div className="mt-1 text-xs text-muted-foreground">
            {row.original.desaKelurahan ?? '-'}
            {' · '}
            {row.original.kecamatan ?? '-'}
          </div>
        </div>
      </div>
    ),
  },

  {
    id: 'actions',

    enableSorting: false,

    enableHiding: false,

    cell: ({ row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />

              <span className="sr-only">Buka menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                to="/data-kk/$id"
                params={{
                  id: String(row.original.kkId),
                }}
              >
                <ChevronRight className="size-4" />
                Buka KK
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]
