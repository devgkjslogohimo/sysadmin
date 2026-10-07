import { createServerFn } from '@tanstack/react-start'

import { db } from '../db.server'

import { hashPassword, verifyPassword } from '../auth/password.server'
import {
  clearSessionCookie,
  deleteAllUserSessions,
  requireAdmin,
  requireUser,
} from '../auth/session.server'

import {
  changeOwnPasswordSchema,
  createUserSchema,
  resetUserPasswordSchema,
  setUserActiveSchema,
} from './schemas'

export const listUsers = createServerFn({
  method: 'GET',
}).handler(async () => {
  await requireAdmin()

  const users = await db.user.findMany({
    orderBy: [
      {
        role: 'asc',
      },
      {
        nama: 'asc',
      },
    ],

    select: {
      id: true,
      nama: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  })

  return users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }))
})

export const createUser = createServerFn({
  method: 'POST',
})
  .validator(createUserSchema)
  .handler(async ({ data }) => {
    await requireAdmin()

    const existing = await db.user.findUnique({
      where: {
        username: data.username,
      },

      select: {
        id: true,
      },
    })

    if (existing) {
      throw new Error('Username sudah digunakan.')
    }

    const passwordHash = await hashPassword(data.password)

    const user = await db.user.create({
      data: {
        nama: data.nama,
        username: data.username,
        passwordHash,
        role: data.role,
        isActive: true,
      },

      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
        isActive: true,
      },
    })

    return {
      success: true,
      user,
    }
  })

export const setUserActive = createServerFn({
  method: 'POST',
})
  .validator(setUserActiveSchema)
  .handler(async ({ data }) => {
    const currentUser = await requireAdmin()

    const target = await db.user.findUnique({
      where: {
        id: data.id,
      },

      select: {
        id: true,
        nama: true,
        role: true,
        isActive: true,
      },
    })

    if (!target) {
      throw new Error('User tidak ditemukan.')
    }

    if (target.id === currentUser.id && data.isActive === false) {
      throw new Error('Anda tidak dapat menonaktifkan akun sendiri.')
    }

    if (target.role === 'ADMIN' && target.isActive && data.isActive === false) {
      const activeAdminCount = await db.user.count({
        where: {
          role: 'ADMIN',
          isActive: true,
        },
      })

      if (activeAdminCount <= 1) {
        throw new Error(
          'Administrator aktif terakhir tidak dapat dinonaktifkan.',
        )
      }
    }

    await db.user.update({
      where: {
        id: target.id,
      },

      data: {
        isActive: data.isActive,
      },
    })

    if (!data.isActive) {
      await deleteAllUserSessions(target.id)
    }

    return {
      success: true,
    }
  })

export const changeOwnPassword = createServerFn({
  method: 'POST',
})
  .validator(changeOwnPasswordSchema)
  .handler(async ({ data }) => {
    const currentUser = await requireUser()

    const user = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },

      select: {
        id: true,
        passwordHash: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      throw new Error('User tidak ditemukan atau sudah tidak aktif.')
    }

    const passwordValid = await verifyPassword(
      data.currentPassword,
      user.passwordHash,
    )

    if (!passwordValid) {
      throw new Error('Password saat ini tidak benar.')
    }

    const passwordHash = await hashPassword(data.newPassword)

    await db.user.update({
      where: {
        id: user.id,
      },

      data: {
        passwordHash,
      },
    })

    // Setelah password berubah, semua session lama dibatalkan.
    await deleteAllUserSessions(user.id)

    clearSessionCookie()

    return {
      success: true,
    }
  })

export const resetUserPassword = createServerFn({
  method: 'POST',
})
  .validator(resetUserPasswordSchema)
  .handler(async ({ data }) => {
    const currentUser = await requireAdmin()

    if (data.id === currentUser.id) {
      throw new Error('Untuk akun sendiri gunakan menu Ganti Password.')
    }

    const target = await db.user.findUnique({
      where: {
        id: data.id,
      },

      select: {
        id: true,
        nama: true,
      },
    })

    if (!target) {
      throw new Error('User tidak ditemukan.')
    }

    const passwordHash = await hashPassword(data.newPassword)

    await db.user.update({
      where: {
        id: target.id,
      },

      data: {
        passwordHash,
      },
    })

    // Putuskan semua login lama user tersebut.
    await deleteAllUserSessions(target.id)

    return {
      success: true,
    }
  })
