import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'

import { riwayatPemeriksaanSchema } from './schemas'
import { requireHealthAccess } from '../auth/session.server'

export const getTrenKesehatan = createServerFn({
  method: 'GET',
})
  .validator(riwayatPemeriksaanSchema)
  .handler(async ({ data }) => {
    await requireHealthAccess()
    const rows = await db.pemeriksaanKesehatan.findMany({
      where: {
        anggotaId: data.anggotaId,
      },

      orderBy: [
        {
          event: {
            tanggal: 'asc',
          },
        },
        {
          createdAt: 'asc',
        },
      ],

      select: {
        id: true,

        tensiSistolik: true,
        tensiDiastolik: true,

        gulaDarah: true,
        kolesterol: true,
        asamUrat: true,

        beratBadan: true,

        event: {
          select: {
            nama: true,
            tanggal: true,
          },
        },
      },
    })

    return rows.map((row) => ({
      id: row.id,

      tanggal: row.event.tanggal.toISOString().slice(0, 10),

      eventNama: row.event.nama,

      tensiSistolik: row.tensiSistolik,

      tensiDiastolik: row.tensiDiastolik,

      gulaDarah: row.gulaDarah,

      kolesterol: row.kolesterol,

      asamUrat: row.asamUrat,

      beratBadan: row.beratBadan,
    }))
  })
