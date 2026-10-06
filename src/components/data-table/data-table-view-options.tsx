import type { Table as TanStackTable } from '@tanstack/react-table'
import { SlidersHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Props<TData> = {
  table: TanStackTable<TData>
}

export function DataTableViewOptions<TData>({ table }: Props<TData>) {
  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== 'undefined' && column.getCanHide(),
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <SlidersHorizontal className="size-4" />
          Kolom
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Tampilkan kolom</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
          >
            {getColumnLabel(column.id)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getColumnLabel(id: string) {
  const labels: Record<string, string> = {
    kepalaKeluarga: 'Kepala Keluarga',

    alamat: 'Alamat',

    wilayah: 'Wilayah',

    jumlahAnggota: 'Anggota',

    createdAt: 'Tanggal Dibuat',
  }

  return labels[id] ?? id
}
