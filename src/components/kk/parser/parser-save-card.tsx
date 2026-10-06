import { CheckCircle2, Database, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  canSave: boolean
  isSaving: boolean
  isSaved: boolean
  onSave: () => void
}

export function ParserSaveCard({ canSave, isSaving, isSaved, onSave }: Props) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Step 3
          </div>

          <div className="font-semibold">Simpan Data</div>

          <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
            Data akan divalidasi kembali sebelum disimpan. Nomor KK dan NIK
            diamankan sebelum masuk ke database.
          </p>

          {isSaved && (
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="size-4" />
              Data telah tersimpan.
            </div>
          )}
        </div>

        <Button
          type="button"
          className="shrink-0 sm:min-w-48"
          disabled={!canSave}
          onClick={onSave}
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Menyimpan...
            </>
          ) : isSaved ? (
            <>
              <CheckCircle2 className="size-4" />
              Tersimpan
            </>
          ) : (
            <>
              <Database className="size-4" />
              Simpan ke Database
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
