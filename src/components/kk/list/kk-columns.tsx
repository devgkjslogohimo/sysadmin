import type { ColumnDef } from '@tanstack/react-table'

import { ChevronRight, MapPin, MoreHorizontal, Users } from 'lucide-react'

import { Link } from '@tanstack/react-router'

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

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

import type { KKListItem } from './types'

export const kkColumns: ColumnDef<KKListItem>[] = [
  {
    accessorKey: 'kepalaKeluarga',

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kepala Keluarga" />
    ),

    cell: ({ row }) => {
      const item = row.original

      return (
        <div className="min-w-[190px]">
          <Link
            to="/data-kk/$id"
            params={{
              id: String(item.id),
            }}
            className="font-semibold text-slate-900 transition-colors hover:text-primary"
          >
            {item.kepalaKeluarga ?? '-'}
          </Link>

          <div className="mt-1 text-xs text-muted-foreground">
            ID #{item.id}
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: 'alamat',

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Alamat" />
    ),

    cell: ({ row }) => {
      const item = row.original

      return (
        <div className="min-w-[210px]">
          <div className="font-medium">{item.alamat ?? '-'}</div>

          {(item.rt || item.rw) && (
            <div className="mt-1 text-xs text-muted-foreground">
              RT {item.rt ?? '-'}
              {' / '}
              RW {item.rw ?? '-'}
            </div>
          )}
        </div>
      )
    },
  },

  {
    id: 'wilayah',

    accessorFn: (row) =>
      [row.desaKelurahan, row.kecamatan, row.kabupatenKota, row.provinsi]
        .filter(Boolean)
        .join(' '),

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wilayah" />
    ),

    cell: ({ row }) => {
      const item = row.original

      return (
        <div className="flex min-w-[220px] items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <div className="font-medium">{item.desaKelurahan ?? '-'}</div>

            <div className="mt-1 text-xs text-muted-foreground">
              {item.kecamatan ?? '-'}
              {' · '}
              {item.kabupatenKota ?? '-'}
            </div>
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: 'jumlahAnggota',

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Anggota" />
    ),

    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className="gap-1.5 whitespace-nowrap rounded-full"
      >
        <Users className="size-3" />
        {row.original.jumlahAnggota} orang
      </Badge>
    ),
  },

  {
    accessorKey: 'createdAt',

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dibuat" />
    ),

    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm">
        {formatDate(row.original.createdAt)}
      </span>
    ),

    sortingFn: (rowA, rowB) =>
      new Date(rowA.original.createdAt).getTime() -
      new Date(rowB.original.createdAt).getTime(),
  },

  {
    id: 'actions',

    enableSorting: false,
    enableHiding: false,

    cell: ({ row }) => {
      const item = row.original

      return (
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
                    id: String(item.id),
                  }}
                >
                  <ChevronRight className="size-4" />
                  Buka Detail
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
