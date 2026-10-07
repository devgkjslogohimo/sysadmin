import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import type {
  ColumnDef,
  OnChangeFn,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

import { Search, SearchX, X } from 'lucide-react'

import { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { DataTableViewOptions } from './data-table-view-options'

export type DataTableSearchOption = {
  value: string
  label: string
  placeholder?: string
}

type Props<TData> = {
  columns: ColumnDef<TData>[]
  data: TData[]

  searchValue: string
  searchMode: string

  searchOptions: DataTableSearchOption[]

  columnLabels?: Partial<Record<string, string>>

  sorting: SortingState

  onSearchChange: (value: string) => void

  onSearchModeChange: (value: string) => void

  onSortingChange: OnChangeFn<SortingState>

  emptyTitle?: string
  emptyDescription?: string
}

export function DataTable<TData>({
  columns,
  data,

  searchValue,
  searchMode,
  searchOptions,

  columnLabels,

  sorting,

  onSearchChange,
  onSearchModeChange,
  onSortingChange,

  emptyTitle = 'Data tidak ditemukan',
  emptyDescription = 'Coba ubah kata pencarian atau pilihan pencarian.',
}: Props<TData>) {
  const [query, setQuery] = useState(searchValue)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  useEffect(() => {
    setQuery(searchValue)
  }, [searchValue])

  useEffect(() => {
    if (query === searchValue) {
      return
    }

    const timeout = window.setTimeout(() => {
      onSearchChange(query)
    }, 400)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [query, searchValue, onSearchChange])

  const table = useReactTable({
    data,
    columns,

    manualSorting: true,

    state: {
      sorting,
      columnVisibility,
    },

    onSortingChange,

    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),
  })

  const currentSearchOption = searchOptions.find(
    (option) => option.value === searchMode,
  )

  const placeholder = currentSearchOption?.placeholder ?? 'Cari data...'

  const hasSearch = searchValue.trim().length > 0

  function clearSearch() {
    setQuery('')

    onSearchChange('')
  }

  return (
    <div>
      {/* TOOLBAR */}
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row xl:max-w-3xl">
          <Select value={searchMode} onValueChange={onSearchModeChange}>
            <SelectTrigger
              className="
    w-full shrink-0
    rounded-lg border-slate-200 bg-white
    shadow-none
    data-[size=default]:h-10
    sm:w-40
  "
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {searchOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              className="
    h-10
    w-full
    rounded-lg
    border-slate-200
    bg-white
    pl-9
    pr-10
    shadow-none
  "
            />

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Hapus pencarian"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <DataTableViewOptions table={table} columnLabels={columnLabels} />
      </div>

      {searchMode === 'nik' && (
        <div className="-mt-2 mb-4 text-xs text-slate-400">
          Pencarian NIK menggunakan nomor lengkap.
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 whitespace-nowrap px-4 text-xs font-semibold text-slate-600"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,

                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-slate-100 transition-colors hover:bg-slate-50/70"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 align-top">
                      {flexRender(
                        cell.column.columnDef.cell,

                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-56"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <SearchX className="size-5" />
                    </div>

                    <div className="mt-4 font-semibold text-slate-800">
                      {emptyTitle}
                    </div>

                    <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                      {emptyDescription}
                    </p>

                    {hasSearch && (
                      <button
                        type="button"
                        className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                        onClick={clearSearch}
                      >
                        Hapus pencarian
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
