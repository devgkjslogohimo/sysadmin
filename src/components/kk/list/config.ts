import type { DataTableSearchOption } from '@/components/data-table/data-table'

export const kkSearchOptions: DataTableSearchOption[] = [
  {
    value: 'all',
    label: 'Semua',
    placeholder: 'Cari nama, NIK atau alamat...',
  },
  {
    value: 'nama',
    label: 'Nama',
    placeholder: 'Cari nama kepala keluarga atau anggota...',
  },
  {
    value: 'nik',
    label: 'NIK',
    placeholder: 'Masukkan NIK lengkap...',
  },
  {
    value: 'alamat',
    label: 'Alamat',
    placeholder: 'Cari alamat, desa, kecamatan...',
  },
]

export const kkColumnLabels: Partial<Record<string, string>> = {
  kepalaKeluarga: 'Kepala Keluarga',

  alamat: 'Alamat',

  wilayah: 'Wilayah',

  jumlahAnggota: 'Anggota',

  createdAt: 'Tanggal Dibuat',
}
