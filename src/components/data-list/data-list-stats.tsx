import type { ReactNode } from 'react'

export type DataListStat = {
  label: string
  value: string
  icon: ReactNode
}

type Props = {
  items: DataListStat[]
}

export function DataListStats({ items }: Props) {
  if (items.length === 0) {
    return null
  }

  return (
    <div
      className={`mb-6 grid gap-3 ${
        items.length === 2
          ? 'sm:grid-cols-2'
          : items.length === 3
            ? 'sm:grid-cols-3'
            : 'sm:grid-cols-2 lg:grid-cols-4'
      }`}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-2xl border border-blue-100/80 bg-white/90 px-4 py-4 shadow-sm"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {item.icon}
          </div>

          <div>
            <div className="text-xs font-medium text-slate-400">
              {item.label}
            </div>

            <div className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
