import type { Column } from '@tanstack/react-table'

import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Props<TData, TValue> = {
  column: Column<TData, TValue>

  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: Props<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className="font-semibold">{title}</span>
  }

  const sorted = column.getIsSorted()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="-ml-1 inline-flex h-8 items-center gap-1 rounded-md px-1 text-xs font-semibold text-slate-600 transition hover:text-slate-900"
        >
          {title}

          {sorted === 'desc' ? (
            <ArrowDown className="size-3.5 text-blue-600" />
          ) : sorted === 'asc' ? (
            <ArrowUp className="size-3.5 text-blue-600" />
          ) : (
            <ChevronsUpDown className="size-3.5 text-slate-400" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUp className="size-4" />
          Urut naik
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDown className="size-4" />
          Urut turun
        </DropdownMenuItem>

        {column.getCanHide() && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="size-4" />
              Sembunyikan
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
