import { createServerFn } from '@tanstack/react-start'

import { db } from '../../db.server'

import { encryptValue } from '../../security/encrypt.server'

import { hashIdentityNumber } from '../../security/hash.server'

import { updateKKLocalSchema } from './schemas'
import { requireAdmin } from '#/server/auth/session.server'

export const updateKKLocal = createServerFn({
  method: 'POST',
})
  .validator(updateKKLocalSchema)
  .handler(async ({ data }) => {
    await requireAdmin()

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
       * Ambil anggota yang saat ini tersimpan.
       * ID harus dipertahankan karena dapat sudah terhubung
       * dengan riwayat pemeriksaan kesehatan.
       */
      const existingMembers = await tx.anggotaKeluarga.findMany({
        where: {
          kkId: id,
        },

        select: {
          id: true,
          nama: true,

          _count: {
            select: {
              pemeriksaanKesehatan: true,
            },
          },
        },
      })

      const existingIds = new Set(existingMembers.map((member) => member.id))

      const incomingExistingIds = kk.anggota
        .map((member) => member.id)
        .filter((memberId): memberId is number => memberId !== undefined)

      /*
       * Jangan menerima ID anggota milik KK lain.
       */
      for (const memberId of incomingExistingIds) {
        if (!existingIds.has(memberId)) {
          throw new Error(
            'Terdapat data anggota yang tidak sesuai dengan Kartu Keluarga ini.',
          )
        }
      }

      /*
       * Jangan menerima ID anggota yang sama lebih dari sekali.
       */
      if (new Set(incomingExistingIds).size !== incomingExistingIds.length) {
        throw new Error(
          'Terdapat anggota keluarga yang tercatat lebih dari satu kali.',
        )
      }

      /*
       * Anggota yang hilang dari form dianggap akan dihapus.
       */
      const incomingIdSet = new Set(incomingExistingIds)

      const removedMembers = existingMembers.filter(
        (member) => !incomingIdSet.has(member.id),
      )

      /*
       * Anggota yang sudah mempunyai riwayat kesehatan
       * tidak boleh dihapus.
       */
      const memberWithHealthHistory = removedMembers.find(
        (member) => member._count.pemeriksaanKesehatan > 0,
      )

      if (memberWithHealthHistory) {
        throw new Error(
          `Anggota ${memberWithHealthHistory.nama} tidak dapat dihapus karena sudah memiliki riwayat pemeriksaan kesehatan.`,
        )
      }

      /*
       * Hapus hanya anggota yang benar-benar dihapus dari form
       * dan tidak mempunyai riwayat kesehatan.
       */
      if (removedMembers.length > 0) {
        await tx.anggotaKeluarga.deleteMany({
          where: {
            id: {
              in: removedMembers.map((member) => member.id),
            },
          },
        })
      }

      /*
       * Update anggota lama dan buat anggota baru.
       */
      for (let index = 0; index < kk.anggota.length; index += 1) {
        const member = kk.anggota[index]

        const nikHash = hashIdentityNumber(member.nik)
        const nikEncrypted = encryptValue(member.nik)

        const memberData = {
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

          ayah: member.ayah,
          ibu: member.ibu,
          baptisAnak: member.baptisAnak,
          sidiBaptisDewasa: member.sidiBaptisDewasa,
          menikah: member.menikah,
          domisili: member.domisili,
        }

        if (member.id !== undefined) {
          await tx.anggotaKeluarga.update({
            where: {
              id: member.id,
            },

            data: memberData,
          })
        } else {
          await tx.anggotaKeluarga.create({
            data: {
              kkId: id,
              ...memberData,
            },
          })
        }
      }

      return {
        id,

        memberCount: kk.anggota.length,
      }
    })

    return {
      success: true,

      message: 'Data berhasil diperbarui.',

      id: result.id,

      memberCount: result.memberCount,
    }
  })
