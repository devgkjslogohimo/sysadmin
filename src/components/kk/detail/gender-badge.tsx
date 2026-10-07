import { Badge } from '@/components/ui/badge'

type Props = {
  value: string | null
}

export function GenderBadge({ value }: Props) {
  if (!value) {
    return <span className="text-sm text-slate-400">-</span>
  }

  const normalized = value.trim().toLowerCase()

  const isMale = normalized === 'laki-laki' || normalized === 'l'

  const isFemale = normalized === 'perempuan' || normalized === 'p'

  return (
    <Badge
      variant="outline"
      className={[
        'whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium shadow-none',
        isMale
          ? 'border-blue-200 bg-blue-50 text-blue-700'
          : isFemale
            ? 'border-rose-200 bg-rose-50 text-rose-700'
            : 'border-slate-200 bg-slate-50 text-slate-600',
      ].join(' ')}
    >
      {value}
    </Badge>
  )
}
