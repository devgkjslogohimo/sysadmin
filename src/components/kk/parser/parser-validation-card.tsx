import { CheckCircle2, TriangleAlert } from 'lucide-react'

type Props = {
  isValid: boolean
  errors: string[]
}

export function ParserValidationCard({ isValid, errors }: Props) {
  if (isValid) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-emerald-200">
          <CheckCircle2 className="size-4" />
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-emerald-800">
            Data berhasil divalidasi
          </div>

          <p className="mt-0.5 text-xs leading-5 text-emerald-700">
            Struktur data sudah sesuai dan dapat dilanjutkan ke proses
            penyimpanan.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3.5">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600 ring-1 ring-amber-200">
          <TriangleAlert className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-amber-900">
            Data belum dapat disimpan
          </div>

          <p className="mt-0.5 text-xs leading-5 text-amber-700">
            Periksa kembali hasil parsing berikut.
          </p>
        </div>

        {errors.length > 0 && (
          <span className="shrink-0 rounded-md bg-white px-2 py-1 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200">
            {errors.length.toLocaleString('id-ID')} masalah
          </span>
        )}
      </div>

      {errors.length > 0 && (
        <div className="mt-3 border-t border-amber-200/70 pt-3">
          <ul className="space-y-1.5">
            {errors.map((message, index) => (
              <li
                key={`${message}-${index}`}
                className="flex items-start gap-2 text-xs leading-5 text-amber-800"
              >
                <span className="mt-1.75 size-1 shrink-0 rounded-full bg-amber-500" />

                <span className="min-w-0 wrap-break-word font-mono">
                  {message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
