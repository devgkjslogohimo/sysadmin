import { normalizeText } from './normalize'
import { parseHeader } from './parse-header'

const text = `
KARTU KELUARGA
No. 331221110711112222
TEST
Desa/Kelurahan
TAWING KIDUL
: TAWANGREJO
Kecamatan
: JATIPURNO
004/002
Kabupaten/Kota
: WONOGIRI
57693

REPUBLIK INDONESIA

Provinsi
: JAWA TENGAH
`

const lines = normalizeText(text)

const result = parseHeader(lines)

console.log(result)
