import { CalendarHeart, MapPin, Pencil, Trash2, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Props = {
  nama: string
  tanggal: string
  lokasi: string | null
  jumlahPemeriksaan: number
  isClosed: boolean

  isClosing: boolean
  isDeleting: boolean

  onEdit: () => void
  onClose: () => void | Promise<void>
  onDelete: () => void | Promise<void>
}

export function EventHealthHeader({
  nama,
  tanggal,
  lokasi,
  jumlahPemeriksaan,
  isClosed,
  isClosing,
  isDeleting,
  onEdit,
  onClose,
  onDelete,
}: Props) {
  const deleteDisabled = isDeleting || jumlahPemeriksaan > 0

  return (
    <header className="mb-6">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        <CalendarHeart className="size-4" />
        Event Kesehatan
      </div>

      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{nama}</h1>

      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
        <span>{formatTanggal(tanggal)}</span>

        {lokasi && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {lokasi}
          </span>
        )}

        <span>{jumlahPemeriksaan.toLocaleString('id-ID')} pemeriksaan</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {isClosed ? (
          <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Selesai
          </div>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={isClosing || isDeleting}
              onClick={onEdit}
            >
              <Pencil className="size-4" />
              Edit Event
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isClosing || isDeleting}
              onClick={() => void onClose()}
            >
              <XCircle className="size-4" />

              {isClosing ? 'Menutup...' : 'Close Event'}
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={deleteDisabled || isClosing}
              title={
                jumlahPemeriksaan > 0
                  ? 'Event yang sudah memiliki pemeriksaan tidak dapat dihapus.'
                  : 'Hapus event'
              }
              onClick={() => void onDelete()}
            >
              <Trash2 className="size-4" />

              {isDeleting ? 'Menghapus...' : 'Delete'}
            </Button>
          </>
        )}
      </div>
    </header>
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
