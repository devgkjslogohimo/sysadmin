import type { OnChangeFn, SortingState } from '@tanstack/react-table'

import { DataTable } from '@/components/data-table/data-table'

import { kkColumns } from './kk-columns'

import type { KKListItem } from './types'

export type KKSearchBy = 'all' | 'nama' | 'nik' | 'alamat'

type Props = {
  items: KKListItem[]

  searchValue: string

  searchBy: KKSearchBy

  sorting: SortingState

  onSearchChange: (value: string) => void

  onSearchByChange: (value: KKSearchBy) => void

  onSortingChange: OnChangeFn<SortingState>
}

const searchOptions = [
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

export function KKListTable({
  items,

  searchValue,
  searchBy,

  sorting,

  onSearchChange,
  onSearchByChange,

  onSortingChange,
}: Props) {
  return (
    <DataTable
      columns={kkColumns}
      data={items}
      searchValue={searchValue}
      searchMode={searchBy}
      searchOptions={searchOptions}
      sorting={sorting}
      onSearchChange={onSearchChange}
      onSearchModeChange={(value) => {
        if (
          value === 'all' ||
          value === 'nama' ||
          value === 'nik' ||
          value === 'alamat'
        ) {
          onSearchByChange(value)
        }
      }}
      onSortingChange={onSortingChange}
    />
  )
}
