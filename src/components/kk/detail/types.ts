export type KKMemberView = {
  id: number
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

  ayah: string | null
  ibu: string | null
  baptisAnak: string | null
  sidiBaptisDewasa: string | null
  menikah: string | null
  domisili: string | null
}
