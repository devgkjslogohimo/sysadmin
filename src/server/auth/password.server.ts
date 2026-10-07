import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

const KEY_LENGTH = 64
const SALT_BYTES = 16

function deriveKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error)
        return
      }

      resolve(derivedKey)
    })
  })
}

export async function hashPassword(password: string) {
  if (password.length < 8) {
    throw new Error('Password minimal 8 karakter.')
  }

  const salt = randomBytes(SALT_BYTES).toString('hex')
  const hash = await deriveKey(password, salt)

  return `scrypt$${salt}$${hash.toString('hex')}`
}

export async function verifyPassword(
  password: string,
  storedPasswordHash: string,
) {
  const [algorithm, salt, hashHex] = storedPasswordHash.split('$')

  if (algorithm !== 'scrypt' || !salt || !hashHex) {
    return false
  }

  const storedHash = Buffer.from(hashHex, 'hex')

  if (storedHash.length !== KEY_LENGTH) {
    return false
  }

  const candidateHash = await deriveKey(password, salt)

  return timingSafeEqual(storedHash, candidateHash)
}
