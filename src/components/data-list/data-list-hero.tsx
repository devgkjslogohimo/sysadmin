import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode

  eyebrow: string
  title: string
  description: string

  badge?: ReactNode
  actions?: ReactNode
}

export function DataListHero({
  icon,
  eyebrow,
  title,
  description,
  badge,
  actions,
}: Props) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* aksen atas */}
      <div className="h-1 bg-linear-to-r from-blue-600 via-blue-500 to-sky-400" />

      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
        {/* INFORMASI */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
              {icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  {eyebrow}
                </span>

                {badge}
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                {title}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* ACTION */}
        {actions && (
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row lg:justify-end">
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}
