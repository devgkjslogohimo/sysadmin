import { useRouter } from '@tanstack/react-router'

import {
  CalendarDays,
  CalendarHeart,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Pencil,
  Trash2,
  XCircle,
} from 'lucide-react'

import { useState } from 'react'
import { toast } from 'sonner'

import { EditEventDialog } from '@/components/kesehatan/edit-event-dialog'
import { Button } from '@/components/ui/button'

import { closeEventKesehatan, deleteEventKesehatan } from '@/server/kesehatan'

type EventData = {
  id: number
  nama: string
  tanggal: string
  lokasi: string | null
  jumlahPemeriksaan: number
  isClosed: boolean
}

type Props = {
  event: EventData
  onChanged: () => void | Promise<void>
}

export function EventKesehatanHeader({ event, onChanged }: Props) {
  const router = useRouter()

  const [editOpen, setEditOpen] = useState(false)

  const [isClosing, setIsClosing] = useState(false)

  const [isDeleting, setIsDeleting] = useState(false)

  async function handleClose() {
    const confirmed = window.confirm(
      'Tutup event ini? Setelah ditutup, data tidak dapat ditambah atau diubah.',
    )

    if (!confirmed) {
      return
    }

    setIsClosing(true)

    try {
      await closeEventKesehatan({
        data: {
          id: event.id,
        },
      })

      toast.success('Event berhasil ditutup.')

      await onChanged()
    } catch (error) {
      toast.error('Gagal menutup event', {
        description:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan pada server.',
      })
    } finally {
      setIsClosing(false)
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      'Hapus event ini? Tindakan ini tidak dapat dibatalkan.',
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteEventKesehatan({
        data: {
          id: event.id,
        },
      })

      toast.success('Event berhasil dihapus.')

      await router.navigate({
        to: '/event-kesehatan',
      })
    } catch (error) {
      toast.error('Gagal menghapus event', {
        description:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan pada server.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const deleteDisabled = isClosing || isDeleting || event.jumlahPemeriksaan > 0

  const actionDisabled = isClosing || isDeleting

  return (
    <>
      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400" />

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            {/* INFORMASI EVENT */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                  <CalendarHeart className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                      Event Kesehatan
                    </span>

                    {event.isClosed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        <CheckCircle2 className="size-3.5" />
                        Selesai
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Aktif
                      </span>
                    )}
                  </div>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                    {event.nama}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-4 text-slate-400" />

                      {formatTanggal(event.tanggal)}
                    </span>

                    {event.lokasi && (
                      <span className="flex min-w-0 items-center gap-1.5">
                        <MapPin className="size-4 shrink-0 text-slate-400" />

                        <span className="truncate">{event.lokasi}</span>
                      </span>
                    )}

                    <span className="flex items-center gap-1.5">
                      <ClipboardList className="size-4 text-slate-400" />
                      {event.jumlahPemeriksaan.toLocaleString('id-ID')}{' '}
                      pemeriksaan
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION */}
            {!event.isClosed && (
              <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row lg:w-auto lg:flex-col xl:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full rounded-lg border-slate-200 bg-white px-4 text-slate-700 shadow-none hover:bg-slate-50 sm:w-auto"
                  disabled={actionDisabled}
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="size-4" />
                  Edit Event
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full rounded-lg border-slate-200 bg-white px-4 text-slate-700 shadow-none hover:bg-slate-50 sm:w-auto"
                  disabled={actionDisabled}
                  onClick={() => void handleClose()}
                >
                  <XCircle className="size-4" />

                  {isClosing ? 'Menutup...' : 'Tutup Event'}
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  className="h-10 w-full rounded-lg px-4 sm:w-auto"
                  disabled={deleteDisabled}
                  title={
                    event.jumlahPemeriksaan > 0
                      ? 'Event yang sudah memiliki pemeriksaan tidak dapat dihapus.'
                      : 'Hapus event'
                  }
                  onClick={() => void handleDelete()}
                >
                  <Trash2 className="size-4" />

                  {isDeleting ? 'Menghapus...' : 'Hapus'}
                </Button>
              </div>
            )}
          </div>

          {!event.isClosed && event.jumlahPemeriksaan > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
              Event yang sudah memiliki data pemeriksaan tidak dapat dihapus.
              Gunakan Tutup Event setelah kegiatan selesai.
            </div>
          )}
        </div>
      </section>

      {!event.isClosed && (
        <EditEventDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          event={{
            id: event.id,
            nama: event.nama,
            tanggal: event.tanggal,
            lokasi: event.lokasi,
          }}
          onSaved={onChanged}
        />
      )}
    </>
  )
}

function formatTanggal(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}
