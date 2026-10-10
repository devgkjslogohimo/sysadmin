import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'

import { decryptValue } from '../security/encrypt.server'

import { maskIdentityNumber } from '../kk/utils.server'

import { buildAnggotaOrderBy, buildAnggotaWhere } from './list-query.server'

import { listAnggotaSchema } from './schemas'
import { requireAdmin } from '../auth/session.server'

export const listAnggota = createServerFn({
  method: 'GET',
})
  .validator(listAnggotaSchema)
  .handler(async ({ data }) => {
    await requireAdmin()
    const { page, limit, q, searchBy, sortBy, sortOrder } = data

    const where = buildAnggotaWhere(q, searchBy)

    const orderBy = buildAnggotaOrderBy(sortBy, sortOrder)

    const total = await db.anggotaKeluarga.count({
      where,
    })

    const totalPages = Math.max(Math.ceil(total / limit), 1)

    const safePage = Math.min(page, totalPages)

    const rows = await db.anggotaKeluarga.findMany({
      where,

      orderBy,

      skip: (safePage - 1) * limit,

      take: limit,

      select: {
        id: true,
        kkId: true,
        noUrut: true,
        nama: true,

        nikCiphertext: true,

        nikIv: true,

        nikAuthTag: true,

        jenisKelamin: true,

        tempatLahir: true,

        tanggalLahir: true,

        agama: true,

        gereja: true,

        pekerjaan: true,

        createdAt: true,

        kk: {
          select: {
            kepalaKeluarga: true,

            alamat: true,

            rt: true,

            rw: true,

            desaKelurahan: true,

            kecamatan: true,

            kabupatenKota: true,

            provinsi: true,
          },
        },
      },
    })

    return {
      data: rows.map((row) => {
        const nik = decryptValue({
          ciphertext: row.nikCiphertext,

          iv: row.nikIv,

          authTag: row.nikAuthTag,
        })

        return {
          id: row.id,

          kkId: row.kkId,

          no: row.noUrut,

          nama: row.nama,

          nik: maskIdentityNumber(nik),

          jenisKelamin: row.jenisKelamin,

          tempatLahir: row.tempatLahir,

          tanggalLahir: row.tanggalLahir,

          agama: row.agama,

          gereja: row.gereja,

          pekerjaan: row.pekerjaan,

          kepalaKeluarga: row.kk.kepalaKeluarga,

          alamat: row.kk.alamat,

          rt: row.kk.rt,

          rw: row.kk.rw,

          desaKelurahan: row.kk.desaKelurahan,

          kecamatan: row.kk.kecamatan,

          kabupatenKota: row.kk.kabupatenKota,

          provinsi: row.kk.provinsi,

          createdAt: row.createdAt.toISOString(),
        }
      }),

      pagination: {
        page: safePage,

        limit,

        total,

        totalPages,
      },
    }
  })
