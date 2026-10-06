export type KKMember = {
  no: number
  nama: string
  nik: string
  jenisKelamin: string | null
  tempatLahir: string | null
  tanggalLahir: string | null
  agama: string | null
  pendidikan: string | null
  pekerjaan: string | null
  golonganDarah: string | null
}

export type KKData = {
  noKK: string | null
  kepalaKeluarga: string | null

  alamat: string | null

  rt: string | null
  rw: string | null

  desaKelurahan: string | null
  kecamatan: string | null
  kabupatenKota: string | null
  kodePos: string | null
  provinsi: string | null

  anggota: KKMember[]
}
