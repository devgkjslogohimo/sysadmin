import { createFileRoute, useRouter } from '@tanstack/react-router'

import { CalendarHeart, ClipboardList, SearchX } from 'lucide-react'

import { CreateEventForm } from '@/components/kesehatan/create-event-form'
import { EventListToolbar } from '@/components/kesehatan/event-list-toolbar'

import type { EventStatus } from '@/components/kesehatan/event-list-toolbar'

import { EventList } from '@/components/kesehatan/event-list'

import { DataCountBadge } from '@/components/data-list/data-count-badge'
import { DataListHero } from '@/components/data-list/data-list-hero'
import { DataListPage } from '@/components/data-list/data-list-page'
import { DataPagination } from '@/components/data-list/data-pagination'

import type { PageSize } from '@/components/data-list/data-pagination'

import { listEventKesehatan } from '@/server/kesehatan'

type EventKesehatanSearch = {
  page?: number

  limit?: PageSize

  q?: string

  status?: Exclude<EventStatus, 'all'>

  tahun?: number
}

function validateSearch(search: Record<string, unknown>): EventKesehatanSearch {
  const result: EventKesehatanSearch = {}

  const page = Number(search.page)

  if (Number.isInteger(page) && page > 1) {
    result.page = page
  }

  const limit = Number(search.limit)

  if (limit === 10 || limit === 20 || limit === 50 || limit === 100) {
    result.limit = limit
  }

  if (typeof search.q === 'string') {
    const q = search.q.trim()

    if (q) {
      result.q = q
    }
  }

  if (search.status === 'aktif' || search.status === 'selesai') {
    result.status = search.status
  }

  const tahun = Number(search.tahun)

  if (Number.isInteger(tahun) && tahun >= 2000 && tahun <= 2100) {
    result.tahun = tahun
  }

  return result
}

export const Route = createFileRoute('/event-kesehatan')({
  validateSearch,

  loaderDeps: ({
    search,
  }): {
    page: number
    limit: PageSize
    q: string
    status: EventStatus
    tahun?: number
  } => ({
    page: search.page ?? 1,

    limit: search.limit ?? 10,

    q: search.q ?? '',

    status: search.status ?? 'all',

    tahun: search.tahun,
  }),

  loader: ({ deps }) =>
    listEventKesehatan({
      data: {
        page: deps.page,

        limit: deps.limit,

        q: deps.q,

        status: deps.status,

        tahun: deps.tahun,
      },
    }),

  component: EventKesehatanPage,
})

function EventKesehatanPage() {
  const result = Route.useLoaderData()

  const search = Route.useSearch()

  const navigate = Route.useNavigate()

  const router = useRouter()

  const events = result.data

  const status: EventStatus = search.status ?? 'all'

  const hasFilter = Boolean(search.q || search.status || search.tahun)

  function handleSearchChange(q: string) {
    void navigate({
      search: (previous) => ({
        ...previous,

        page: undefined,

        q: q.trim() || undefined,
      }),
    })
  }

  function handleStatusChange(nextStatus: EventStatus) {
    void navigate({
      search: (previous) => ({
        ...previous,

        page: undefined,

        status: nextStatus === 'all' ? undefined : nextStatus,
      }),
    })
  }

  function handleYearChange(tahun: number | undefined) {
    void navigate({
      search: (previous) => ({
        ...previous,

        page: undefined,

        tahun,
      }),
    })
  }

  function handleReset() {
    void navigate({
      search: (previous) => ({
        ...previous,

        page: undefined,

        q: undefined,

        status: undefined,

        tahun: undefined,
      }),
    })
  }

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

        limit: limit === 10 ? undefined : limit,
      }),
    })
  }

  return (
    <DataListPage>
      <DataListHero
        icon={<CalendarHeart className="size-5" />}
        eyebrow="Kesehatan Jemaat"
        title="Event Kesehatan"
        description="Kelola kegiatan pemeriksaan kesehatan warga, mulai dari pembuatan event hingga pencatatan hasil pemeriksaan."
        badge={
          <DataCountBadge>
            {hasFilter
              ? `${result.pagination.total.toLocaleString(
                  'id-ID',
                )} event ditemukan`
              : result.pagination.total > 0
                ? `${result.pagination.total.toLocaleString(
                    'id-ID',
                  )} event tersimpan`
                : 'Belum ada event'}
          </DataCountBadge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <CreateEventForm
            onCreated={async () => {
              await router.invalidate()
            }}
          />
        </aside>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ClipboardList className="size-4" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-semibold text-slate-900">Daftar Event</h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {result.pagination.total > 0
                      ? `${result.pagination.total.toLocaleString(
                          'id-ID',
                        )} event sesuai filter`
                      : 'Tidak ada event yang sesuai'}
                  </p>
                </div>
              </div>
            </div>

            <EventListToolbar
              searchValue={search.q ?? ''}
              status={status}
              tahun={search.tahun}
              onSearchChange={handleSearchChange}
              onStatusChange={handleStatusChange}
              onYearChange={handleYearChange}
              onReset={handleReset}
            />
          </div>

          <div className="p-4 sm:p-5">
            {events.length > 0 ? (
              <EventList events={events} />
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <SearchX className="size-5" />
                </div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  {hasFilter ? 'Event tidak ditemukan' : 'Belum ada event'}
                </h3>

                <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                  {hasFilter
                    ? 'Coba ubah kata pencarian, status, atau tahun event.'
                    : 'Event kesehatan yang dibuat akan muncul di sini.'}
                </p>
              </div>
            )}
          </div>

          {result.pagination.total > 0 && (
            <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-4 sm:px-5">
              <DataPagination
                pagination={result.pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </section>
      </div>
    </DataListPage>
  )
}
