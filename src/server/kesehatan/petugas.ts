import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'

import { hapusPetugasEventSchema, tambahPetugasEventSchema } from './schemas'

export const tambahPetugasEvent = createServerFn({
  method: 'POST',
})
  .validator(tambahPetugasEventSchema)
  .handler(async ({ data }) => {
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
    await db.petugasEvent.delete({
      where: {
        id: data.id,
      },
    })

    return {
      success: true,
    }
  })
