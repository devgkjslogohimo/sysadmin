import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'
import { maskIdentityNumber } from '../kk/utils.server'
import { decryptValue } from '../security/encrypt.server'

import { anggotaIdSchema } from './schemas'
import { requireAdmin } from '../auth/session.server'

export const getAnggotaDetail = createServerFn({
  method: 'GET',
})
  .validator(anggotaIdSchema)
  .handler(async ({ data }) => {
    await requireAdmin()
    const anggota = await db.anggotaKeluarga.findUnique({
      where: {
        id: data.id,
      },

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
        pendidikan: true,
        pekerjaan: true,
        golonganDarah: true,

        kk: {
          select: {
            kepalaKeluarga: true,

            alamat: true,
            rt: true,
            rw: true,

            desaKelurahan: true,
            kecamatan: true,
            kabupatenKota: true,
            kodePos: true,
            provinsi: true,
          },
        },
      },
    })

    if (!anggota) {
      throw new Error('Data anggota tidak ditemukan.')
    }

    const nik = decryptValue({
      ciphertext: anggota.nikCiphertext,
      iv: anggota.nikIv,
      authTag: anggota.nikAuthTag,
    })

    return {
      id: anggota.id,
      kkId: anggota.kkId,
      noUrut: anggota.noUrut,

      nama: anggota.nama,
      nik: maskIdentityNumber(nik),

      jenisKelamin: anggota.jenisKelamin,

      tempatLahir: anggota.tempatLahir,
      tanggalLahir: anggota.tanggalLahir,

      agama: anggota.agama,
      pendidikan: anggota.pendidikan,
      pekerjaan: anggota.pekerjaan,
      golonganDarah: anggota.golonganDarah,

      kepalaKeluarga: anggota.kk.kepalaKeluarga,

      alamat: anggota.kk.alamat,
      rt: anggota.kk.rt,
      rw: anggota.kk.rw,

      desaKelurahan: anggota.kk.desaKelurahan,
      kecamatan: anggota.kk.kecamatan,
      kabupatenKota: anggota.kk.kabupatenKota,
      kodePos: anggota.kk.kodePos,
      provinsi: anggota.kk.provinsi,
    }
  })
