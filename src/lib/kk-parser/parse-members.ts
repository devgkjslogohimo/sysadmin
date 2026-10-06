import type { KKMember } from './types'

const RELIGIONS = new Set([
  'ISLAM',
  'KRISTEN',
  'KRISTEN PROTESTAN',
  'PROTESTAN',
  'KATOLIK',
  'KATHOLIK',
  'HINDU',
  'BUDDHA',
  'BUDHA',
  'KONGHUCU',
  'KEPERCAYAAN',
])

const BLOOD_TYPES = new Set([
  'A',
  'B',
  'AB',
  'O',
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
  'TIDAK TAHU',
  'TIDAK DIKETAHUI',
])

const EDUCATION_PATTERNS = [
  'TIDAK/BELUM SEKOLAH',
  'BELUM TAMAT SD/SEDERAJAT',
  'TAMAT SD/SEDERAJAT',
  'SD/SEDERAJAT',

  'SLTP/SEDERAJAT',
  'SMP/SEDERAJAT',

  'SLTA/SEDERAJAT',
  'SMA/SEDERAJAT',
  'SMK/SEDERAJAT',

  'DIPLOMA I',
  'DIPLOMA II',
  'DIPLOMA III',
  'DIPLOMA IV',

  'AKADEMI',

  'STRATA I',
  'STRATA II',
  'STRATA III',

  'S1',
  'S2',
  'S3',
]

const OCCUPATIONS = new Set([
  'BELUM/TIDAK BEKERJA',
  'MENGURUS RUMAH TANGGA',

  'PELAJAR/MAHASISWA',
  'PELAJAR',
  'MAHASISWA',

  'PENSIUNAN',

  'PEGAWAI NEGERI SIPIL',
  'PNS',

  'TNI',
  'POLRI',

  'PETANI',
  'PETANI/PEKEBUN',
  'PEKEBUN',

  'PETERNAK',

  'NELAYAN',
  'NELAYAN/PERIKANAN',

  'KARYAWAN SWASTA',
  'KARYAWAN BUMN',
  'KARYAWAN BUMD',
  'KARYAWAN HONORER',

  'BURUH HARIAN LEPAS',

  'PEDAGANG',

  'GURU',
  'DOSEN',

  'DOKTER',
  'PERAWAT',
  'BIDAN',

  'SOPIR',

  'PERANGKAT DESA',

  'KEPALA DESA',

  'WIRASWASTA',

  'LAINNYA',
])

export function parseMembers(rawText: string): KKMember[] {
  const lines = normalizeLines(rawText)

  /*
   * PRIORITAS 1
   *
   * Format baru:
   *
   * 1
   * TES1
   * NIK
   * LAKI-LAKI
   * ...
   *
   * 2
   * TES2
   * ...
   */
  const numbered = parseNumberedMembers(lines)

  if (numbered.length > 0) {
    return numbered
  }

  /*
   * PRIORITAS 2
   *
   * Fallback untuk OCR lama
   * yang nomor barisnya hilang.
   */
  return parseNikAnchoredMembers(lines)
}

/* ======================================================
 * NUMBERED MEMBER MODE
 * ====================================================== */

function parseNumberedMembers(lines: string[]): KKMember[] {
  const starts: number[] = []

  for (let index = 0; index < lines.length; index += 1) {
    if (!isRowNumber(lines[index])) {
      continue
    }

    /*
     * Dalam beberapa baris berikutnya
     * harus ada NIK.
     */
    const nearby = lines.slice(index + 1, index + 7)

    if (nearby.some(isIdentityNumber)) {
      starts.push(index)
    }
  }

  if (starts.length === 0) {
    return []
  }

  const members: KKMember[] = []

  for (let index = 0; index < starts.length; index += 1) {
    const start = starts[index]

    const end = starts[index + 1] ?? lines.length

    const block = lines.slice(start + 1, end)

    const member = parseMemberBlock(block, members.length + 1)

    if (member) {
      members.push(member)
    }
  }

  return members
}

