import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Database,
  FileJson2,
  Files,
  LayoutList,
  Users,
  UsersRound,
} from 'lucide-react'

import { DataCountBadge } from '@/components/data-list/data-count-badge'
import { DataListCard } from '@/components/data-list/data-list-card'
import { DataListEmpty } from '@/components/data-list/data-list-empty'
import { DataListHero } from '@/components/data-list/data-list-hero'
import { DataListLoading } from '@/components/data-list/data-list-loading'
import { DataListPage } from '@/components/data-list/data-list-page'
import { DataListStats } from '@/components/data-list/data-list-stats'

import { DataTable } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'

import { kkColumns } from '@/components/kk/list/kk-columns'
import { kkColumnLabels, kkSearchOptions } from '@/components/kk/list/config'

import { useListController } from '@/hooks/use-list-controller'

import { createListSearchValidator } from '@/lib/list-search'

import type { ListSearch } from '@/lib/list-search'

import { listKK } from '@/server/kk.functions'

const searchBy = ['all', 'nama', 'nik', 'alamat'] as const

const sortBy = [
  'kepalaKeluarga',
  'alamat',
  'jumlahAnggota',
  'createdAt',
] as const

type SearchBy = (typeof searchBy)[number]

type SortBy = (typeof sortBy)[number]

type DataKKSearch = ListSearch<SearchBy, SortBy>

const allowedSorts = new Set<string>(sortBy)

const validateSearch = createListSearchValidator({
  searchBy,
  sortBy,
})

export const Route = createFileRoute('/data-kk')({
  validateSearch,

  loaderDeps: ({ search }) => ({
    page: search.page ?? 1,

    limit: search.limit ?? 20,

    q: search.q ?? '',

    searchBy: search.by ?? 'all',

    sortBy: search.sort ?? 'createdAt',

    sortOrder: search.order ?? 'desc',
  }),

  loader: ({ deps }) =>
    listKK({
      data: {
        page: deps.page,

        limit: deps.limit,

        q: deps.q,

        searchBy: deps.searchBy,

        sortBy: deps.sortBy,

        sortOrder: deps.sortOrder,
      },
    }),

  pendingComponent: DataKKPending,

  component: DataKKPage,
})

function DataKKPage() {
  const result = Route.useLoaderData()

  const search = Route.useSearch()

  const navigate = Route.useNavigate()

  const list = useListController<DataKKSearch>({
    search,

    defaultSort: 'createdAt',

    defaultOrder: 'desc',

    allowedSorts,

    navigate,
  })

  const hasData = result.data.length > 0

  const isEmpty = !hasData && !search.q

  return (
    <DataListPage>
      <DataListHero
        icon={<Database className="size-5" />}
        eyebrow="Database Jemaat"
        title="Data Kartu Keluarga"
        description="Kelola data Kartu Keluarga, anggota keluarga, alamat, dan informasi jemaat dalam satu database."
        badge={
          <DataCountBadge>
            {result.pagination.total > 0
              ? `${result.pagination.total.toLocaleString(
                  'id-ID',
                )} Kartu Keluarga tersimpan`
              : 'Belum ada data tersimpan'}
          </DataCountBadge>
        }
        actions={
          <>
            <Button
              variant="outline"
              className="h-10 w-full rounded-lg border-slate-200 bg-white px-4 text-slate-700 shadow-sm hover:bg-slate-50 sm:w-auto"
              asChild
            >
              <Link to="/data-anggota">
                <UsersRound className="size-4 text-blue-600" />
                Data Anggota
              </Link>
            </Button>

            <Button
              className="h-10 w-full rounded-lg px-4 shadow-sm sm:w-auto"
              asChild
            >
              <Link to="/fitur/parser-kk">
                <FileJson2 className="size-4" />
                Tambah Data
              </Link>
            </Button>
          </>
        }
      />

      {hasData && (
        <DataListStats
          items={[
            {
              label: 'Total KK',

              value: result.pagination.total.toLocaleString('id-ID'),

              icon: <Database className="size-4" />,
            },

            {
              label: 'Ditampilkan',

              value: result.data.length.toLocaleString('id-ID'),

              icon: <LayoutList className="size-4" />,
            },

            {
              label: 'Halaman',

              value: `${result.pagination.page} / ${Math.max(
                result.pagination.totalPages,
                1,
              )}`,

              icon: <Files className="size-4" />,
            },
          ]}
        />
      )}

      {isEmpty ? (
        <DataListEmpty
          icon={<Users className="size-7" />}
          title="Belum ada data Kartu Keluarga"
          description="Tambahkan data Kartu Keluarga melalui Parser KK untuk mulai membangun database jemaat."
          action={
            <Button asChild>
              <Link to="/fitur/parser-kk">
                <FileJson2 className="size-4" />
                Tambah Data KK
              </Link>
            </Button>
          }
        />
      ) : (
        <DataListCard
          pagination={result.pagination}
          onPageChange={list.pageChange}
          onPageSizeChange={list.pageSizeChange}
        >
          <DataTable
            columns={kkColumns}
            data={result.data}
            searchValue={search.q ?? ''}
            searchMode={search.by ?? 'all'}
            searchOptions={kkSearchOptions}
            columnLabels={kkColumnLabels}
            sorting={list.sorting}
            onSearchChange={list.searchChange}
            onSearchModeChange={list.searchByChange}
            onSortingChange={list.sortingChange}
          />
        </DataListCard>
      )}
    </DataListPage>
  )
}

function DataKKPending() {
  return (
    <DataListPage>
      <DataListLoading />
    </DataListPage>
  )
}
