import { createServerFn } from '@tanstack/react-start'

import { db } from '../../db.server'

import { decryptValue } from '../../security/encrypt.server'

import { assertLocalSensitiveMode } from './guard.server'

import { privateKKSchema } from './schemas'
import { requireAdmin } from '#/server/auth/session.server'

export const getKKPrivateLocal = createServerFn({
  method: 'GET',
})
  .validator(privateKKSchema)
  .handler(async ({ data }) => {
    await requireAdmin()
    assertLocalSensitiveMode()

    const row = await db.kartuKeluarga.findUnique({
      where: {
        id: data.id,
      },

      select: {
        id: true,

        noKkCiphertext: true,

        noKkIv: true,

        noKkAuthTag: true,

        kepalaKeluarga: true,

        alamat: true,

        rt: true,

        rw: true,

        desaKelurahan: true,

        kecamatan: true,

        kabupatenKota: true,

        kodePos: true,

        provinsi: true,

        anggota: {
          orderBy: {
            noUrut: 'asc',
          },

          select: {
            id: true,

            noUrut: true,

            nama: true,

            nikCiphertext: true,

            nikIv: true,

            nikAuthTag: true,

            jenisKelamin: true,

            tempatLahir: true,

            tanggalLahir: true,

            agama: true,

            pendidikan: true,

            pekerjaan: true,

            golonganDarah: true,
          },
        },
      },
    })

    if (!row) {
      throw new Error('Data Kartu Keluarga tidak ditemukan.')
    }

    const noKK = decryptValue({
      ciphertext: row.noKkCiphertext,

      iv: row.noKkIv,

      authTag: row.noKkAuthTag,
    })

    const anggota = row.anggota.map((member) => ({
      id: member.id,

      no: member.noUrut,

      nama: member.nama,

      nik: decryptValue({
        ciphertext: member.nikCiphertext,

        iv: member.nikIv,

        authTag: member.nikAuthTag,
      }),

      jenisKelamin: member.jenisKelamin,

      tempatLahir: member.tempatLahir,

      tanggalLahir: member.tanggalLahir,

      agama: member.agama,

      pendidikan: member.pendidikan,

      pekerjaan: member.pekerjaan,

      golonganDarah: member.golonganDarah,
    }))

    return {
      id: row.id,

      kk: {
        noKK,

        kepalaKeluarga: row.kepalaKeluarga,

        alamat: row.alamat,

        rt: row.rt,

        rw: row.rw,

        desaKelurahan: row.desaKelurahan,

        kecamatan: row.kecamatan,

        kabupatenKota: row.kabupatenKota,

        kodePos: row.kodePos,

        provinsi: row.provinsi,

        anggota,
      },
    }
  })
