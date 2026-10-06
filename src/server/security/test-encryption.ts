import { decryptValue, encryptValue } from './encrypt.server'

const dummy = '1234567890123456'

const encrypted = encryptValue(dummy)

const decrypted = decryptValue(encrypted)

if (decrypted !== dummy) {
  throw new Error('Encryption test gagal')
}

console.log('Encryption test berhasil')
