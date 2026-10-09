import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'

import {
  listPemeriksaanEventSchema,
  riwayatPemeriksaanSchema,
  savePemeriksaanKesehatanSchema,
  updatePemeriksaanKesehatanSchema,
} from './schemas'
import { decryptValue } from '../security/encrypt.server'
import { maskIdentityNumber } from '../kk/utils.server'
import { requireHealthAccess } from '../auth/session.server'

export const savePemeriksaanKesehatan = createServerFn({
  method: 'POST',
})
  .validator(savePemeriksaanKesehatanSchema)
  .handler(async ({ data }) => {
    const currentUser = await requireHealthAccess()

    const event = await db.eventKesehatan.findUnique({
      where: {
        id: data.eventId,
      },
      select: {
        id: true,
        isClosed: true,
      },
    })

    if (!event) {
      throw new Error('Event kesehatan tidak ditemukan.')
    }

    if (event.isClosed) {
      throw new Error(
        'Event ini sudah ditutup. Pemeriksaan baru tidak dapat ditambahkan.',
      )
    }

    const existing = await db.pemeriksaanKesehatan.findUnique({
      where: {
        eventId_anggotaId: {
          eventId: data.eventId,
          anggotaId: data.anggotaId,
        },
      },

      select: {
        id: true,
      },
    })

    if (existing) {
      throw new Error(
        'Warga ini sudah memiliki hasil pemeriksaan pada event ini.',
      )
    }

    const pemeriksaan = await db.pemeriksaanKesehatan.create({
      data: {
        eventId: data.eventId,
        anggotaId: data.anggotaId,

        createdByUserId: currentUser.id,
        updatedByUserId: currentUser.id,

        tensiSistolik: data.tensiSistolik,
        tensiDiastolik: data.tensiDiastolik,

        gulaDarah: data.gulaDarah,
        kolesterol: data.kolesterol,
        asamUrat: data.asamUrat,

        beratBadan: data.beratBadan,
        tinggiBadan: data.tinggiBadan,

        keluhan: data.keluhan || null,
        hasilRingkas: data.hasilRingkas || null,
      },

      select: {
        id: true,
      },
    })

    return pemeriksaan
  })

export const getRiwayatPemeriksaan = createServerFn({
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

        keluhan: true,
        hasilRingkas: true,

        createdAt: true,
        updatedAt: true,

        createdBy: {
          select: {
            id: true,
            nama: true,
            username: true,
            role: true,
          },
        },

        updatedBy: {
          select: {
            id: true,
            nama: true,
            username: true,
            role: true,
          },
        },

        event: {
          select: {
            id: true,
            nama: true,
            tanggal: true,
            lokasi: true,

            petugas: {
              orderBy: {
                nama: 'asc',
              },
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
      },
    })

    return rows.map((row) => ({
      id: row.id,

      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),

      createdBy: row.createdBy,
      updatedBy: row.updatedBy,

      tensiSistolik: row.tensiSistolik,
      tensiDiastolik: row.tensiDiastolik,

      gulaDarah: row.gulaDarah,
      kolesterol: row.kolesterol,
      asamUrat: row.asamUrat,

      beratBadan: row.beratBadan,
      tinggiBadan: row.tinggiBadan,

      keluhan: row.keluhan,
      hasilRingkas: row.hasilRingkas,

      event: {
        id: row.event.id,
        nama: row.event.nama,
        tanggal: row.event.tanggal.toISOString().slice(0, 10),
        lokasi: row.event.lokasi,
        petugas: row.event.petugas,
      },
    }))
  })

export const listPemeriksaanEvent = createServerFn({
  method: 'GET',
})
  .validator(listPemeriksaanEventSchema)
  .handler(async ({ data }) => {
    await requireHealthAccess()
    const rows = await db.pemeriksaanKesehatan.findMany({
      where: {
        eventId: data.eventId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      select: {
        id: true,

        tensiSistolik: true,
        tensiDiastolik: true,
        gulaDarah: true,
        kolesterol: true,
        asamUrat: true,
        beratBadan: true,
        tinggiBadan: true,

        keluhan: true,
        hasilRingkas: true,

        createdAt: true,
        updatedAt: true,

        createdBy: {
          select: {
            id: true,
            nama: true,
            username: true,
            role: true,
          },
        },

        updatedBy: {
          select: {
            id: true,
            nama: true,
            username: true,
            role: true,
          },
        },

        event: {
          select: {
            petugas: {
              orderBy: {
                nama: 'asc',
              },
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },

        anggota: {
          select: {
            id: true,
            nama: true,

            nikCiphertext: true,
            nikIv: true,
            nikAuthTag: true,
          },
        },
      },
    })

    return rows.map((row) => {
      const nik = decryptValue({
        ciphertext: row.anggota.nikCiphertext,
        iv: row.anggota.nikIv,
        authTag: row.anggota.nikAuthTag,
      })

      return {
        id: row.id,

        anggotaId: row.anggota.id,
        nama: row.anggota.nama,
        nik: maskIdentityNumber(nik),

        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),

        createdBy: row.createdBy,
        updatedBy: row.updatedBy,

        tensiSistolik: row.tensiSistolik,
        tensiDiastolik: row.tensiDiastolik,
        gulaDarah: row.gulaDarah,
        kolesterol: row.kolesterol,
        asamUrat: row.asamUrat,
        beratBadan: row.beratBadan,
        tinggiBadan: row.tinggiBadan,

        keluhan: row.keluhan,
        petugas: row.event.petugas,
        hasilRingkas: row.hasilRingkas,
      }
    })
  })

export const updatePemeriksaanKesehatan = createServerFn({
  method: 'POST',
})
  .validator(updatePemeriksaanKesehatanSchema)
  .handler(async ({ data }) => {
    const currentUser = await requireHealthAccess()
    const existing = await db.pemeriksaanKesehatan.findUnique({
      where: {
        id: data.id,
      },

      select: {
        id: true,

        event: {
          select: {
            isClosed: true,
          },
        },
      },
    })

    if (!existing) {
      throw new Error('Data pemeriksaan tidak ditemukan.')
    }

    if (existing.event.isClosed) {
      throw new Error(
        'Event ini sudah ditutup. Hasil pemeriksaan tidak dapat diubah.',
      )
    }

    const updated = await db.pemeriksaanKesehatan.update({
      where: {
        id: data.id,
      },

      data: {
        tensiSistolik: data.tensiSistolik,
        tensiDiastolik: data.tensiDiastolik,

        gulaDarah: data.gulaDarah,
        kolesterol: data.kolesterol,
        asamUrat: data.asamUrat,

        beratBadan: data.beratBadan,
        tinggiBadan: data.tinggiBadan,

        keluhan: data.keluhan || null,
        hasilRingkas: data.hasilRingkas || null,

        updatedByUserId: currentUser.id,
      },

      select: {
        id: true,
      },
    })

    return updated
  })
