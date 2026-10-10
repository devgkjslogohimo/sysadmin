import { z } from 'zod'

export const anggotaSearchBySchema = z.enum([
  'all',
  'nama',
  'nik',
  'alamat',
  'gereja',
])

export const anggotaIdSchema = z.object({
  id: z.number().int().positive(),
})

export const listAnggotaSchema = z.object({
  page: z.number().int().positive().default(1),

  limit: z
    .union([z.literal(10), z.literal(20), z.literal(50), z.literal(100)])
    .default(20),

  q: z.string().trim().max(100).default(''),

  searchBy: anggotaSearchBySchema.default('all'),

  sortBy: z
    .enum(['nama', 'kepalaKeluarga', 'alamat', 'gereja', 'createdAt'])
    .default('nama'),

  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type AnggotaSearchBy = z.infer<typeof anggotaSearchBySchema>

export type ListAnggotaInput = z.infer<typeof listAnggotaSchema>
