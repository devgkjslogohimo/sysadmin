import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ContactRound,
  Database,
  FileJson2,
  Files,
  LayoutList,
  UserRound,
} from 'lucide-react'

import { anggotaColumns } from '@/components/anggota/list/anggota-columns'
import {
  anggotaColumnLabels,
  anggotaSearchOptions,
} from '@/components/anggota/list/config'

import { DataCountBadge } from '@/components/data-list/data-count-badge'
import { DataListCard } from '@/components/data-list/data-list-card'
import { DataListEmpty } from '@/components/data-list/data-list-empty'
import { DataListHero } from '@/components/data-list/data-list-hero'
import { DataListLoading } from '@/components/data-list/data-list-loading'
import { DataListPage } from '@/components/data-list/data-list-page'
import { DataListStats } from '@/components/data-list/data-list-stats'

import { DataTable } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'

import { useListController } from '@/hooks/use-list-controller'

import { createListSearchValidator } from '@/lib/list-search'

import type { ListSearch } from '@/lib/list-search'

import { listAnggota } from '@/server/anggota'

const searchBy = ['all', 'nama', 'nik', 'alamat'] as const

const sortBy = ['nama', 'kepalaKeluarga', 'alamat', 'createdAt'] as const

type SearchBy = (typeof searchBy)[number]

type SortBy = (typeof sortBy)[number]

type DataAnggotaSearch = ListSearch<SearchBy, SortBy>

const allowedSorts = new Set<string>(sortBy)

const validateSearch = createListSearchValidator({
  searchBy,
  sortBy,
})

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

  loader: ({ deps }) =>
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

  const list = useListController<DataAnggotaSearch>({
    search,

    defaultSort: 'nama',

    defaultOrder: 'asc',

    allowedSorts,

    navigate,
  })

  const hasData = result.data.length > 0

  const isEmpty = !hasData && !search.q

  return (
    <DataListPage>
      <DataListHero
        icon={<ContactRound className="size-5" />}
        eyebrow="Database Jemaat"
        title="Data Anggota"
        description="Lihat dan kelola seluruh anggota jemaat beserta identitas, keluarga, alamat, dan informasi terkait."
        badge={
          <DataCountBadge>
            {result.pagination.total > 0
              ? `${result.pagination.total.toLocaleString(
                  'id-ID',
                )} anggota tersimpan`
              : 'Belum ada anggota tersimpan'}
          </DataCountBadge>
        }
        actions={
          <>
            <Button
              variant="outline"
              className="h-10 w-full rounded-lg border-slate-200 bg-white px-4 text-slate-700 shadow-sm hover:bg-slate-50 sm:w-auto"
              asChild
            >
              <Link to="/data-kk">
                <Database className="size-4 text-blue-600" />
                Data KK
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
              label: 'Total Anggota',

              value: result.pagination.total.toLocaleString('id-ID'),

              icon: <UserRound className="size-4" />,
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
          icon={<ContactRound className="size-7" />}
          title="Belum ada data anggota"
          description="Data anggota akan tersedia setelah Kartu Keluarga ditambahkan ke database."
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
            columns={anggotaColumns}
            data={result.data}
            searchValue={search.q ?? ''}
            searchMode={search.by ?? 'all'}
            searchOptions={anggotaSearchOptions}
            columnLabels={anggotaColumnLabels}
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

function DataAnggotaPending() {
  return (
    <DataListPage>
      <DataListLoading />
    </DataListPage>
  )
}
