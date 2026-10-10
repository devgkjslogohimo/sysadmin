/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { useCallback, useMemo } from 'react'

import type { SortingState } from '@tanstack/react-table'

import type { PageSize } from '@/components/data-list/data-pagination'

type SearchState = {
  page?: number
  limit?: PageSize

  q?: string
  by?: string

  sort?: string
  order?: 'asc' | 'desc'
}

type Props<TSearch extends SearchState> = {
  search: TSearch

  defaultSort: string
  defaultOrder?: 'asc' | 'desc'

  allowedSorts: ReadonlySet<string>

  navigate: (options: {
    search: (previous: TSearch) => TSearch
  }) => void | Promise<void>
}

export function useListController<TSearch extends SearchState>({
  search,
  defaultSort,
  defaultOrder = 'asc',
  allowedSorts,
  navigate,
}: Props<TSearch>) {
  const sorting: SortingState = useMemo(
    () => [
      {
        id: search.sort ?? defaultSort,

        desc: (search.order ?? defaultOrder) === 'desc',
      },
    ],
    [search.sort, search.order, defaultSort, defaultOrder],
  )

  const searchChange = useCallback(
    (value: string) => {
      void navigate({
        search: (previous) =>
          ({
            ...previous,

            page: undefined,

            q: value.trim() || undefined,
          }) as TSearch,
      })
    },
    [navigate],
  )

  const searchByChange = useCallback(
    (value: string) => {
      void navigate({
        search: (previous) =>
          ({
            ...previous,

            page: undefined,

            by: value === 'all' ? undefined : value,
          }) as TSearch,
      })
    },
    [navigate],
  )

  const sortingChange = useCallback(
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
        search: (previous) =>
          ({
            ...previous,

            page: undefined,

            sort: first.id,

            order: first.desc ? 'desc' : 'asc',
          }) as TSearch,
      })
    },
    [allowedSorts, navigate, sorting],
  )

  const pageChange = useCallback(
    (page: number) => {
      void navigate({
        search: (previous) =>
          ({
            ...previous,

            page: page <= 1 ? undefined : page,
          }) as TSearch,
      })
    },
    [navigate],
  )

  const pageSizeChange = useCallback(
    (limit: PageSize) => {
      void navigate({
        search: (previous) =>
          ({
            ...previous,

            page: undefined,

            limit: limit === 20 ? undefined : limit,
          }) as TSearch,
      })
    },
    [navigate],
  )

  return {
    sorting,

    searchChange,
    searchByChange,
    sortingChange,

    pageChange,
    pageSizeChange,
  }
}