function parseMemberBlock(block: string[], no: number): KKMember | null {
  if (block.length === 0) {
    return null
  }

  const nikIndex = block.findIndex(isIdentityNumber)

  if (nikIndex < 0) {
    return null
  }

  const nik = cleanDigits(block[nikIndex])

  const genderIndex = block.findIndex(
    (value) => normalizeGender(value) !== null,
  )

  const gender = genderIndex >= 0 ? normalizeGender(block[genderIndex]) : null

  const dateIndex = block.findIndex((value) => normalizeDate(value) !== null)

  const tanggalLahir = dateIndex >= 0 ? normalizeDate(block[dateIndex]) : null

  const religionIndex = block.findIndex(
    (value) => normalizeReligion(value) !== null,
  )

  const agama =
    religionIndex >= 0 ? normalizeReligion(block[religionIndex]) : null

  const educationIndex = block.findIndex(
    (value) => normalizeEducation(value) !== null,
  )

  const pendidikan =
    educationIndex >= 0 ? normalizeEducation(block[educationIndex]) : null

  const occupationIndex = block.findIndex(
    (value) => normalizeOccupation(value) !== null,
  )

  const pekerjaan =
    occupationIndex >= 0 ? normalizeOccupation(block[occupationIndex]) : null

  const bloodIndex = block.findIndex(
    (value) => normalizeBloodType(value) !== null,
  )

  const golonganDarah =
    bloodIndex >= 0 ? normalizeBloodType(block[bloodIndex]) : null

  /*
   * Nama tidak boleh bergantung
   * apakah NIK berada sebelum/atau
   * sesudah jenis kelamin.
   *
   * Contoh anggota 3:
   *
   * TES3
   * PEREMPUAN
   * 331220...
   */
  const namaIndex = findNameIndex(block, {
    nikIndex,
    genderIndex,
    dateIndex,
    religionIndex,
    educationIndex,
    occupationIndex,
    bloodIndex,
  })

  const nama = namaIndex >= 0 ? cleanText(block[namaIndex]) : ''

  /*
   * Tempat lahir adalah field text
   * bebas yang tersisa setelah
   * field semantic dibuang.
   */
  const tempatLahir = findBirthPlace(
    block,
    new Set([
      nikIndex,
      genderIndex,
      dateIndex,
      religionIndex,
      educationIndex,
      occupationIndex,
      bloodIndex,
      namaIndex,
    ]),
  )

  return {
    no,

    nama,

    nik,

    jenisKelamin: gender,

    tempatLahir,

    tanggalLahir,

    agama,

    pendidikan,

    pekerjaan,

    golonganDarah,
  }
}

/* ======================================================
 * NAME
 * ====================================================== */

function findNameIndex(
  block: string[],
  used: {
    nikIndex: number
    genderIndex: number
    dateIndex: number
    religionIndex: number
    educationIndex: number
    occupationIndex: number
    bloodIndex: number
  },
) {
  const excluded = new Set([
    used.nikIndex,
    used.genderIndex,
    used.dateIndex,
    used.religionIndex,
    used.educationIndex,
    used.occupationIndex,
    used.bloodIndex,
  ])

  /*
   * Nama biasanya field text
   * pertama setelah nomor anggota.
   */
  for (let index = 0; index < block.length; index += 1) {
    if (excluded.has(index)) {
      continue
    }

    const value = cleanText(block[index])

    if (!isFreeText(value)) {
      continue
    }

    return index
  }

  return -1
}

/* ======================================================
 * BIRTH PLACE
 * ====================================================== */

function findBirthPlace(block: string[], excluded: Set<number>): string | null {
  for (let index = 0; index < block.length; index += 1) {
    if (excluded.has(index)) {
      continue
    }

    const value = cleanText(block[index])

    if (!isFreeText(value)) {
      continue
    }

    /*
     * Remaining free text pertama
     * setelah nama dianggap
     * tempat lahir.
     */
    return value
  }

  return null
}

/* ======================================================
 * FALLBACK: NIK ANCHOR MODE
 * ====================================================== */

function parseNikAnchoredMembers(lines: string[]): KKMember[] {
  const nikIndexes: number[] = []

  for (let index = 0; index < lines.length; index += 1) {
    if (isIdentityNumber(lines[index])) {
      /*
       * Jangan masukkan No KK.
       *
       * No KK biasanya berada
       * sebelum area anggota.
       */
      if (looksLikeNoKKContext(lines, index)) {
        continue
      }

      nikIndexes.push(index)
    }
  }

  if (nikIndexes.length === 0) {
    return []
  }

  return nikIndexes.map((nikIndex, memberIndex) => {
    const previousNik = nikIndexes[memberIndex - 1] ?? -1

    const nextNik = nikIndexes[memberIndex + 1] ?? lines.length

    const start = Math.max(previousNik + 1, nikIndex - 4)

    const end = Math.min(nextNik, nikIndex + 12)

    const block = lines.slice(start, end)

    /*
     * Tambahkan nomor dummy
     * lalu gunakan parser block.
     */
    const parsed = parseMemberBlock(block, memberIndex + 1)

    if (parsed) {
      return parsed
    }

    return {
      no: memberIndex + 1,

      nama: '',

      nik: cleanDigits(lines[nikIndex]),

      jenisKelamin: null,

      tempatLahir: null,

      tanggalLahir: null,

      agama: null,

      pendidikan: null,

      pekerjaan: null,

      golonganDarah: null,
    }
  })
}

/* ======================================================
 * GENDER
 * ====================================================== */

