import {
  createFileRoute,
  getRouteApi,
  Link,
  useRouter,
} from '@tanstack/react-router'
import { ArrowLeft, HeartPulse, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

import { DaftarPemeriksaanEvent } from '@/components/kesehatan/daftar-pemeriksaan-event'
import { EventKesehatanHeader } from '@/components/kesehatan/event-kesehatan-header'
import { PetugasEvent } from '@/components/kesehatan/petugas-event'
import { WargaKesehatanSection } from '@/components/kesehatan/warga-kesehatan-section'

import { Button } from '@/components/ui/button'

import { getEventKesehatan } from '@/server/kesehatan'

const rootRoute = getRouteApi('__root__')

export const Route = createFileRoute('/event-kesehatan_/$id')({
  loader: async ({ params }) => {
    const id = Number(params.id)

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID event tidak valid.')
    }

    return getEventKesehatan({
      data: {
        id,
      },
    })
  },

  component: EventKesehatanDetailPage,
})

function EventKesehatanDetailPage() {
  const { user } = rootRoute.useRouteContext()

  const event = Route.useLoaderData()

  const router = useRouter()

  const [refreshKey, setRefreshKey] = useState(0)

  const isPetugas = user?.role === 'PETUGAS'

  async function handleChanged() {
    setRefreshKey((value) => value + 1)

    await router.invalidate()
  }

  return (
    <main className="bg-slate-50/70">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* BACK */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-9 rounded-lg px-2 text-slate-500 hover:bg-white hover:text-slate-900"
            asChild
          >
            <Link to="/event-kesehatan">
              <ArrowLeft className="size-4" />
              Kembali ke Event
            </Link>
          </Button>
        </div>

        {/* HEADER */}
        <EventKesehatanHeader event={event} onChanged={handleChanged} />

        {/* MODE PETUGAS */}
        {isPetugas && !event.isClosed ? (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-4 shadow-sm sm:px-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <HeartPulse className="size-5" />
            </div>

            <div className="min-w-0">
              <div className="text-sm font-semibold text-blue-900">
                Mode Pelayanan Kesehatan
              </div>

              <p className="mt-1 text-sm leading-6 text-blue-700/80">
                Cari warga yang akan diperiksa, masukkan hasil pemeriksaan, lalu
                simpan data ke event ini.
              </p>
            </div>
          </div>
        ) : null}

        {/* MODE ADMIN */}
        {!isPetugas && !event.isClosed ? (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <ShieldCheck className="size-4" />
            </div>

            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-800">
                Pengelolaan Event
              </div>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Event masih aktif. Data petugas dan hasil pemeriksaan masih
                dapat dikelola.
              </p>
            </div>
          </div>
        ) : null}

        {/* CLOSED NOTICE */}
        {event.isClosed ? (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <LockKeyhole className="size-4" />
            </div>

            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-800">
                Event telah selesai
              </div>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Data pemeriksaan tetap dapat dilihat, tetapi event yang sudah
                ditutup tidak dapat ditambah atau diubah.
              </p>
            </div>
          </div>
        ) : null}

        {/* EVENT AKTIF */}
        {!event.isClosed ? (
          <>
            {isPetugas ? (
              /*
               * PETUGAS:
               * pekerjaan utama langsung di atas.
               */
              <div className="space-y-6">
                <WargaKesehatanSection
                  eventId={event.id}
                  petugas={event.petugas}
                  refreshKey={refreshKey}
                  onChanged={handleChanged}
                />

                <PetugasEvent
                  eventId={event.id}
                  petugas={event.petugas}
                  onChanged={handleChanged}
                />
              </div>
            ) : (
              /*
               * ADMIN:
               * tetap menggunakan urutan pengelolaan.
               */
              <div className="space-y-6">
                <PetugasEvent
                  eventId={event.id}
                  petugas={event.petugas}
                  onChanged={handleChanged}
                />

                <WargaKesehatanSection
                  eventId={event.id}
                  petugas={event.petugas}
                  refreshKey={refreshKey}
                  onChanged={handleChanged}
                />
              </div>
            )}
          </>
        ) : null}

        {/* DAFTAR PEMERIKSAAN */}
        <div className={event.isClosed ? '' : 'mt-6'}>
          <DaftarPemeriksaanEvent
            eventId={event.id}
            refreshKey={refreshKey}
            readOnly={event.isClosed}
            onChanged={handleChanged}
          />
        </div>
      </div>
    </main>
  )
}
