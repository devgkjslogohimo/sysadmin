import type { Table as TanStackTable } from '@tanstack/react-table'

import { Columns3 } from 'lucide-react'

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

  columnLabels?: Partial<Record<string, string>>
}

export function DataTableViewOptions<TData>({
  table,
  columnLabels = {},
}: Props<TData>) {
  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== 'undefined' && column.getCanHide(),
    )

  if (columns.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="
    h-10
    w-full
    rounded-lg
    border-slate-200
    bg-white
    px-3
    text-slate-600
    shadow-none
    sm:w-auto
  "
        >
          <Columns3 className="size-4" />
          Kolom
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Tampilkan kolom</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
          >
            {columnLabels[column.id] ?? column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
