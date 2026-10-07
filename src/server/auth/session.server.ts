import { createHash, randomBytes } from 'node:crypto'

import {
  getRequestHeader,
  setResponseHeader,
} from '@tanstack/react-start/server'

import { db } from '../db.server'

const SESSION_TTL_MS = 12 * 60 * 60 * 1000

function getSessionCookieName() {
  return process.env.NODE_ENV === 'production'
    ? '__Host-gkjs_session'
    : 'gkjs_session'
}

function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function setSessionCookie(token: string, expiresAt: Date) {
  const parts = [
    `${getSessionCookieName()}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Expires=${expiresAt.toUTCString()}`,
  ]

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure')
  }

  setResponseHeader('Set-Cookie', parts.join('; '))
}

export function clearSessionCookie() {
  const parts = [
    `${getSessionCookieName()}=`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    'Max-Age=0',
  ]

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure')
  }

  setResponseHeader('Set-Cookie', parts.join('; '))
}

export function readSessionToken() {
  const cookieHeader = getRequestHeader('cookie')

  if (!cookieHeader) {
    return null
  }

  const cookieName = getSessionCookieName()

  for (const cookie of cookieHeader.split(/;\s*/)) {
    const separatorIndex = cookie.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const name = cookie.slice(0, separatorIndex)
    const value = cookie.slice(separatorIndex + 1)

    if (name !== cookieName) {
      continue
    }

    try {
      return decodeURIComponent(value)
    } catch {
      return null
    }
  }

  return null
}

export async function createUserSession(userId: number) {
  const token = randomBytes(32).toString('base64url')
  const tokenHash = hashSessionToken(token)

  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  const session = await db.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },

    select: {
      id: true,
      expiresAt: true,
    },
  })

  setSessionCookie(token, expiresAt)

  return session
}

export async function getCurrentSession() {
  const token = readSessionToken()

  if (!token) {
    return null
  }

  const tokenHash = hashSessionToken(token)

  const session = await db.session.findUnique({
    where: {
      tokenHash,
    },

    select: {
      id: true,
      expiresAt: true,

      user: {
        select: {
          id: true,
          nama: true,
          username: true,
          role: true,
          isActive: true,
        },
      },
    },
  })

  if (!session) {
    return null
  }

  if (session.expiresAt <= new Date() || !session.user.isActive) {
    await db.session.deleteMany({
      where: {
        id: session.id,
      },
    })

    clearSessionCookie()

    return null
  }

  return session
}

export async function deleteCurrentSession() {
  const token = readSessionToken()

  if (token) {
    await db.session.deleteMany({
      where: {
        tokenHash: hashSessionToken(token),
      },
    })
  }

  clearSessionCookie()
}

export async function deleteAllUserSessions(userId: number) {
  await db.session.deleteMany({
    where: {
      userId,
    },
  })
}

export async function requireUser() {
  const session = await getCurrentSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  return session.user
}

export async function requireRole(...allowedRoles: Array<'ADMIN' | 'PETUGAS'>) {
  const user = await requireUser()

  const allowed = allowedRoles.some((role) => role === user.role)

  if (!allowed) {
    throw new Error('Forbidden')
  }

  return user
}

export async function requireAdmin() {
  return requireRole('ADMIN')
}

export async function requireHealthAccess() {
  return requireRole('ADMIN', 'PETUGAS')
}
