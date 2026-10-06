import { Badge } from '@/components/ui/badge'

type Props = {
  value: string | null
}

export function GenderBadge({ value }: Props) {
  if (!value) {
    return <span className="text-muted-foreground">-</span>
  }

  return (
    <Badge variant="outline" className="whitespace-nowrap font-medium">
      {value}
    </Badge>
  )
}
