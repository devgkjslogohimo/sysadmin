import { createFileRoute, useRouter } from '@tanstack/react-router'

import { ShieldCheck, TriangleAlert } from 'lucide-react'

import { useState } from 'react'

import { EditKKDialog } from '@/components/kk/edit-kk-dialog'
import { KKDetailHeader } from '@/components/kk/detail/kk-detail-header'
import { KKInfoCard } from '@/components/kk/detail/kk-info-card'
import { KKMembersCard } from '@/components/kk/detail/kk-members-card'

import { useSensitiveKK } from '@/hooks/use-sensitive-kk'

import { getKKDetail } from '@/server/kk.functions'

export const Route = createFileRoute('/data-kk_/$id')({
  loader: async ({ params }) => {
    const id = Number(params.id)

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID tidak valid.')
    }

    return getKKDetail({
      data: {
        id,
      },
    })
  },

  component: KKDetailPage,
})

function KKDetailPage() {
  const data = Route.useLoaderData()

  const router = useRouter()

  const [editOpen, setEditOpen] = useState(false)

  const sensitive = useSensitiveKK(data.id)

  async function handleSaved() {
    sensitive.hide()

    await router.invalidate()
  }

  return (
    <main className="bg-slate-50/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <KKDetailHeader
          kepalaKeluarga={data.kepalaKeluarga}
          desaKelurahan={data.desaKelurahan}
          kecamatan={data.kecamatan}
          jumlahAnggota={data.anggota.length}
          sensitiveVisible={sensitive.isVisible}
          sensitiveLoading={sensitive.isLoading}
          onEdit={() => setEditOpen(true)}
          onToggleSensitive={sensitive.toggle}
        />

        {sensitive.error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3.5 text-sm text-red-700">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />

            <div className="min-w-0">
              <div className="font-medium">
                Data sensitif tidak dapat dibuka
              </div>

              <p className="mt-0.5 text-xs leading-5 text-red-600">
                {sensitive.error}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <KKInfoCard
            noKK={sensitive.getNoKK(data.noKK)}
            kepalaKeluarga={data.kepalaKeluarga}
            alamat={data.alamat}
            rt={data.rt}
            rw={data.rw}
            desaKelurahan={data.desaKelurahan}
            kecamatan={data.kecamatan}
            kabupatenKota={data.kabupatenKota}
            kodePos={data.kodePos}
            provinsi={data.provinsi}
          />

          <KKMembersCard
            members={data.anggota}
            sensitiveVisible={sensitive.isVisible}
            getNik={sensitive.getNik}
          />
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Data ID #{data.id}</span>

          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            Data sensitif disimpan dalam keadaan terenkripsi
          </span>
        </div>
      </div>

      <EditKKDialog
        id={data.id}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={handleSaved}
      />
    </main>
  )
}
