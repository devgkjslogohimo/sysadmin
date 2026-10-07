import { Eraser, FileText, Play, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  text: string
  error: string | null
  canClear: boolean

  onTextChange: (value: string) => void

  onParse: () => void
  onClear: () => void
}

export function ParserInputCard({
  text,
  error,
  canClear,
  onTextChange,
  onParse,
  onClear,
}: Props) {
  const hasText = text.trim().length > 0

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="size-4" />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">
                Langkah 1
              </div>

              <CardTitle className="mt-1 text-base font-semibold text-slate-900">
                Input Teks
              </CardTitle>

              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                Tempel teks hasil ekstraksi Kartu Keluarga untuk diproses.
              </p>
            </div>
          </div>

          {text && (
            <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium tabular-nums text-slate-500">
              {text.length.toLocaleString('id-ID')} karakter
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <Textarea
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder={`Tempel teks Kartu Keluarga di sini...

Contoh:

KARTU KELUARGA
No. 1234567890123456
Nama Kepala Keluarga ...
Alamat ...
...`}
          spellCheck={false}
          className="
            min-h-[380px]
            resize-y
            rounded-none
            border-0
            bg-slate-50/40
            p-5
            font-mono
            text-[13px]
            leading-6
            shadow-none
            focus-visible:ring-0
            sm:min-h-[440px]
            lg:min-h-[500px]
          "
        />

        {error && (
          <div className="mx-4 mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3.5 text-red-700 sm:mx-5 sm:mb-5">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-red-600 ring-1 ring-red-200">
              <TriangleAlert className="size-4" />
            </div>

            <div className="min-w-0">
              <div className="text-sm font-semibold">Parsing gagal</div>

              <p className="mt-1 text-xs leading-5 text-red-600">{error}</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-slate-200 bg-white px-4 py-4 sm:px-5">
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-lg border-slate-200 bg-white px-4 shadow-none"
            onClick={onClear}
            disabled={!canClear}
          >
            <Eraser className="size-4" />
            Bersihkan
          </Button>

          <Button
            type="button"
            className="h-10 rounded-lg px-5 sm:min-w-32"
            onClick={onParse}
            disabled={!hasText}
          >
            <Play className="size-4" />
            Proses Teks
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
