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
  return (
    <Card className="flex min-w-0 flex-col overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              Step 1
            </div>

            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4 text-muted-foreground" />
              Input Text
            </CardTitle>
          </div>

          {text && (
            <span className="text-xs tabular-nums text-muted-foreground">
              {text.length.toLocaleString('id-ID')} karakter
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <Textarea
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder={`Paste text Kartu Keluarga di sini...

Contoh:

KARTU KELUARGA
No. 1234567890123456
...`}
          spellCheck={false}
          className="min-h-[520px] resize-y rounded-none border-0 bg-slate-50/40 p-5 font-mono text-[13px] leading-6 shadow-none focus-visible:ring-0"
        />

        {error && (
          <div className="mx-5 mb-5 flex gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />

            <div>
              <div className="font-semibold">Parsing gagal</div>

              <div className="mt-0.5 text-xs">{error}</div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-end gap-2 border-t bg-white px-5 py-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          disabled={!canClear}
        >
          <Eraser className="size-4" />
          Bersihkan
        </Button>

        <Button type="button" onClick={onParse} disabled={!text.trim()}>
          <Play className="size-4" />
          Parse Text
        </Button>
      </CardFooter>
    </Card>
  )
}
