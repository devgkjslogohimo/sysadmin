import type { KKData, KKMember } from './types'

import { kkSchema } from './schema'

type ExcelValue = string | number | boolean | Date | null | undefined
type ExcelRow = ExcelValue[]

const REQUIRED_HEADERS = [
  'Keluarga',
  'Nomor',
  'Nama',
  'No KK',
  'NIK',
  'Alamat',

  'RT/RW',
  'Desa/Kelurahan',
  'Kecamatan',
  'Kabupaten/Kota',
  'Provinsi',
  'Kode Pos',

  'L/P',
  'Tempat Lahir',
  'Tanggal Lahir',

  'Agama',
  'Pendidikan',
  'Pekerjaan',
  'Golongan Darah',

  'Ayah',
  'Ibu',
  'Baptis Anak',
  'Sidi/Baptis Dewasa',
  'Menikah',
  'Domisili',
] as const

type HeaderName = (typeof REQUIRED_HEADERS)[number]

type FamilyBuffer = {
  key: string

  noKK: string | null
  alamat: string | null

  rt: string | null
  rw: string | null

  desaKelurahan: string | null
  kecamatan: string | null
  kabupatenKota: string | null
  provinsi: string | null
  kodePos: string | null

  anggota: KKMember[]
}

export type ExcelPreviewRow = {
  rowNumber: number

  keluarga: string
  nomor: string
  nama: string

  noKK: string
  nik: string

  alamat: string
  rtRw: string
  desaKelurahan: string
  kecamatan: string
  kabupatenKota: string
  provinsi: string
  kodePos: string

  jenisKelamin: string
  tempatLahir: string
  tanggalLahir: string

  agama: string
  pendidikan: string
  pekerjaan: string
  golonganDarah: string

  ayah: string
  ibu: string

  baptisAnak: string
  sidiBaptisDewasa: string
  menikah: string

  domisili: string
}

export type ExcelKKImportResult = {
  data: KKData[]
  preview: ExcelPreviewRow[]
  errors: string[]
  totalRows: number
}

