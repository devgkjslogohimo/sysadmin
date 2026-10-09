import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'

import { hapusPetugasEventSchema, tambahPetugasEventSchema } from './schemas'
import { requireHealthAccess } from '../auth/session.server'

export const tambahPetugasEvent = createServerFn({
  method: 'POST',
})
  .validator(tambahPetugasEventSchema)
  .handler(async ({ data }) => {
    await requireHealthAccess()

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
        'Event ini sudah ditutup. Petugas tidak dapat ditambahkan.',
      )
    }

    const existing = await db.petugasEvent.findFirst({
      where: {
        eventId: data.eventId,
        nama: {
          equals: data.nama,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
    })

    if (existing) {
      throw new Error('Petugas tersebut sudah terdaftar pada event ini.')
    }

    return db.petugasEvent.create({
      data: {
        eventId: data.eventId,
        nama: data.nama,
      },
      select: {
        id: true,
        nama: true,
      },
    })
  })

export const hapusPetugasEvent = createServerFn({
  method: 'POST',
})
  .validator(hapusPetugasEventSchema)
  .handler(async ({ data }) => {
    const petugas = await db.petugasEvent.findUnique({
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

    if (!petugas) {
      throw new Error('Petugas event tidak ditemukan.')
    }

    if (petugas.event.isClosed) {
      throw new Error('Event ini sudah ditutup. Petugas tidak dapat dihapus.')
    }

    await db.petugasEvent.delete({
      where: {
        id: data.id,
      },
    })

    return {
      success: true,
    }
  })
