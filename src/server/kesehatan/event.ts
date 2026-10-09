import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'

import {
  createEventKesehatanSchema,
  updateEventKesehatanSchema,
  eventKesehatanIdSchema,
  listEventKesehatanSchema,
} from './schemas'
import type { Prisma } from '#/generated/prisma/client'
import { requireHealthAccess } from '../auth/session.server'

export const listEventKesehatan = createServerFn({
  method: 'GET',
})
  .validator(listEventKesehatanSchema)
  .handler(async ({ data }) => {
    await requireHealthAccess()
    const { page, limit, q, status, tahun } = data

    const where: Prisma.EventKesehatanWhereInput = {
      ...(q
        ? {
            OR: [
              {
                nama: {
                  contains: q,
                  mode: 'insensitive',
                },
              },
              {
                lokasi: {
                  contains: q,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),

      ...(status !== 'all'
        ? {
            isClosed: status === 'selesai',
          }
        : {}),

      ...(tahun
        ? {
            tanggal: {
              gte: new Date(Date.UTC(tahun, 0, 1)),

              lt: new Date(Date.UTC(tahun + 1, 0, 1)),
            },
          }
        : {}),
    }

    const total = await db.eventKesehatan.count({
      where,
    })

    const totalPages = Math.max(Math.ceil(total / limit), 1)

    const safePage = Math.min(page, totalPages)

    const rows = await db.eventKesehatan.findMany({
      where,

      orderBy: [
        {
          tanggal: 'desc',
        },
        {
          id: 'desc',
        },
      ],

      skip: (safePage - 1) * limit,

      take: limit,

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

    return {
      data: rows.map((row) => ({
        id: row.id,

        nama: row.nama,

        tanggal: row.tanggal.toISOString().slice(0, 10),

        lokasi: row.lokasi,

        isClosed: row.isClosed,

        closedAt: row.closedAt?.toISOString() ?? null,

        petugas: row.petugas,

        jumlahPemeriksaan: row._count.pemeriksaan,
      })),

      pagination: {
        page: safePage,

        limit,

        total,

        totalPages,
      },
    }
  })

export const createEventKesehatan = createServerFn({
  method: 'POST',
})
  .validator(createEventKesehatanSchema)
  .handler(async ({ data }) => {
    await requireHealthAccess()
    const uniquePetugas = [
      ...new Map(
        data.petugas.map((nama) => [nama.trim().toLowerCase(), nama.trim()]),
      ).values(),
    ]

    const event = await db.eventKesehatan.create({
      data: {
        nama: data.nama,
        tanggal: new Date(`${data.tanggal}T00:00:00.000Z`),
        lokasi: data.lokasi || null,

        petugas: {
          create: uniquePetugas.map((nama) => ({
            nama,
          })),
        },
      },

      select: {
        id: true,
        nama: true,
      },
    })

    return event
  })

export const updateEventKesehatan = createServerFn({
  method: 'POST',
})
  .validator(updateEventKesehatanSchema)
  .handler(async ({ data }) => {
    await requireHealthAccess()
    const current = await db.eventKesehatan.findUnique({
      where: {
        id: data.id,
      },
      select: {
        id: true,
        isClosed: true,
      },
    })

    if (!current) {
      throw new Error('Event kesehatan tidak ditemukan.')
    }

    if (current.isClosed) {
      throw new Error('Event sudah ditutup dan tidak dapat diedit.')
    }

    return db.eventKesehatan.update({
      where: {
        id: data.id,
      },

      data: {
        nama: data.nama,
        tanggal: new Date(`${data.tanggal}T00:00:00.000Z`),
        lokasi: data.lokasi || null,
      },
      select: {
        id: true,
      },
    })
  })

export const closeEventKesehatan = createServerFn({
  method: 'POST',
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
        isClosed: true,
      },
    })

    if (!event) {
      throw new Error('Event kesehatan tidak ditemukan.')
    }

    if (event.isClosed) {
      throw new Error('Event ini sudah ditutup.')
    }

    await db.eventKesehatan.update({
      where: {
        id: data.id,
      },

      data: {
        isClosed: true,
        closedAt: new Date(),
      },
    })

    return {
      success: true,
    }
  })

export const deleteEventKesehatan = createServerFn({
  method: 'POST',
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

    if (event._count.pemeriksaan > 0) {
      throw new Error(
        'Event yang sudah memiliki pemeriksaan tidak boleh dihapus karena data pemeriksaan harus tetap disimpan.',
      )
    }

    await db.eventKesehatan.delete({
      where: {
        id: data.id,
      },
    })

    return {
      success: true,
    }
  })
