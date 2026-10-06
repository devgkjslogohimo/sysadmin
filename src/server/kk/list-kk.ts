import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'

import { buildKKOrderBy, buildKKWhere } from './list-query.server'

import { listKKSchema } from './schemas'

export const listKK = createServerFn({
  method: 'GET',
})
  .validator(listKKSchema)
  .handler(async ({ data }) => {
    const { page, limit, q, searchBy, sortBy, sortOrder } = data

    const where = buildKKWhere(q, searchBy)

    const orderBy = buildKKOrderBy(sortBy, sortOrder)

    const total = await db.kartuKeluarga.count({
      where,
    })

    const totalPages = Math.max(Math.ceil(total / limit), 1)

    const safePage = Math.min(page, totalPages)

    const rows = await db.kartuKeluarga.findMany({
      where,

      orderBy,

      skip: (safePage - 1) * limit,

      take: limit,

      select: {
        id: true,

        kepalaKeluarga: true,

        alamat: true,

        rt: true,

        rw: true,

        desaKelurahan: true,

        kecamatan: true,

        kabupatenKota: true,

        kodePos: true,

        provinsi: true,

        createdAt: true,

        updatedAt: true,

        _count: {
          select: {
            anggota: true,
          },
        },
      },
    })

    return {
      data: rows.map((row) => ({
        id: row.id,

        kepalaKeluarga: row.kepalaKeluarga,

        alamat: row.alamat,

        rt: row.rt,

        rw: row.rw,

        desaKelurahan: row.desaKelurahan,

        kecamatan: row.kecamatan,

        kabupatenKota: row.kabupatenKota,

        kodePos: row.kodePos,

        provinsi: row.provinsi,

        jumlahAnggota: row._count.anggota,

        createdAt: row.createdAt.toISOString(),

        updatedAt: row.updatedAt.toISOString(),
      })),

      pagination: {
        page: safePage,

        limit,

        total,

        totalPages,
      },
    }
  })
