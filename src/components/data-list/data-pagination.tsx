import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type DataPaginationState = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type PageSize = 10 | 20 | 50 | 100

type Props = {
  pagination: DataPaginationState

  onPageChange: (page: number) => void

  onPageSizeChange: (size: PageSize) => void
}

export function DataPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.max(pagination.totalPages, 1)

  const from =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1

  const to = Math.min(
    pagination.page * pagination.limit,

    pagination.total,
  )

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs text-slate-500">
        Menampilkan <strong>{from}</strong>
        {' – '}
        <strong>{to}</strong>
        {' dari '}
        <strong>{pagination.total.toLocaleString('id-ID')}</strong> data
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-xs text-slate-500">
            Baris
          </span>

          <Select
            value={String(pagination.limit)}
            onValueChange={(value) => {
              const size = Number(value)

              if (size === 10 || size === 20 || size === 50 || size === 100) {
                onPageSizeChange(size)
              }
            }}
          >
            <SelectTrigger className="h-9 w-20 bg-white">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="10">10</SelectItem>

              <SelectItem value="20">20</SelectItem>

              <SelectItem value="50">50</SelectItem>

              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="whitespace-nowrap text-xs text-slate-500">
          Halaman <strong>{pagination.page}</strong>
          {' dari '}
          <strong>{totalPages}</strong>
        </span>

        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={pagination.page >= totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
