import { z } from 'zod'

const nullableText = z.string().trim().nullable()

export const kkMemberSchema = z.object({
  id: z.number().int().positive().optional(),
  no: z.number().int().positive(),

  nama: z.string().trim().min(1, 'Nama tidak boleh kosong'),

  nik: z
    .string()
    .trim()
    .regex(/^\d{16}$/, 'NIK harus 16 digit'),

  jenisKelamin: z.enum(['LAKI-LAKI', 'PEREMPUAN']).nullable(),

  tempatLahir: nullableText,

  tanggalLahir: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, 'Tanggal lahir harus DD-MM-YYYY')
    .nullable(),

  agama: nullableText,
  pendidikan: nullableText,
  pekerjaan: nullableText,
  golonganDarah: nullableText,
  ayah: nullableText,
  ibu: nullableText,
  baptisAnak: nullableText,
  sidiBaptisDewasa: nullableText,
  menikah: nullableText,
  domisili: nullableText,
})

export const kkSchema = z.object({
  noKK: z
    .string()
    .trim()
    .regex(/^\d{16}$/, 'Nomor KK harus 16 digit'),

  kepalaKeluarga: z
    .string()
    .trim()
    .min(1, 'Kepala keluarga tidak boleh kosong'),

  alamat: nullableText,

  rt: z
    .string()
    .regex(/^\d{1,3}$/)
    .nullable(),

  rw: z
    .string()
    .regex(/^\d{1,3}$/)
    .nullable(),

  desaKelurahan: nullableText,
  kecamatan: nullableText,
  kabupatenKota: nullableText,

  kodePos: z
    .string()
    .regex(/^\d{5}$/, 'Kode pos harus 5 digit')
    .nullable(),

  provinsi: nullableText,

  anggota: z.array(kkMemberSchema).min(1, 'Tidak ada anggota keluarga'),
})

export type ValidatedKK = z.infer<typeof kkSchema>
