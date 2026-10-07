import { z } from 'zod'

const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Username minimal 3 karakter.')
  .max(50, 'Username maksimal 50 karakter.')
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    'Username hanya boleh berisi huruf, angka, titik, garis bawah, atau tanda minus.',
  )
  .transform((value) => value.toLowerCase())

export const loginSchema = z.object({
  username: usernameSchema,

  password: z
    .string()
    .min(1, 'Password wajib diisi.')
    .max(128, 'Password terlalu panjang.'),
})

export const initialAdminSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter.')
    .max(100, 'Nama maksimal 100 karakter.'),

  username: usernameSchema,

  password: z
    .string()
    .min(8, 'Password minimal 8 karakter.')
    .max(128, 'Password maksimal 128 karakter.'),
})
