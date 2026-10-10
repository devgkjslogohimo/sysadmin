import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'

import { encryptValue } from '../security/encrypt.server'

import { hashIdentityNumber } from '../security/hash.server'

import { kkSchema } from '@/lib/kk-parser/schema'
import { requireAdmin } from '../auth/session.server'

export const saveKK = createServerFn({
  method: 'POST',
})
  .validator(kkSchema)
  .handler(async ({ data }) => {
    await requireAdmin()
    const noKkHash = hashIdentityNumber(data.noKK)

    const encryptedNoKK = encryptValue(data.noKK)

    const anggotaData = data.anggota.map((member, index) => {
      const nikHash = hashIdentityNumber(member.nik)

      const encryptedNik = encryptValue(member.nik)

      return {
        noUrut: index + 1,

        nama: member.nama,

        nikHash,

        nikCiphertext: encryptedNik.ciphertext,

        nikIv: encryptedNik.iv,

        nikAuthTag: encryptedNik.authTag,

        jenisKelamin: member.jenisKelamin,

        tempatLahir: member.tempatLahir,

        tanggalLahir: member.tanggalLahir,

        agama: member.agama,
        gereja: member.gereja ?? null,
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

    /*
     * Optional early duplicate check.
     *
     * Ini bukan transaction.
     * Constraint UNIQUE di database
     * tetap menjadi perlindungan utama.
     */
    const existing = await db.kartuKeluarga.findUnique({
      where: {
        noKkHash,
      },

      select: {
        id: true,
      },
    })

    if (existing) {
      throw new Error('Nomor KK sudah tersimpan.')
    }
    const result = await db.kartuKeluarga.create({
      data: {
        noKkHash,

        noKkCiphertext: encryptedNoKK.ciphertext,

        noKkIv: encryptedNoKK.iv,

        noKkAuthTag: encryptedNoKK.authTag,

        kepalaKeluarga: data.kepalaKeluarga,

        alamat: data.alamat,

        rt: data.rt,

        rw: data.rw,

        desaKelurahan: data.desaKelurahan,

        kecamatan: data.kecamatan,

        kabupatenKota: data.kabupatenKota,

        kodePos: data.kodePos,

        provinsi: data.provinsi,

        anggota: {
          createMany: {
            data: anggotaData,
          },
        },
      },

      select: {
        id: true,

        _count: {
          select: {
            anggota: true,
          },
        },
      },
    })

    return {
      success: true,

      message: 'Kartu Keluarga berhasil disimpan.',

      id: result.id,

      memberCount: result._count.anggota,
    }
  })
