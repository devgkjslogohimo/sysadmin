import { Skeleton } from '@/components/ui/skeleton'

export function DataListLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-blue-100 bg-white p-6 sm:p-8">
        <Skeleton className="size-11 rounded-2xl" />

        <Skeleton className="mt-5 h-3 w-32" />

        <Skeleton className="mt-3 h-9 w-72 max-w-full" />

        <Skeleton className="mt-3 h-4 w-lg max-w-full" />

        <Skeleton className="mt-5 h-7 w-48 rounded-full" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({
          length: 3,
        }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-2xl" />
        ))}
      </div>

      <div className="rounded-2xl border border-blue-100 bg-white p-5">
        <Skeleton className="h-10 w-full" />

        <div className="mt-5 space-y-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
