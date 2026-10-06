import { Link } from '@tanstack/react-router'
import { Database, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Props = {
  total: number
}

export function KKListHeader({ total }: Props) {
  return (
    <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          <Database className="size-4" />
          Database
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Data Kartu Keluarga
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {total > 0
            ? `${total.toLocaleString('id-ID')} Kartu Keluarga tersimpan`
            : 'Daftar data Kartu Keluarga yang telah disimpan.'}
        </p>
      </div>

      <Button asChild>
        <Link to="/">
          <Plus className="size-4" />
          Tambah Data
        </Link>
      </Button>
    </section>
  )
}
