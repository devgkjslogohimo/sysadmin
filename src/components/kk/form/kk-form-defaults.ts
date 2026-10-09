import type { ValidatedKK } from '@/lib/kk-parser/schema'

export function createEmptyMember(no: number): ValidatedKK['anggota'][number] {
  return {
    no,
    nama: '',
    nik: '',
    jenisKelamin: null,
    tempatLahir: null,
    tanggalLahir: null,
    agama: null,
    pendidikan: null,
    pekerjaan: null,
    golonganDarah: null,

    ayah: null,
    ibu: null,
    baptisAnak: null,
    sidiBaptisDewasa: null,
    menikah: null,
    domisili: null,
  }
}

export function createEmptyKK(): ValidatedKK {
  return {
    noKK: '',
    kepalaKeluarga: '',
    alamat: null,
    rt: null,
    rw: null,
    desaKelurahan: null,
    kecamatan: null,
    kabupatenKota: null,
    kodePos: null,
    provinsi: null,
    anggota: [createEmptyMember(1)],
  }
}

export function normalizeKKFormValues(values: ValidatedKK): ValidatedKK {
  return {
    ...values,

    anggota: values.anggota.map((member, index) => ({
      ...member,
      no: index + 1,
    })),
  }
}
