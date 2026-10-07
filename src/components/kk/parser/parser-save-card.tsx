import { CheckCircle2, Database, Loader2, ShieldCheck } from 'lucide-react'

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
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-start gap-3">
              <div
                className={[
                  'flex size-10 shrink-0 items-center justify-center rounded-xl',
                  isSaved
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-blue-50 text-blue-600',
                ].join(' ')}
              >
                {isSaved ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Database className="size-4" />
                )}
              </div>

              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">
                  Langkah 3
                </div>

                <div className="mt-1 text-base font-semibold text-slate-900">
                  Simpan Data
                </div>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  Data akan diperiksa kembali sebelum disimpan. Nomor KK dan NIK
                  diamankan sebelum masuk ke database.
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="size-3.5 text-slate-400" />
                  Data sensitif diproses sesuai mekanisme perlindungan aplikasi.
                </div>

                {isSaved && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="size-4" />
                    Data telah berhasil tersimpan.
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            type="button"
            className="h-10 w-full shrink-0 rounded-lg px-5 sm:w-auto sm:min-w-48"
            disabled={!canSave || isSaving || isSaved}
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
        </div>
      </CardContent>
    </Card>
  )
}
