import { ShieldCheck } from 'lucide-react'

export function PrivacyNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <ShieldCheck className="size-4" />
      </div>

      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-800">
          Data sensitif tetap terlindungi
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Teks mentah tidak disimpan ke localStorage. Nomor KK dan NIK
          disembunyikan pada preview secara default dan hanya ditampilkan jika
          pengguna memilih untuk membukanya.
        </p>
      </div>
    </div>
  )
}
