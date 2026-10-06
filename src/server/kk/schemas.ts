import { z } from 'zod'

export const kkDetailSchema = z.object({
  id: z.number().int().positive(),
})

export const searchBySchema = z.enum(['all', 'nama', 'nik', 'alamat'])

export const listKKSchema = z.object({
  page: z.number().int().positive().default(1),

  limit: z
    .union([z.literal(10), z.literal(20), z.literal(50), z.literal(100)])
    .default(20),

  q: z.string().trim().max(100).default(''),

  searchBy: searchBySchema.default('all'),

  sortBy: z
    .enum(['kepalaKeluarga', 'alamat', 'jumlahAnggota', 'createdAt'])
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type SearchBy = z.infer<typeof searchBySchema>

export type ListKKInput = z.infer<typeof listKKSchema>
