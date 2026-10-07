import { Link } from '@tanstack/react-router'
import { Database, FileJson2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Props = {
  onAddManual: () => void
}

export function KKParserHeader({ onAddManual }: Props) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-1 bg-linear-to-r from-blue-600 via-blue-500 to-sky-400" />

      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
              <FileJson2 className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                Data Parser
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                Kartu Keluarga Parser
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Ubah teks hasil ekstraksi Kartu Keluarga menjadi data
                terstruktur, periksa hasilnya, lalu simpan ke database.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row lg:justify-end">
          <Button
            variant="outline"
            className="h-10 w-full rounded-lg border-slate-200 bg-white px-4 shadow-none hover:bg-slate-50 sm:w-auto"
            asChild
          >
            <Link to="/data-kk" preload="intent">
              <Database className="size-4" />
              Data Tersimpan
            </Link>
          </Button>

          <Button
            type="button"
            className="h-10 w-full rounded-lg px-4 sm:w-auto"
            onClick={onAddManual}
          >
            <Plus className="size-4" />
            Tambah Manual
          </Button>
        </div>
      </div>
    </section>
  )
}
