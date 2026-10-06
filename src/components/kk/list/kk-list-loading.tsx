import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function KKListLoading() {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-11 w-[25%]" />
            <Skeleton className="h-11 w-[25%]" />
            <Skeleton className="h-11 flex-1" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