function normalizeGender(value: string): 'LAKI-LAKI' | 'PEREMPUAN' | null {
  const normalized = normalizeSemantic(value)

  if (normalized === 'PEREMPUAN') {
    return 'PEREMPUAN'
  }

  if (normalized === 'LAKI-LAKI' || normalized === 'LAKI LAKI') {
    return 'LAKI-LAKI'
  }

  return null
}

/* ======================================================
 * DATE
 * ====================================================== */

function normalizeDate(value: string): string | null {
  const normalized = value.trim().replace(/[./]/g, '-').replace(/\s+/g, '')

  const match = normalized.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)

  if (!match) {
    return null
  }

  const day = Number(match[1])

  const month = Number(match[2])

  const year = Number(match[3])

  if (
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900 ||
    year > 2100
  ) {
    return null
  }

  return [
    String(day).padStart(2, '0'),

    String(month).padStart(2, '0'),

    String(year),
  ].join('-')
}

/* ======================================================
 * RELIGION
 * ====================================================== */

function normalizeReligion(value: string): string | null {
  const normalized = normalizeSemantic(value)

  if (!RELIGIONS.has(normalized)) {
    return null
  }

  if (normalized === 'KATHOLIK') {
    return 'KATOLIK'
  }

  if (normalized === 'BUDHA') {
    return 'BUDDHA'
  }

  return normalized
}

/* ======================================================
 * EDUCATION
 * ====================================================== */

function normalizeEducation(value: string): string | null {
  const normalized = normalizeSemantic(value)

  for (const education of EDUCATION_PATTERNS) {
    if (normalized === education) {
      return normalized
    }
  }

  return null
}

/* ======================================================
 * OCCUPATION
 * ====================================================== */

function normalizeOccupation(value: string): string | null {
  const normalized = normalizeSemantic(value)

  if (OCCUPATIONS.has(normalized)) {
    return normalized
  }

  return null
}

/* ======================================================
 * BLOOD TYPE
 * ====================================================== */

function normalizeBloodType(value: string): string | null {
  const normalized = normalizeSemantic(value)

  if (BLOOD_TYPES.has(normalized)) {
    return normalized
  }

  return null
}

/* ======================================================
 * FREE TEXT
 * ====================================================== */

function isFreeText(value: string) {
  if (!value) {
    return false
  }

  if (
    isIdentityNumber(value) ||
    isRowNumber(value) ||
    normalizeGender(value) ||
    normalizeDate(value) ||
    normalizeReligion(value) ||
    normalizeEducation(value) ||
    normalizeOccupation(value) ||
    normalizeBloodType(value)
  ) {
    return false
  }

  if (isKnownHeaderOrTableLabel(value)) {
    return false
  }

  return /[A-Za-z]/.test(value)
}

/* ======================================================
 * LABELS / JUNK
 * ====================================================== */

function isKnownHeaderOrTableLabel(value: string) {
  const normalized = normalizeSemantic(value)

  const labels = [
    'KARTU KELUARGA',
    'REPUBLIK INDONESIA',

    'NAMA KEPALA KELUARGA',
    'NAMA KEPAIA KELUARGA',

    'ALAMAT',
    'RT/RW',

    'DESA/KELURAHAN',
    'KECAMATAN',
    'KODE POS',

    'KABUPATEN/KOTA',
    'PROVINSI',

    'NO',
    'NAMA LENGKAP',
    'NIK',

    'JENIS KELAMIN',
    'TEMPAT LAHIR',
    'TANGGAL LAHIR',

    'AGAMA',
    'PENDIDIKAN',

    'JENIS PEKERJAAN',

    'GOLONGAN DARAH',
  ]

  return labels.includes(normalized)
}

/* ======================================================
 * NIK
 * ====================================================== */

function isIdentityNumber(value: string) {
  const trimmed = value.trim()

  /*
   * Development:
   * dummy NIK masih boleh
   * 10 sampai 20 digit.
   */
  return /^\d{10,20}$/.test(trimmed)
}

function looksLikeNoKKContext(lines: string[], index: number) {
  const previous = normalizeSemantic(lines[index - 1] ?? '')

  const twoBefore = normalizeSemantic(lines[index - 2] ?? '')

  return (
    previous === 'NO' ||
    previous === 'KARTU KELUARGA' ||
    twoBefore === 'KARTU KELUARGA'
  )
}

function cleanDigits(value: string) {
  return value.replace(/\D/g, '')
}

/* ======================================================
 * GENERAL
 * ====================================================== */

function normalizeLines(value: string) {
  return value.replace(/\r/g, '').split('\n').map(cleanText).filter(Boolean)
}

function cleanText(value: string) {
  return value
    .replace(/^[\s:;|]+/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeSemantic(value: string) {
  return cleanText(value)
    .toUpperCase()
    .replace(/–|—/g, '-')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function isRowNumber(value: string) {
  return /^[1-9]\d?$/.test(value.trim())
}
