import { z } from 'zod'

export const createUserSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter.')
    .max(100, 'Nama maksimal 100 karakter.'),

  username: z
    .string()
    .trim()
    .min(3, 'Username minimal 3 karakter.')
    .max(50, 'Username maksimal 50 karakter.')
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      'Username hanya boleh berisi huruf, angka, titik, garis bawah, atau tanda minus.',
    )
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, 'Password minimal 8 karakter.')
    .max(128, 'Password maksimal 128 karakter.'),

  role: z.enum(['ADMIN', 'PETUGAS']),
})

export const setUserActiveSchema = z.object({
  id: z.number().int().positive(),
  isActive: z.boolean(),
})

export const changeOwnPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Password saat ini wajib diisi.')
      .max(128),

    newPassword: z
      .string()
      .min(8, 'Password baru minimal 8 karakter.')
      .max(128, 'Password baru maksimal 128 karakter.'),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Password baru harus berbeda dari password saat ini.',
    path: ['newPassword'],
  })

export const resetUserPasswordSchema = z.object({
  id: z.number().int().positive(),

  newPassword: z
    .string()
    .min(8, 'Password baru minimal 8 karakter.')
    .max(128, 'Password baru maksimal 128 karakter.'),
})
