import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'

import { hashPassword, verifyPassword } from './password.server'
import {
  createUserSession,
  deleteCurrentSession,
  getCurrentSession,
} from './session.server'
import { initialAdminSchema, loginSchema } from './schemas'

export const login = createServerFn({
  method: 'POST',
})
  .validator(loginSchema)
  .handler(async ({ data }) => {
    const user = await db.user.findUnique({
      where: {
        username: data.username,
      },

      select: {
        id: true,
        nama: true,
        username: true,
        passwordHash: true,
        role: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      return {
        success: false as const,
        message: 'Username atau password tidak benar.',
      }
    }

    const passwordValid = await verifyPassword(data.password, user.passwordHash)

    if (!passwordValid) {
      return {
        success: false as const,
        message: 'Username atau password tidak benar.',
      }
    }

    await createUserSession(user.id)

    return {
      success: true as const,

      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
      },
    }
  })

export const logout = createServerFn({
  method: 'POST',
}).handler(async () => {
  await deleteCurrentSession()

  return {
    success: true,
  }
})

export const getCurrentUser = createServerFn({
  method: 'GET',
}).handler(async () => {
  const session = await getCurrentSession()

  if (!session) {
    return null
  }

  return session.user
})

export const getInitialSetupStatus = createServerFn({
  method: 'GET',
}).handler(async () => {
  const userCount = await db.user.count()

  return {
    requiresSetup: userCount === 0,
  }
})

export const createInitialAdmin = createServerFn({
  method: 'POST',
})
  .validator(initialAdminSchema)
  .handler(async ({ data }) => {
    const userCount = await db.user.count()

    if (userCount > 0) {
      throw new Error(
        'Setup awal sudah selesai. Administrator baru harus dibuat oleh administrator.',
      )
    }

    const passwordHash = await hashPassword(data.password)

    const user = await db.user.create({
      data: {
        nama: data.nama,
        username: data.username,
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },

      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
      },
    })

    await createUserSession(user.id)

    return {
      success: true,
      user,
    }
  })
