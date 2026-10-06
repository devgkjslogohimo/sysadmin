import type { KKData } from './types'

type HeaderData = Omit<KKData, 'anggota'>

export function parseHeader(rawText: string): HeaderData {
  const lines = normalizeLines(rawText)

  /*
   * Hanya ambil bagian header.
   * Berhenti ketika menemukan
   * anggota pertama.
   */
  const headerLines = getHeaderLines(lines)

  const noKK = findNoKK(headerLines)

  const kepalaKeluarga = findFieldValue(headerLines, [
    'NAMA KEPALA KELUARGA',

    /*
     * OCR sering salah:
     * KEPALA → KEPAIA
     */
    'NAMA KEPAIA KELUARGA',
  ])

  const alamat = findFieldValue(headerLines, ['ALAMAT'])

  const rtRw = findFieldValue(headerLines, ['RT/RW', 'RT / RW'])

  const { rt, rw } = parseRtRw(rtRw)

  const desaKelurahan = findFieldValue(headerLines, [
    'DESA/KELURAHAN',
    'DESA / KELURAHAN',
  ])

  const kecamatan = findFieldValue(headerLines, ['KECAMATAN'])

  const kodePos = findFieldValue(headerLines, ['KODE POS'])

  const kabupatenKota = findFieldValue(headerLines, [
    'KABUPATEN/KOTA',
    'KABUPATEN / KOTA',
  ])

  const provinsi = findFieldValue(headerLines, ['PROVINSI'])

  return {
    noKK,

    kepalaKeluarga,

    alamat: nullable(alamat),

    rt,

    rw,

    desaKelurahan: nullable(desaKelurahan),

    kecamatan: nullable(kecamatan),

    kabupatenKota: nullable(kabupatenKota),

    kodePos: nullable(cleanDigits(kodePos ?? '')),

    provinsi: nullable(provinsi),
  }
}

/* ======================================================
 * HEADER BOUNDARY
 * ====================================================== */

function getHeaderLines(lines: string[]) {
  /*
   * Cari:
   *
   * 1
   * TES1
   * 331220...
   *
   * Jangan menganggap nomor lain
   * sebagai awal anggota.
   */
  for (let index = 0; index < lines.length; index += 1) {
    if (!isRowNumber(lines[index])) {
      continue
    }

    const nearby = lines.slice(index + 1, index + 6)

    const hasNik = nearby.some(isIdentityNumber)

    if (hasNik) {
      return lines.slice(0, index)
    }
  }

  return lines
}

/* ======================================================
 * NO KK
 * ====================================================== */

function findNoKK(lines: string[]): string | null {
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

    /*
     * No. 3312202506090002
     */
    const inline = line.match(/^NO\s*\.?\s*:?\s*(\d{10,20})$/i)

    if (inline?.[1]) {
      return inline[1]
    }

    /*
     * No.
     * 3312202506090002
     */
    if (/^NO\s*\.?\s*:?\s*$/i.test(line)) {
      const next = cleanDigits(lines[index + 1] ?? '')

      if (isIdentityNumber(next)) {
        return next
      }
    }
  }

  return null
}

/* ======================================================
 * GENERIC HEADER FIELD
 * ====================================================== */

function findFieldValue(lines: string[], labels: string[]): string | null {
  for (let index = 0; index < lines.length; index += 1) {
    const current = normalizeSemantic(lines[index])

    for (const label of labels) {
      const normalizedLabel = normalizeSemantic(label)

      /*
       * Format:
       *
       * Alamat : JOHO
       */
      if (current.startsWith(`${normalizedLabel}:`)) {
        const separator = lines[index].indexOf(':')

        if (separator >= 0) {
          const value = cleanValue(lines[index].slice(separator + 1))

          if (value) {
            return value
          }
        }
      }

      /*
       * Format:
       *
       * Alamat
       * : JOHO
       */
      if (current === normalizedLabel) {
        for (
          let nextIndex = index + 1;
          nextIndex < Math.min(lines.length, index + 4);
          nextIndex += 1
        ) {
          const next = cleanValue(lines[nextIndex])

          if (!next) {
            continue
          }

          /*
           * Kalau baris selanjutnya
           * ternyata label baru,
           * jangan dipakai sebagai value.
           */
          if (isKnownHeaderLabel(next)) {
            break
          }

          return next
        }
      }
    }
  }

  return null
}

/* ======================================================
 * RT / RW
 * ====================================================== */

function parseRtRw(value: string | null) {
  if (!value) {
    return {
      rt: null,
      rw: null,
    }
  }

  const match = value.match(/(\d{1,3})\s*\/\s*(\d{1,3})/)

  if (!match) {
    return {
      rt: null,
      rw: null,
    }
  }

  return {
    rt: match[1],
    rw: match[2],
  }
}

/* ======================================================
 * HEADER LABEL
 * ====================================================== */

function isKnownHeaderLabel(value: string) {
  const normalized = normalizeSemantic(value)

  const labels = [
    'KARTU KELUARGA',

    'NAMA KEPALA KELUARGA',
    'NAMA KEPAIA KELUARGA',

    'ALAMAT',

    'RT/RW',
    'RT / RW',

    'DESA/KELURAHAN',
    'DESA / KELURAHAN',

    'KECAMATAN',

    'KODE POS',

    'KABUPATEN/KOTA',
    'KABUPATEN / KOTA',

    'PROVINSI',
  ]

  return labels.some((label) => normalized === normalizeSemantic(label))
}

/* ======================================================
 * UTILITY
 * ====================================================== */

function normalizeLines(value: string) {
  return value.replace(/\r/g, '').split('\n').map(cleanValue).filter(Boolean)
}

function cleanValue(value: string) {
  return value
    .replace(/^[\s:;|]+/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeSemantic(value: string) {
  return cleanValue(value)
    .toUpperCase()
    .replace(/–|—/g, '-')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanDigits(value: string) {
  return value.replace(/\D/g, '')
}

function isIdentityNumber(value: string) {
  const digits = cleanDigits(value)

  return digits === value.trim() && digits.length >= 10 && digits.length <= 20
}

function isRowNumber(value: string) {
  return /^\d{1,2}$/.test(value.trim())
}

function nullable(value: string | null) {
  if (!value) {
    return null
  }

  const result = value.trim()

  return result ? result : null
}
