import { Braces, Copy, Eye, EyeOff } from 'lucide-react'

import type { KKData } from '@/lib/kk-parser/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  data: KKData | null
  isValid: boolean
  showSensitive: boolean

  onToggleSensitive: () => void
  onCopy: () => void
}

export function ParserPreviewCard({
  data,
  isValid,
  showSensitive,
  onToggleSensitive,
  onCopy,
}: Props) {
  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <CardHeader className="shrink-0 border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Braces className="size-4" />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">
                Langkah 2
              </div>

              <CardTitle className="mt-1 text-base font-semibold text-slate-900">
                Hasil Data
              </CardTitle>

              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                Periksa hasil data terstruktur sebelum disimpan ke database.
              </p>
            </div>
          </div>

          {data && (
            <Badge
              variant="outline"
              className={[
                'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium shadow-none',
                isValid
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700',
              ].join(' ')}
            >
              {isValid ? 'Data Valid' : 'Perlu Diperiksa'}
            </Badge>
          )}
        </div>
      </CardHeader>

      {!data ? (
        /* EMPTY */
        <CardContent className="flex min-h-[500px] flex-1 items-center justify-center bg-slate-50/30 p-6 sm:min-h-[560px]">
          <div className="max-w-sm text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-200">
              <Braces className="size-5" />
            </div>

            <div className="mt-4 text-sm font-semibold text-slate-700">
              Belum ada hasil
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Tempel teks Kartu Keluarga pada panel Input Teks, kemudian pilih
              Proses Teks.
            </p>
          </div>
        </CardContent>
      ) : (
        <>
          {/* TOOLBAR */}
          <div className="flex min-h-14 shrink-0 flex-col gap-2 border-b border-slate-200 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={[
                'h-9 justify-start rounded-lg px-3 shadow-none',
                showSensitive
                  ? 'text-amber-700 hover:bg-amber-50 hover:text-amber-800'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900',
              ].join(' ')}
              onClick={onToggleSensitive}
            >
              {showSensitive ? (
                <>
                  <EyeOff className="size-4" />
                  Sembunyikan Data Sensitif
                </>
              ) : (
                <>
                  <Eye className="size-4" />
                  Tampilkan Data Sensitif
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-slate-200 bg-white px-3 shadow-none"
              onClick={onCopy}
            >
              <Copy className="size-4" />
              Salin JSON
            </Button>
          </div>

          {/* JSON */}
          <CardContent className="min-h-125 flex-1 overflow-auto bg-slate-950 p-0">
            <pre className="min-w-max p-5 font-mono text-xs leading-6 text-slate-200 sm:p-6">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </>
      )}
    </Card>
  )
}
