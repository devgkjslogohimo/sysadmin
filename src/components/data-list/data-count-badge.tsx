import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function DataCountBadge({ children }: Props) {
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
      {children}
    </span>
  )
}
