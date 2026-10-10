import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'

import { decryptValue } from '../security/encrypt.server'

import { kkDetailSchema } from './schemas'

import { maskIdentityNumber } from './utils.server'
import { requireAdmin } from '../auth/session.server'

export const getKKDetail = createServerFn({
  method: 'GET',
})
  .validator(kkDetailSchema)
  .handler(async ({ data }) => {
    await requireAdmin()
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

        createdAt: true,

        updatedAt: true,

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

            gereja: true,

            pendidikan: true,

            pekerjaan: true,

            golonganDarah: true,

            ayah: true,
            ibu: true,
            baptisAnak: true,
            sidiBaptisDewasa: true,
            menikah: true,
            domisili: true,
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

    const anggota = row.anggota.map((member) => {
      const nik = decryptValue({
        ciphertext: member.nikCiphertext,

        iv: member.nikIv,

        authTag: member.nikAuthTag,
      })

      return {
        id: member.id,

        no: member.noUrut,

        nama: member.nama,

        nik: maskIdentityNumber(nik),

        jenisKelamin: member.jenisKelamin,

        tempatLahir: member.tempatLahir,

        tanggalLahir: member.tanggalLahir,

        agama: member.agama,

        gereja: member.gereja,
        pendidikan: member.pendidikan,

        pekerjaan: member.pekerjaan,

        golonganDarah: member.golonganDarah,

        ayah: member.ayah,
        ibu: member.ibu,
        baptisAnak: member.baptisAnak,
        sidiBaptisDewasa: member.sidiBaptisDewasa,
        menikah: member.menikah,
        domisili: member.domisili,
      }
    })

    return {
      id: row.id,

      noKK: maskIdentityNumber(noKK),

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

      createdAt: row.createdAt.toISOString(),

      updatedAt: row.updatedAt.toISOString(),
    }
  })
