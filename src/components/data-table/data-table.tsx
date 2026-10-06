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

import { Search, X } from 'lucide-react'

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

  sorting: SortingState

  onSearchChange: (value: string) => void

  onSearchModeChange: (value: string) => void

  onSortingChange: OnChangeFn<SortingState>
}

export function DataTable<TData>({
  columns,
  data,

  searchValue,
  searchMode,
  searchOptions,

  sorting,

  onSearchChange,
  onSearchModeChange,

  onSortingChange,
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

  function clearSearch() {
    setQuery('')

    onSearchChange('')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-2xl">
          <Select value={searchMode} onValueChange={onSearchModeChange}>
            <SelectTrigger className="w-full shrink-0 sm:w-37.5">
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
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              className="w-full pl-9 pr-9"
            />

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Hapus pencarian"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <DataTableViewOptions table={table} />
      </div>

      {searchMode === 'nik' && (
        <p className="-mt-1 text-xs text-muted-foreground">
          Pencarian NIK menggunakan nomor lengkap.
        </p>
      )}

      <div className="overflow-hidden rounded-xl border bg-background">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-slate-50/80 hover:bg-slate-50/80"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
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
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="align-top">
                        {flexRender(
                          cell.column.columnDef.cell,

                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleLeafColumns().length}
                    className="h-40 text-center"
                  >
                    <div className="font-medium">Data tidak ditemukan</div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Coba ubah kata pencarian atau pilihan pencarian.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
