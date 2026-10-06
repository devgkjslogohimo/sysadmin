import { Link } from '@tanstack/react-router'
import { Database, FileJson2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Props = {
  onAddManual: () => void
}

export function KKParserHeader({ onAddManual }: Props) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          <FileJson2 className="size-4" />
          Data Parser
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Kartu Keluarga Parser
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Parse text hasil ekstraksi Kartu Keluarga menjadi JSON terstruktur
          sebelum disimpan ke database.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="bg-white" asChild>
          <Link to="/data-kk">
            <Database className="size-4" />
            Data Tersimpan
          </Link>
        </Button>

        <Button type="button" onClick={onAddManual}>
          <Plus className="size-4" />
          Tambah Manual
        </Button>
      </div>
    </header>
  )
}
