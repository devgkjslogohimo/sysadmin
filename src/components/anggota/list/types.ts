export type AnggotaListItem = {
  id: number
  kkId: number
  no: number

  nama: string
  nik: string

  jenisKelamin: string | null

  tempatLahir: string | null

  tanggalLahir: string | null

  agama: string | null

  pekerjaan: string | null

  kepalaKeluarga: string | null

  alamat: string | null

  rt: string | null

  rw: string | null

  desaKelurahan: string | null

  kecamatan: string | null

  kabupatenKota: string | null

  provinsi: string | null

  createdAt: string
}

export type AnggotaPagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}
