import { ShieldCheck } from 'lucide-react'

export function PrivacyNotice() {
  return (
    <div className="mb-6 flex gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
        <ShieldCheck className="size-4" />
      </div>

      <div>
        <div className="text-sm font-semibold text-blue-950">
          Data diproses sementara
        </div>

        <p className="mt-1 text-xs leading-relaxed text-blue-800/80">
          Raw text tidak disimpan ke localStorage. Nomor KK dan NIK
          disembunyikan pada preview secara default.
        </p>
      </div>
    </div>
  )
}
