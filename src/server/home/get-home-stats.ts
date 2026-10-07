import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'
import { requireAdmin } from '../auth/session.server'

export const getHomeStats = createServerFn({
  method: 'GET',
}).handler(async () => {
  await requireAdmin()
  const [totalKK, totalAnggota, events, latestEvent] = await Promise.all([
    db.kartuKeluarga.count(),

    db.anggotaKeluarga.count(),

    db.eventKesehatan.findMany({
      select: {
        isClosed: true,

        _count: {
          select: {
            pemeriksaan: true,
          },
        },
      },
    }),

    db.eventKesehatan.findFirst({
      orderBy: [
        {
          tanggal: 'desc',
        },
        {
          id: 'desc',
        },
      ],

      select: {
        id: true,
        nama: true,
        tanggal: true,
        lokasi: true,
        isClosed: true,

        _count: {
          select: {
            pemeriksaan: true,
          },
        },
      },
    }),
  ])

  const totalEvent = events.length

  const eventAktif = events.filter((event) => !event.isClosed).length

  const eventSelesai = totalEvent - eventAktif

  const totalPemeriksaan = events.reduce(
    (total, event) => total + event._count.pemeriksaan,
    0,
  )

  return {
    totalKK,
    totalAnggota,

    totalEvent,
    eventAktif,
    eventSelesai,

    totalPemeriksaan,

    latestEvent: latestEvent
      ? {
          id: latestEvent.id,

          nama: latestEvent.nama,

          tanggal: latestEvent.tanggal.toISOString().slice(0, 10),

          lokasi: latestEvent.lokasi,

          isClosed: latestEvent.isClosed,

          jumlahPemeriksaan: latestEvent._count.pemeriksaan,
        }
      : null,
  }
})
