import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'
import { decryptValue } from '../security/encrypt.server'
import { hashIdentityNumber } from '../security/hash.server'
import { maskIdentityNumber } from '../kk/utils.server'

import { eventKesehatanIdSchema, searchWargaKesehatanSchema } from './schemas'
import { requireHealthAccess } from '../auth/session.server'

export const getEventKesehatan = createServerFn({
  method: 'GET',
})
  .validator(eventKesehatanIdSchema)
  .handler(async ({ data }) => {
    await requireHealthAccess()
    const event = await db.eventKesehatan.findUnique({
      where: {
        id: data.id,
      },

      select: {
        id: true,
        nama: true,
        tanggal: true,
        lokasi: true,

        isClosed: true,
        closedAt: true,

        petugas: {
          orderBy: {
            nama: 'asc',
          },
          select: {
            id: true,
            nama: true,
          },
        },

        _count: {
          select: {
            pemeriksaan: true,
          },
        },
      },
    })

    if (!event) {
      throw new Error('Event kesehatan tidak ditemukan.')
    }

    return {
      id: event.id,
      nama: event.nama,
      tanggal: event.tanggal.toISOString().slice(0, 10),
      lokasi: event.lokasi,
      isClosed: event.isClosed,
      closedAt: event.closedAt?.toISOString() ?? null,
      jumlahPemeriksaan: event._count.pemeriksaan,
      petugas: event.petugas,
    }
  })

export const searchWargaKesehatan = createServerFn({
  method: 'GET',
})
  .validator(searchWargaKesehatanSchema)
  .handler(async ({ data }) => {
    await requireHealthAccess()

    const event = await db.eventKesehatan.findUnique({
      where: {
        id: data.eventId,
      },
      select: {
        id: true,
      },
    })

    if (!event) {
      throw new Error('Event kesehatan tidak ditemukan.')
    }

    const q = data.q.trim()

    const digits = q.replace(/\D/g, '')

    const orConditions = [
      {
        nama: {
          contains: q,
          mode: 'insensitive' as const,
        },
      },
    ]

    if (digits.length === 16) {
      orConditions.push({
        nikHash: hashIdentityNumber(digits),
      } as never)
    }

    const rows = await db.anggotaKeluarga.findMany({
      where: {
        OR: orConditions,
      },

      take: 20,

      orderBy: {
        nama: 'asc',
      },

      select: {
        id: true,
        nama: true,

        nikCiphertext: true,
        nikIv: true,
        nikAuthTag: true,

        jenisKelamin: true,
        tanggalLahir: true,

        kk: {
          select: {
            kepalaKeluarga: true,
            alamat: true,
            desaKelurahan: true,
          },
        },

        pemeriksaanKesehatan: {
          where: {
            eventId: data.eventId,
          },
          select: {
            id: true,
          },
          take: 1,
        },
      },
    })

    return rows.map((row) => {
      const nik = decryptValue({
        ciphertext: row.nikCiphertext,
        iv: row.nikIv,
        authTag: row.nikAuthTag,
      })

      return {
        id: row.id,
        nama: row.nama,
        nik: maskIdentityNumber(nik),
        jenisKelamin: row.jenisKelamin,
        tanggalLahir: row.tanggalLahir,
        kepalaKeluarga: row.kk.kepalaKeluarga,
        alamat: row.kk.alamat,
        desaKelurahan: row.kk.desaKelurahan,
        sudahDiperiksa: row.pemeriksaanKesehatan.length > 0,
      }
    })
  })
