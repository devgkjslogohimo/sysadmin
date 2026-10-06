import { createHmac } from 'node:crypto'

function getHashKey(): string {
  const key = process.env.NIK_HASH_KEY

  if (!key) {
    throw new Error('NIK_HASH_KEY belum dikonfigurasi')
  }

  return key
}

function normalizeIdentityNumber(value: string): string {
  return value.replace(/\D/g, '').trim()
}

export function hashIdentityNumber(value: string): string {
  const normalized = normalizeIdentityNumber(value)

  return createHmac('sha256', getHashKey())
    .update(normalized, 'utf8')
    .digest('hex')
}