export async function parseKKExcel(file: File): Promise<ExcelKKImportResult> {
  const { readSheet } = await import('read-excel-file/browser')

  const rows = (await readSheet(file)) as ExcelRow[]

  if (rows.length === 0) {
    return {
      data: [],
      preview: [],
      errors: ['File Excel tidak memiliki data.'],
      totalRows: 0,
    }
  }

  const headerRow = rows[0]

  const headerIndexes = new Map<string, number>()

  headerRow.forEach((value, index) => {
    const header = textValue(value)

    if (header) {
      headerIndexes.set(header, index)
    }
  })

  const missingHeaders = REQUIRED_HEADERS.filter(
    (header) => !headerIndexes.has(header),
  )

  if (missingHeaders.length > 0) {
    return {
      data: [],
      preview: [],
      errors: [`Kolom Excel tidak lengkap: ${missingHeaders.join(', ')}.`],
      totalRows: Math.max(rows.length - 1, 0),
    }
  }

  function cell(row: ExcelRow, name: HeaderName): ExcelValue {
    const index = headerIndexes.get(name)

    if (index === undefined) {
      return null
    }

    return row[index]
  }

  const preview: ExcelPreviewRow[] = []
  const errors: string[] = []

  const families = new Map<string, FamilyBuffer>()

  let currentFamilyKey: string | null = null

  for (let index = 1; index < rows.length; index += 1) {
    const row = rows[index]
    const excelRowNumber = index + 1

    if (isEmptyRow(row)) {
      continue
    }

    /*
     * Tentukan keluarga aktif.
     *
     * Pada format Excel, kolom Keluarga boleh hanya
     * diisi pada baris pertama keluarga.
     */
    const familyCell = uppercaseText(cell(row, 'Keluarga')) ?? ''

    if (familyCell) {
      currentFamilyKey = familyCell
    }

    /*
     * PREVIEW DIBUAT TERLEBIH DAHULU.
     *
     * Jadi baris tetap terlihat walaupun nantinya
     * gagal validasi.
     */
    preview.push({
      rowNumber: excelRowNumber,

      keluarga: familyCell || currentFamilyKey || '',

      nomor: textValue(cell(row, 'Nomor')),

      nama: requiredUppercaseText(cell(row, 'Nama')),

      noKK: textValue(cell(row, 'No KK')),

      nik: textValue(cell(row, 'NIK')),

      alamat: uppercaseText(cell(row, 'Alamat')) ?? '',

      rtRw: textValue(cell(row, 'RT/RW')),

      desaKelurahan: uppercaseText(cell(row, 'Desa/Kelurahan')) ?? '',

      kecamatan: uppercaseText(cell(row, 'Kecamatan')) ?? '',

      kabupatenKota: uppercaseText(cell(row, 'Kabupaten/Kota')) ?? '',

      provinsi: uppercaseText(cell(row, 'Provinsi')) ?? '',

      kodePos: textValue(cell(row, 'Kode Pos')),

      jenisKelamin:
        genderValue(cell(row, 'L/P')) ??
        textValue(cell(row, 'L/P')).toLocaleUpperCase('id-ID'),

      tempatLahir: uppercaseText(cell(row, 'Tempat Lahir')) ?? '',

      tanggalLahir: dateOrText(cell(row, 'Tanggal Lahir')) ?? '',

      agama: uppercaseText(cell(row, 'Agama')) ?? '',

      pendidikan: uppercaseText(cell(row, 'Pendidikan')) ?? '',

      pekerjaan: uppercaseText(cell(row, 'Pekerjaan')) ?? '',

      golonganDarah: uppercaseText(cell(row, 'Golongan Darah')) ?? '',

      ayah: uppercaseText(cell(row, 'Ayah')) ?? '',

      ibu: uppercaseText(cell(row, 'Ibu')) ?? '',

      baptisAnak: dateOrUppercaseText(cell(row, 'Baptis Anak')) ?? '',

      sidiBaptisDewasa:
        dateOrUppercaseText(cell(row, 'Sidi/Baptis Dewasa')) ?? '',

      menikah: dateOrUppercaseText(cell(row, 'Menikah')) ?? '',

      domisili: uppercaseText(cell(row, 'Domisili')) ?? '',
    })

    /*
     * Setelah preview dibuat baru lakukan validasi.
     */
    if (!currentFamilyKey) {
      errors.push(
        `Baris ${excelRowNumber}: kolom Keluarga belum memiliki nilai.`,
      )

      continue
    }

    let family = families.get(currentFamilyKey)

    if (!family) {
      family = {
        key: currentFamilyKey,

        noKK: null,
        alamat: null,

        rt: null,
        rw: null,

        desaKelurahan: null,
        kecamatan: null,
        kabupatenKota: null,
        provinsi: null,
        kodePos: null,

        anggota: [],
      }

      families.set(currentFamilyKey, family)
    }

    /*
     * NO KK
     */
    try {
      const noKKValue = identityValue(cell(row, 'No KK'), 'No KK')

      if (noKKValue) {
        if (family.noKK && family.noKK !== noKKValue) {
          errors.push(
            `Baris ${excelRowNumber}: No KK berbeda dalam Keluarga ${currentFamilyKey}.`,
          )
        } else {
          family.noKK = noKKValue
        }
      }
    } catch (error) {
      errors.push(
        `Baris ${excelRowNumber}: ${
          error instanceof Error ? error.message : 'No KK tidak dapat dibaca.'
        }`,
      )
    }

    /*
     * ALAMAT
     */
    const alamat = uppercaseText(cell(row, 'Alamat'))

    if (alamat) {
      if (family.alamat && family.alamat !== alamat) {
        errors.push(
          `Baris ${excelRowNumber}: Alamat berbeda dalam Keluarga ${currentFamilyKey}.`,
        )
      } else {
        family.alamat = alamat
      }
    }

    /*
     * ALAMAT ADMINISTRATIF
     */
    const rtRw = parseRtRw(nullableText(cell(row, 'RT/RW')))

    if (rtRw.rt) {
      family.rt = rtRw.rt
    }

    if (rtRw.rw) {
      family.rw = rtRw.rw
    }

    const desaKelurahan = uppercaseText(cell(row, 'Desa/Kelurahan'))

    if (desaKelurahan) {
      family.desaKelurahan = desaKelurahan
    }

    const kecamatan = uppercaseText(cell(row, 'Kecamatan'))

    if (kecamatan) {
      family.kecamatan = kecamatan
    }

    const kabupatenKota = uppercaseText(cell(row, 'Kabupaten/Kota'))

    if (kabupatenKota) {
      family.kabupatenKota = kabupatenKota
    }

    const provinsi = uppercaseText(cell(row, 'Provinsi'))

    if (provinsi) {
      family.provinsi = provinsi
    }

    const kodePos = digitsOrNull(cell(row, 'Kode Pos'))

    if (kodePos) {
      family.kodePos = kodePos
    }

    /*
     * NOMOR ANGGOTA
     */
    const nomor = positiveInteger(cell(row, 'Nomor'))

    if (nomor === null) {
      errors.push(`Baris ${excelRowNumber}: Nomor anggota tidak valid.`)

      continue
    }

    /*
     * NAMA
     */
    const nama = requiredUppercaseText(cell(row, 'Nama'))

    if (!nama) {
      errors.push(`Baris ${excelRowNumber}: Nama anggota tidak boleh kosong.`)

      continue
    }

    /*
     * NIK
     */
    let nik: string | null = null

    try {
      nik = identityValue(cell(row, 'NIK'), 'NIK')
    } catch (error) {
      errors.push(
        `Baris ${excelRowNumber}: ${
          error instanceof Error ? error.message : 'NIK tidak dapat dibaca.'
        }`,
      )

      continue
    }

    if (!nik) {
      errors.push(`Baris ${excelRowNumber}: NIK tidak boleh kosong.`)

      continue
    }

    /*
     * JENIS KELAMIN
     */
    const rawGender = textValue(cell(row, 'L/P'))

    const jenisKelamin = genderValue(cell(row, 'L/P'))

    if (rawGender && jenisKelamin === null) {
      errors.push(`Baris ${excelRowNumber}: L/P harus berisi L atau P.`)
    }

    /*
     * ANGGOTA
     */
    family.anggota.push({
      no: nomor,

      nama,

      nik,

      jenisKelamin,

      tempatLahir: uppercaseText(cell(row, 'Tempat Lahir')),

      tanggalLahir: dateOrText(cell(row, 'Tanggal Lahir')),

      agama: uppercaseText(cell(row, 'Agama')),

      pendidikan: uppercaseText(cell(row, 'Pendidikan')),

      pekerjaan: uppercaseText(cell(row, 'Pekerjaan')),

      golonganDarah: uppercaseText(cell(row, 'Golongan Darah')),

      ayah: uppercaseText(cell(row, 'Ayah')),

      ibu: uppercaseText(cell(row, 'Ibu')),

      baptisAnak: dateOrUppercaseText(cell(row, 'Baptis Anak')),

      sidiBaptisDewasa: dateOrUppercaseText(cell(row, 'Sidi/Baptis Dewasa')),

      menikah: dateOrUppercaseText(cell(row, 'Menikah')),

      domisili: uppercaseText(cell(row, 'Domisili')),
    })
  }

  /*
   * BENTUK DATA KK
   */
  const result: KKData[] = []

  for (const family of families.values()) {
    const anggota = [...family.anggota].sort((a, b) => a.no - b.no)

    const kepala = anggota.find((member) => member.no === 1)

    if (!kepala) {
      errors.push(
        `Keluarga ${family.key}: anggota dengan Nomor 1 tidak ditemukan.`,
      )

      continue
    }

    const candidate: KKData = {
      noKK: family.noKK,

      kepalaKeluarga: kepala.nama,

      alamat: family.alamat,

      rt: family.rt,
      rw: family.rw,

      desaKelurahan: family.desaKelurahan,

      kecamatan: family.kecamatan,

      kabupatenKota: family.kabupatenKota,

      kodePos: family.kodePos,

      provinsi: family.provinsi,

      anggota,
    }

    const validation = kkSchema.safeParse(candidate)

    if (!validation.success) {
      for (const issue of validation.error.issues) {
        const field =
          issue.path.length > 0 ? issue.path.map(String).join('.') : 'data'

        errors.push(`Keluarga ${family.key} — ${field}: ${issue.message}`)
      }

      continue
    }

    result.push(candidate)
  }

  return {
    data: result,
    preview,
    errors,
    totalRows: Math.max(rows.length - 1, 0),
  }
}

