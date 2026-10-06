import { Link } from '@tanstack/react-router'

import { ContactRound, Database } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Props = {
  total: number
}

export function AnggotaListHeader({ total }: Props) {
  return (
    <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          <ContactRound className="size-4" />
          Database
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Data Anggota Keluarga
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {total.toLocaleString('id-ID')} anggota keluarga tersimpan
        </p>
      </div>

      <Button variant="outline" className="bg-white" asChild>
        <Link to="/data-kk">
          <Database className="size-4" />
          Data KK
        </Link>
      </Button>
    </section>
  )
}
