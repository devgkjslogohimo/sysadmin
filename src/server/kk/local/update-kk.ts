import { createServerFn } from '@tanstack/react-start'

import { db } from '../../db.server'

import { encryptValue } from '../../security/encrypt.server'

import { hashIdentityNumber } from '../../security/hash.server'

import { assertLocalSensitiveMode } from './guard.server'

import { updateKKLocalSchema } from './schemas'
import { requireAdmin } from '#/server/auth/session.server'

export const updateKKLocal = createServerFn({
  method: 'POST',
})
  .validator(updateKKLocalSchema)
  .handler(async ({ data }) => {
    await requireAdmin()
    assertLocalSensitiveMode()

    const { id, kk } = data

    const noKkHash = hashIdentityNumber(kk.noKK)

    const noKkEncrypted = encryptValue(kk.noKK)

    const result = await db.$transaction(async (tx) => {
      /*
       * Pastikan data yang akan
       * di-edit memang masih ada.
       */
      const current = await tx.kartuKeluarga.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      })

      if (!current) {
        throw new Error('Data Kartu Keluarga tidak ditemukan.')
      }

      /*
       * Nomor KK boleh tetap sama
       * dengan record ini sendiri,
       * tapi tidak boleh sama dengan
       * record KK lain.
       */
      const duplicate = await tx.kartuKeluarga.findUnique({
        where: {
          noKkHash,
        },

        select: {
          id: true,
        },
      })

      if (duplicate && duplicate.id !== id) {
        throw new Error('Nomor KK ini sudah digunakan oleh data lain.')
      }

      await tx.kartuKeluarga.update({
        where: {
          id,
        },

        data: {
          noKkHash,

          noKkCiphertext: noKkEncrypted.ciphertext,

          noKkIv: noKkEncrypted.iv,

          noKkAuthTag: noKkEncrypted.authTag,

          kepalaKeluarga: kk.kepalaKeluarga,

          alamat: kk.alamat,

          rt: kk.rt,

          rw: kk.rw,

          desaKelurahan: kk.desaKelurahan,

          kecamatan: kk.kecamatan,

          kabupatenKota: kk.kabupatenKota,

          kodePos: kk.kodePos,

          provinsi: kk.provinsi,
        },
      })

      /*
       * Untuk versi local sekarang
       * lebih sederhana dan aman:
       * anggota lama dihapus lalu
       * dibuat ulang dalam transaksi
       * yang sama.
       */
      await tx.anggotaKeluarga.deleteMany({
        where: {
          kkId: id,
        },
      })

      const anggotaData = kk.anggota.map((member, index) => {
        const nikHash = hashIdentityNumber(member.nik)

        const nikEncrypted = encryptValue(member.nik)

        return {
          kkId: id,

          noUrut: index + 1,

          nama: member.nama,

          nikHash,

          nikCiphertext: nikEncrypted.ciphertext,

          nikIv: nikEncrypted.iv,

          nikAuthTag: nikEncrypted.authTag,

          jenisKelamin: member.jenisKelamin,

          tempatLahir: member.tempatLahir,

          tanggalLahir: member.tanggalLahir,

          agama: member.agama,

          pendidikan: member.pendidikan,

          pekerjaan: member.pekerjaan,

          golonganDarah: member.golonganDarah,
        }
      })

      await tx.anggotaKeluarga.createMany({
        data: anggotaData,
      })

      return {
        id,

        memberCount: anggotaData.length,
      }
    })

    return {
      success: true,

      message: 'Data berhasil diperbarui.',

      id: result.id,

      memberCount: result.memberCount,
    }
  })
