export type PageSize = 10 | 20 | 50 | 100

export type SortOrder = 'asc' | 'desc'

export type ListSearch<TSearchBy extends string, TSortBy extends string> = {
  page?: number
  limit?: PageSize

  q?: string
  by?: TSearchBy

  sort?: TSortBy
  order?: SortOrder
}

type Options<TSearchBy extends string, TSortBy extends string> = {
  searchBy: readonly TSearchBy[]
  sortBy: readonly TSortBy[]
}

const allowedPageSizes = new Set<number>([10, 20, 50, 100])

export function createListSearchValidator<
  TSearchBy extends string,
  TSortBy extends string,
>({ searchBy, sortBy }: Options<TSearchBy, TSortBy>) {
  const allowedSearchBy = new Set<string>(searchBy)

  const allowedSortBy = new Set<string>(sortBy)

  return (search: Record<string, unknown>): ListSearch<TSearchBy, TSortBy> => {
    const result: ListSearch<TSearchBy, TSortBy> = {}

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
      result.by = search.by as TSearchBy
    }

    if (typeof search.sort === 'string' && allowedSortBy.has(search.sort)) {
      result.sort = search.sort as TSortBy
    }

    if (search.order === 'asc' || search.order === 'desc') {
      result.order = search.order
    }

    return result
  }
}
