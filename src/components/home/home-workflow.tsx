import { UsersRound } from 'lucide-react'

export function HomeWorkflow() {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UsersRound className="size-4" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Alur Pengelolaan Data
            </h2>

            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              Urutan umum penggunaan sistem.
            </p>
          </div>
        </div>
      </div>

      <div className="grid divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">
        <WorkflowStep
          number="01"
          title="Input Data Jemaat"
          description="Masukkan data secara manual, gunakan Parser KK, atau Import Excel untuk data dalam jumlah banyak."
        />

        <WorkflowStep
          number="02"
          title="Kelola Data Anggota"
          description="Periksa identitas anggota dan buka detail setiap anggota dari data KK."
        />

        <WorkflowStep
          number="03"
          title="Pemeriksaan Kesehatan"
          description="Gunakan Event Kesehatan untuk mencatat hasil pemeriksaan dan riwayat warga."
        />
      </div>
    </section>
  )
}

function WorkflowStep({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="p-5 sm:p-6">
      <div className="text-xs font-bold tracking-[0.14em] text-blue-600">
        {number}
      </div>

      <div className="mt-2 text-sm font-semibold text-slate-800">{title}</div>

      <p className="mt-1.5 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  )
}
