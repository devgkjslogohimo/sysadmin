import { CheckCircle2, TriangleAlert } from 'lucide-react'

type Props = {
  isValid: boolean
  errors: string[]
}

export function ParserValidationCard({ isValid, errors }: Props) {
  if (isValid) {
    return (
      <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />

        <div>
          <div className="text-sm font-semibold text-emerald-900">
            Data berhasil divalidasi
          </div>

          <p className="mt-1 text-xs leading-relaxed text-emerald-800">
            Struktur data telah lolos validasi dan siap disimpan.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
      <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-600" />

      <div className="min-w-0">
        <div className="text-sm font-semibold text-amber-900">
          Data belum dapat disimpan
        </div>

        <p className="mt-1 text-xs text-amber-800">
          Periksa hasil parsing berikut.
        </p>

        <ul className="mt-3 space-y-1 font-mono text-xs text-amber-900">
          {errors.map((message, index) => (
            <li key={`${message}-${index}`}>• {message}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
