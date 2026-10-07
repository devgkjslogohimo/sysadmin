import { CheckCircle2, ClipboardPlus, History, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'

import { PemeriksaanForm } from '@/components/kesehatan/pemeriksaan-form'
import { RiwayatPemeriksaan } from '@/components/kesehatan/riwayat-pemeriksaan'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { WargaKesehatan } from '@/components/kesehatan/use-warga-kesehatan-search'

type PetugasEventItem = {
  id: number
  nama: string
}

type Tab = 'pemeriksaan' | 'riwayat'

type Props = {
  eventId: number
  warga: WargaKesehatan
  petugas: PetugasEventItem[]

  refreshKey: number

  onSaved: () => void | Promise<void>
}

export function SelectedWargaKesehatan({
  eventId,
  warga,
  petugas,
  refreshKey,
  onSaved,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('pemeriksaan')

  useEffect(() => {
    setActiveTab('pemeriksaan')
  }, [warga.id])

  async function handleSaved() {
    await onSaved()

    setActiveTab('riwayat')
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UserRound className="size-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
              Warga Dipilih
            </div>

            <CardTitle className="mt-1 text-base font-semibold text-slate-900">
              {warga.nama}
            </CardTitle>

            <p className="mt-0.5 text-xs text-slate-500">NIK {warga.nik}</p>
          </div>

          {warga.sudahDiperiksa && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
              <CheckCircle2 className="size-3.5" />
              Sudah diperiksa
            </span>
          )}
        </div>
      </CardHeader>

      {/* TAB */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 pt-3 sm:px-5">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('pemeriksaan')}
            className={[
              'flex h-10 items-center gap-2 rounded-t-lg border-b-2 px-3 text-sm font-medium transition',
              activeTab === 'pemeriksaan'
                ? 'border-blue-600 bg-white text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800',
            ].join(' ')}
          >
            <ClipboardPlus className="size-4" />
            Pemeriksaan Baru
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('riwayat')}
            className={[
              'flex h-10 items-center gap-2 rounded-t-lg border-b-2 px-3 text-sm font-medium transition',
              activeTab === 'riwayat'
                ? 'border-blue-600 bg-white text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800',
            ].join(' ')}
          >
            <History className="size-4" />
            Riwayat Kesehatan
          </button>
        </div>
      </div>

      <CardContent className="p-5 sm:p-6">
        {activeTab === 'pemeriksaan' ? (
          warga.sudahDiperiksa ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
                  <CheckCircle2 className="size-4" />
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-700">
                    Pemeriksaan event ini sudah tersimpan
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Data pemeriksaan warga ini sudah dicatat. Gunakan tab
                    Riwayat Kesehatan untuk melihat hasil pemeriksaan.
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveTab('riwayat')}
                    className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Lihat riwayat kesehatan
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <PemeriksaanForm
              eventId={eventId}
              anggotaId={warga.id}
              petugas={petugas}
              onSaved={handleSaved}
            />
          )
        ) : (
          <RiwayatPemeriksaan anggotaId={warga.id} refreshKey={refreshKey} />
        )}
      </CardContent>
    </Card>
  )
}
