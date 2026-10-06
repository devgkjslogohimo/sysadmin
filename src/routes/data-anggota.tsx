import { createFileRoute } from '@tanstack/react-router'

import type { SortingState } from '@tanstack/react-table'

import { useCallback } from 'react'

import { AnggotaListHeader } from '@/components/anggota/list/anggota-list-header'

import { AnggotaListTable } from '@/components/anggota/list/anggota-list-table'

import { KKListLoading } from '@/components/kk/list/kk-list-loading'

import { KKListPagination } from '@/components/kk/list/kk-list-pagination'

import { listAnggota } from '@/server/anggota'

type PageSize = 10 | 20 | 50 | 100

type SearchBy = 'all' | 'nama' | 'nik' | 'alamat'

type SortBy = 'nama' | 'kepalaKeluarga' | 'alamat' | 'createdAt'

type SortOrder = 'asc' | 'desc'

type DataAnggotaSearch = {
  page?: number
  limit?: PageSize

  q?: string
  by?: SearchBy

  sort?: SortBy
  order?: SortOrder
}

const allowedPageSizes = new Set<number>([10, 20, 50, 100])

const allowedSearchBy = new Set<string>(['all', 'nama', 'nik', 'alamat'])

const allowedSorts = new Set<string>([
  'nama',
  'kepalaKeluarga',
  'alamat',
  'createdAt',
])

function validateSearch(search: Record<string, unknown>): DataAnggotaSearch {
  const result: DataAnggotaSearch = {}

  const page = Number(search.page)

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

  if (typeof search.by === 'string' && allowedSearchBy.has(search.by)) {
    result.by = search.by as SearchBy
  }

  if (typeof search.sort === 'string' && allowedSorts.has(search.sort)) {
    result.sort = search.sort as SortBy
  }

  if (search.order === 'asc' || search.order === 'desc') {
    result.order = search.order
  }

  return result
}

export const Route = createFileRoute('/data-anggota')({
  validateSearch,

  loaderDeps: ({ search }) => ({
    page: search.page ?? 1,

    limit: search.limit ?? 20,

    q: search.q ?? '',

    searchBy: search.by ?? 'all',

    sortBy: search.sort ?? 'nama',

    sortOrder: search.order ?? 'asc',
  }),

  loader: async ({ deps }) =>
    listAnggota({
      data: {
        page: deps.page,

        limit: deps.limit,

        q: deps.q,

        searchBy: deps.searchBy,

        sortBy: deps.sortBy,

        sortOrder: deps.sortOrder,
      },
    }),

  pendingComponent: DataAnggotaPending,

  component: DataAnggotaPage,
})

function DataAnggotaPage() {
  const result = Route.useLoaderData()

  const search = Route.useSearch()

  const navigate = Route.useNavigate()

  const sorting: SortingState = [
    {
      id: search.sort ?? 'nama',

      desc: (search.order ?? 'asc') === 'desc',
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

      const first = next[0]

      if (!first || !allowedSorts.has(first.id)) {
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
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <AnggotaListHeader total={result.pagination.total} />

        <AnggotaListTable
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
      </div>
    </main>
  )
}

function DataAnggotaPending() {
  return (
    <main className="min-h-screen bg-slate-50/80">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6">
          <div className="mb-2 h-9 w-80 rounded bg-slate-200" />

          <div className="h-4 w-64 rounded bg-slate-100" />
        </div>

        <KKListLoading />
      </div>
    </main>
  )
}
