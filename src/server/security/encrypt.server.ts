import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'

export type EncryptedValue = {
  ciphertext: string
  iv: string
  authTag: string
}

function getEncryptionKey(): Buffer {
  const value = process.env.NIK_ENCRYPTION_KEY

  if (!value) {
    throw new Error('NIK_ENCRYPTION_KEY belum dikonfigurasi')
  }

  const key = Buffer.from(value, 'base64')

  if (key.length !== 32) {
    throw new Error('NIK_ENCRYPTION_KEY harus 32 byte')
  }

  return key
}

export function encryptValue(value: string): EncryptedValue {
  const key = getEncryptionKey()

  const iv = randomBytes(12)

  const cipher = createCipheriv(ALGORITHM, key, iv)

  const encrypted = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ])

  const authTag = cipher.getAuthTag()

  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  }
}

export function decryptValue(encrypted: EncryptedValue): string {
  const key = getEncryptionKey()

  const iv = Buffer.from(encrypted.iv, 'base64')

  const authTag = Buffer.from(encrypted.authTag, 'base64')

  const ciphertext = Buffer.from(encrypted.ciphertext, 'base64')

  const decipher = createDecipheriv(ALGORITHM, key, iv)

  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ])

  return decrypted.toString('utf8')
}