function textValue(value: ExcelValue): string {
  if (value === null || value === undefined) {
    return ''
  }

  if (value instanceof Date) {
    return formatDate(value)
  }

  return String(value).trim()
}

function nullableText(value: ExcelValue): string | null {
  const text = textValue(value)

  return text || null
}

function uppercaseText(value: ExcelValue): string | null {
  const text = nullableText(value)

  return text ? text.toLocaleUpperCase('id-ID') : null
}

function requiredUppercaseText(value: ExcelValue): string {
  return textValue(value).toLocaleUpperCase('id-ID')
}

function identityValue(
  value: ExcelValue,
  label: 'NIK' | 'No KK',
): string | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  /*
   * NIK / No KK harus diperlakukan
   * sebagai identitas, bukan angka hitung.
   *
   * Excel hanya menjamin sekitar 15 digit
   * signifikan sehingga identitas 16 digit
   * wajib disimpan sebagai Text.
   */
  if (typeof value === 'number') {
    if (!Number.isInteger(value) || !Number.isSafeInteger(value)) {
      throw new Error(`${label} 16 digit harus diformat sebagai Text di Excel.`)
    }

    const text = String(value)

    if (text.length >= 16) {
      throw new Error(`${label} 16 digit harus diformat sebagai Text di Excel.`)
    }

    return text
  }

  const digits = String(value).replace(/\D/g, '')

  return digits || null
}

