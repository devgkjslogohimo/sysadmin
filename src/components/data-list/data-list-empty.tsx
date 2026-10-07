import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function DataListEmpty({ icon, title, description, action }: Props) {
  return (
    <div className="rounded-3xl border border-dashed border-blue-200 bg-white/80 px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
