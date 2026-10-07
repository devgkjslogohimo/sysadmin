import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function DataListPage({ children }: Props) {
  return (
    <main className="bg-slate-50/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {children}
      </div>
    </main>
  )
}
