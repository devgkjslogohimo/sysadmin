import type { DataTableSearchOption } from '@/components/data-table/data-table'

export const anggotaSearchOptions: DataTableSearchOption[] = [
  {
    value: 'all',
    label: 'Semua',
    placeholder: 'Cari nama, NIK atau alamat...',
  },
  {
    value: 'nama',
    label: 'Nama',
    placeholder: 'Cari nama anggota...',
  },
  {
    value: 'nik',
    label: 'NIK',
    placeholder: 'Masukkan NIK lengkap...',
  },
  {
    value: 'alamat',
    label: 'Alamat',
    placeholder: 'Cari alamat, desa atau kecamatan...',
  },

  {
    value: 'gereja',
    label: 'Gereja',
    placeholder: 'Cari nama gereja...',
  },
]

export const anggotaColumnLabels: Partial<Record<string, string>> = {
  nama: 'Nama',

  nik: 'NIK',

  jenisKelamin: 'Jenis Kelamin',

  kepalaKeluarga: 'Kepala Keluarga',

  alamat: 'Alamat',

  createdAt: 'Tanggal Dibuat',

  gereja: 'Gereja',
}
