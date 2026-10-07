import type { ReactNode } from 'react'

import { DataPagination } from './data-pagination'

import type { DataPaginationState, PageSize } from './data-pagination'

type Props = {
  children: ReactNode

  pagination: DataPaginationState

  onPageChange: (page: number) => void

  onPageSizeChange: (size: PageSize) => void
}

export function DataListCard({
  children,
  pagination,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-blue-100/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="p-4 sm:p-5">{children}</div>

      <div className="border-t border-blue-100/70 bg-slate-50/50 px-4 py-4 sm:px-5">
        <DataPagination
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </section>
  )
}
