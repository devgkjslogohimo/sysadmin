import { createFileRoute, useRouter } from '@tanstack/react-router'
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
    <main className="min-h-screen bg-slate-50/80">
      <div className="mx-auto w-full max-w-350 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
          <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {sensitive.error}
          </div>
        )}

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

        <div className="mt-5 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>Data ID #{data.id}</span>

          <span>Data sensitif disimpan dalam keadaan terenkripsi</span>
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
