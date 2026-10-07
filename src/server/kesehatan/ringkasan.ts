import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'

import { riwayatPemeriksaanSchema } from './schemas'

export const getRingkasanKesehatan = createServerFn({
  method: 'GET',
})
  .validator(riwayatPemeriksaanSchema)
  .handler(async ({ data }) => {
    const [jumlahPemeriksaan, terakhir] = await Promise.all([
      db.pemeriksaanKesehatan.count({
        where: {
          anggotaId: data.anggotaId,
        },
      }),

      db.pemeriksaanKesehatan.findFirst({
        where: {
          anggotaId: data.anggotaId,
        },

        orderBy: [
          {
            event: {
              tanggal: 'desc',
            },
          },
          {
            createdAt: 'desc',
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
          tinggiBadan: true,

          hasilRingkas: true,

          event: {
            select: {
              nama: true,
              tanggal: true,
            },
          },
        },
      }),
    ])

    if (!terakhir) {
      return {
        jumlahPemeriksaan,
        terakhir: null,
      }
    }

    return {
      jumlahPemeriksaan,

      terakhir: {
        id: terakhir.id,

        eventNama: terakhir.event.nama,

        tanggal: terakhir.event.tanggal.toISOString().slice(0, 10),

        tensiSistolik: terakhir.tensiSistolik,

        tensiDiastolik: terakhir.tensiDiastolik,

        gulaDarah: terakhir.gulaDarah,

        kolesterol: terakhir.kolesterol,

        asamUrat: terakhir.asamUrat,

        beratBadan: terakhir.beratBadan,

        tinggiBadan: terakhir.tinggiBadan,

        hasilRingkas: terakhir.hasilRingkas,
      },
    }
  })
