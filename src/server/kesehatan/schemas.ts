import { z } from 'zod'

const positiveId = z.number().int().positive()

/* ======================================================
 * EVENT
 * ====================================================== */

const eventKesehatanFieldsSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(1, 'Nama event wajib diisi')
    .max(150, 'Nama event maksimal 150 karakter'),

  tanggal: z
    .string()
    .min(1, 'Tanggal event wajib diisi')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Tanggal event tidak valid'),

  lokasi: z.string().trim().max(200, 'Lokasi maksimal 200 karakter'),
})

export const eventKesehatanIdSchema = z.object({
  id: positiveId,
})

export const createEventKesehatanSchema = eventKesehatanFieldsSchema.extend({
  petugas: z.array(z.string().trim().min(1).max(100)).max(30),
})

export const updateEventKesehatanSchema = eventKesehatanFieldsSchema.extend({
  id: positiveId,
})

export type CreateEventKesehatanInput = z.infer<
  typeof createEventKesehatanSchema
>

export type UpdateEventKesehatanInput = z.infer<
  typeof updateEventKesehatanSchema
>

/* ======================================================
 * PENCARIAN WARGA
 * ====================================================== */

export const searchWargaKesehatanSchema = z.object({
  eventId: positiveId,

  q: z.string().trim().min(1).max(100),
})

/* ======================================================
 * PEMERIKSAAN
 * ====================================================== */

export const pemeriksaanKesehatanFieldsSchema = z.object({
  tensiSistolik: z.number().int().positive().nullable(),

  tensiDiastolik: z.number().int().positive().nullable(),

  gulaDarah: z.number().int().positive().nullable(),

  kolesterol: z.number().int().positive().nullable(),

  asamUrat: z.number().positive().nullable(),

  beratBadan: z.number().positive().nullable(),

  tinggiBadan: z.number().positive().nullable(),

  keluhan: z.string().trim().max(1000),

  hasilRingkas: z.string().trim().max(1000),
})

export type PemeriksaanKesehatanFormValues = z.infer<
  typeof pemeriksaanKesehatanFieldsSchema
>

export const savePemeriksaanKesehatanSchema =
  pemeriksaanKesehatanFieldsSchema.extend({
    eventId: positiveId,
    anggotaId: positiveId,
  })

export const updatePemeriksaanKesehatanSchema =
  pemeriksaanKesehatanFieldsSchema.extend({
    id: positiveId,
  })

export const riwayatPemeriksaanSchema = z.object({
  anggotaId: positiveId,
})

export const listPemeriksaanEventSchema = z.object({
  eventId: positiveId,
})

/* ======================================================
 * PETUGAS EVENT
 * ====================================================== */

const petugasEventFieldsSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(1, 'Nama petugas wajib diisi')
    .max(100, 'Nama petugas maksimal 100 karakter'),
})

export const petugasEventFormSchema = petugasEventFieldsSchema

export type PetugasEventFormValues = z.infer<typeof petugasEventFormSchema>

export const tambahPetugasEventSchema = petugasEventFieldsSchema.extend({
  eventId: positiveId,
})

export const hapusPetugasEventSchema = z.object({
  id: positiveId,
})

export const listEventKesehatanSchema = z.object({
  page: z.number().int().positive().default(1),

  limit: z
    .union([z.literal(10), z.literal(20), z.literal(50), z.literal(100)])
    .default(10),

  q: z.string().trim().max(100).default(''),

  status: z.enum(['all', 'aktif', 'selesai']).default('all'),

  tahun: z.number().int().min(2000).max(2100).optional(),
})
