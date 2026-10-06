import { z } from 'zod'

import { kkSchema } from '@/lib/kk-parser/schema'

export const privateKKSchema = z.object({
  id: z.number().int().positive(),
})

export const updateKKLocalSchema = z.object({
  id: z.number().int().positive(),

  kk: kkSchema,
})
