export type KKListItem = {
  id: number

  kepalaKeluarga: string | null
  alamat: string | null

  rt: string | null
  rw: string | null

  desaKelurahan: string | null
  kecamatan: string | null
  kabupatenKota: string | null
  provinsi: string | null

  jumlahAnggota: number
  createdAt: string
}

export type KKPagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}