function positiveInteger(value: ExcelValue): number | null {
  if (typeof value === 'number') {
    return Number.isInteger(value) && value > 0 ? value : null
  }

  const parsed = Number(textValue(value))

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function genderValue(value: ExcelValue): 'LAKI-LAKI' | 'PEREMPUAN' | null {
  const normalized = textValue(value).toLocaleUpperCase('id-ID')

  if (
    normalized === 'L' ||
    normalized === 'LAKI-LAKI' ||
    normalized === 'LAKI LAKI'
  ) {
    return 'LAKI-LAKI'
  }

  if (normalized === 'P' || normalized === 'PEREMPUAN') {
    return 'PEREMPUAN'
  }

  return null
}

/*
 * Field tanggal biasa.
 *
 * Jika Excel menghasilkan objek Date,
 * ubah ke DD-MM-YYYY.
 *
 * Jika teks berbentuk:
 * 1/2/2020
 * 1-2-2020
 * 1.2.2020
 *
 * juga dinormalisasi menjadi:
 * 01-02-2020
 */
function dateOrText(value: ExcelValue): string | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  if (value instanceof Date) {
    return formatDate(value)
  }

  const text = String(value).trim()

  const match = text.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)

  if (!match) {
    return text || null
  }

  const day = match[1].padStart(2, '0')

  const month = match[2].padStart(2, '0')

  const year = match[3]

  return `${day}-${month}-${year}`
}

/*
 * Khusus field yang bisa berisi tanggal
 * ATAU teks, misalnya:
 *
 * Baptis Anak
 * Sidi/Baptis Dewasa
 * Menikah
 *
 * Tanggal tetap dipertahankan sebagai tanggal,
 * sedangkan teks dibuat CAPITAL.
 */
function dateOrUppercaseText(value: ExcelValue): string | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  if (value instanceof Date) {
    return formatDate(value)
  }

  const text = String(value).trim()

  const match = text.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)

  if (match) {
    const day = match[1].padStart(2, '0')

    const month = match[2].padStart(2, '0')

    const year = match[3]

    return `${day}-${month}-${year}`
  }

  return text ? text.toLocaleUpperCase('id-ID') : null
}

function formatDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0')

  const month = String(date.getUTCMonth() + 1).padStart(2, '0')

  const year = date.getUTCFullYear()

  return `${day}-${month}-${year}`
}

function isEmptyRow(row: ExcelRow) {
  return row.every((value) => {
    if (value === null || value === undefined) {
      return true
    }

    return typeof value === 'string' ? value.trim() === '' : false
  })
}

function parseRtRw(value: string | null) {
  if (!value) {
    return {
      rt: null,
      rw: null,
    }
  }

  const match = value.match(/^(\d{1,3})\s*\/\s*(\d{1,3})$/)

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

function digitsOrNull(value: ExcelValue): string | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const digits = String(value).replace(/\D/g, '')

  return digits || null
}
