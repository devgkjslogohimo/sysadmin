import { createFileRoute } from '@tanstack/react-router'

import type { SortingState } from '@tanstack/react-table'

import { useCallback } from 'react'

import { KKListEmpty } from '@/components/kk/list/kk-list-empty'
import { KKListHeader } from '@/components/kk/list/kk-list-header'
import { KKListLoading } from '@/components/kk/list/kk-list-loading'
import { KKListPagination } from '@/components/kk/list/kk-list-pagination'
import { KKListTable } from '@/components/kk/list/kk-list-table'

import { listKK } from '@/server/kk.functions'

type PageSize = 10 | 20 | 50 | 100

type SortBy = 'kepalaKeluarga' | 'alamat' | 'jumlahAnggota' | 'createdAt'

type SortOrder = 'asc' | 'desc'

type SearchBy = 'all' | 'nama' | 'nik' | 'alamat'

type DataKKSearch = {
  page?: number

  limit?: PageSize

  q?: string

  by?: SearchBy

  sort?: SortBy

  order?: SortOrder
}

const allowedPageSizes = new Set<number>([10, 20, 50, 100])

const allowedSorts = new Set<string>([
  'kepalaKeluarga',
  'alamat',
  'jumlahAnggota',
  'createdAt',
])

const allowedSearchBy = new Set<string>(['all', 'nama', 'nik', 'alamat'])

function validateSearch(search: Record<string, unknown>): DataKKSearch {
  const result: DataKKSearch = {}

  const page = Number(search.page)

  if (typeof search.by === 'string' && allowedSearchBy.has(search.by)) {
    result.by = search.by as SearchBy
  }

  if (Number.isInteger(page) && page > 1) {
    result.page = page
  }

  const limit = Number(search.limit)

  if (allowedPageSizes.has(limit)) {
    result.limit = limit as PageSize
  }

  if (typeof search.q === 'string') {
    const q = search.q.trim()

    if (q) {
      result.q = q
    }
  }

  if (typeof search.sort === 'string' && allowedSorts.has(search.sort)) {
    result.sort = search.sort as SortBy
  }

  if (search.order === 'asc' || search.order === 'desc') {
    result.order = search.order
  }

  return result
}

export const Route = createFileRoute('/data-kk')({
  validateSearch,

  loaderDeps: ({ search }) => ({
    page: search.page ?? 1,

    limit: search.limit ?? 20,

    q: search.q ?? '',

    sortBy: search.sort ?? 'createdAt',

    searchBy: search.by ?? 'all',

    sortOrder: search.order ?? 'desc',
  }),

  loader: async ({ deps }) => {
    return listKK({
      data: {
        page: deps.page,

        limit: deps.limit,

        q: deps.q,

        searchBy: deps.searchBy,

        sortBy: deps.sortBy,

        sortOrder: deps.sortOrder,
      },
    })
  },

  pendingComponent: DataKKPending,

  component: DataKKPage,
})

function DataKKPage() {
  const result = Route.useLoaderData()

  const search = Route.useSearch()

  const navigate = Route.useNavigate()

  const sorting: SortingState = [
    {
      id: search.sort ?? 'createdAt',

      desc: (search.order ?? 'desc') === 'desc',
    },
  ]

  const handleSearchChange = useCallback(
    (value: string) => {
      void navigate({
        search: (previous) => ({
          ...previous,

          page: undefined,

          q: value.trim() || undefined,
        }),
      })
    },
    [navigate],
  )

  function handleSearchByChange(by: SearchBy) {
    void navigate({
      search: (previous) => ({
        ...previous,

        page: undefined,

        by: by === 'all' ? undefined : by,
      }),
    })
  }

  const handleSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater

      if (next.length === 0) {
        return
      }

      const first = next[0]

      if (!allowedSorts.has(first.id)) {
        return
      }

      void navigate({
        search: (previous) => ({
          ...previous,

          page: undefined,

          sort: first.id as SortBy,

          order: first.desc ? 'desc' : 'asc',
        }),
      })
    },
    [navigate, sorting],
  )

  function handlePageChange(page: number) {
    void navigate({
      search: (previous) => ({
        ...previous,

        page: page <= 1 ? undefined : page,
      }),
    })
  }

  function handlePageSizeChange(limit: PageSize) {
    void navigate({
      search: (previous) => ({
        ...previous,

        page: undefined,

        limit: limit === 20 ? undefined : limit,
      }),
    })
  }

  return (
    <main className="min-h-screen bg-slate-50/80">
      <PageContainer>
        <KKListHeader total={result.pagination.total} />

        {result.data.length === 0 && !search.q ? (
          <KKListEmpty />
        ) : (
          <>
            <KKListTable
              items={result.data}
              searchValue={search.q ?? ''}
              searchBy={search.by ?? 'all'}
              sorting={sorting}
              onSearchChange={handleSearchChange}
              onSearchByChange={handleSearchByChange}
              onSortingChange={handleSortingChange}
            />

            <KKListPagination
              pagination={result.pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </PageContainer>
    </main>
  )
}

function DataKKPending() {
  return (
    <main className="min-h-screen bg-slate-50/80">
      <PageContainer>
        <HeaderSkeleton />

        <KKListLoading />
      </PageContainer>
    </main>
  )
}

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-350 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {children}
    </div>
  )
}

function HeaderSkeleton() {
  return (
    <div className="mb-6">
      <div className="mb-3 h-3 w-20 rounded bg-slate-200" />

      <div className="mb-2 h-9 w-72 rounded bg-slate-200" />

      <div className="h-4 w-80 max-w-full rounded bg-slate-100" />
    </div>
  )
}
