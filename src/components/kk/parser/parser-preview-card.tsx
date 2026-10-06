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
    <Card className="flex min-w-0 flex-col overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              Step 2
            </div>

            <CardTitle className="flex items-center gap-2 text-base">
              <Braces className="size-4 text-muted-foreground" />
              Hasil JSON
            </CardTitle>
          </div>

          {data && (
            <Badge
              variant={isValid ? 'secondary' : 'outline'}
              className={
                isValid
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }
            >
              {isValid ? 'Valid' : 'Perlu diperiksa'}
            </Badge>
          )}
        </div>
      </CardHeader>

      {!data ? (
        <CardContent className="flex min-h-148.5 flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100">
            <Braces className="size-6 text-slate-400" />
          </div>

          <h3 className="font-semibold">Belum ada hasil</h3>

          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Masukkan raw text pada panel kiri, lalu tekan Parse Text.
          </p>
        </CardContent>
      ) : (
        <>
          <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b bg-slate-50/60 px-4 py-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onToggleSensitive}
            >
              {showSensitive ? (
                <>
                  <EyeOff className="size-4" />
                  Sembunyikan Data
                </>
              ) : (
                <>
                  <Eye className="size-4" />
                  Tampilkan Data
                </>
              )}
            </Button>

            <Button type="button" variant="outline" size="sm" onClick={onCopy}>
              <Copy className="size-4" />
              Copy JSON
            </Button>
          </div>

          <CardContent className="min-h-136.25 max-h-162.5 overflow-auto bg-slate-950 p-0">
            <pre className="min-w-max p-5 font-mono text-xs leading-6 text-slate-200">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </>
      )}
    </Card>
  )
}
