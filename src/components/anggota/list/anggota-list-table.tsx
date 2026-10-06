import type { OnChangeFn, SortingState } from '@tanstack/react-table'

import { DataTable } from '@/components/data-table/data-table'

import { anggotaColumns } from './anggota-columns'

import type { AnggotaListItem } from './types'

export type AnggotaSearchBy = 'all' | 'nama' | 'nik' | 'alamat'

type Props = {
  items: AnggotaListItem[]

  searchValue: string

  searchBy: AnggotaSearchBy

  sorting: SortingState

  onSearchChange: (value: string) => void

  onSearchByChange: (value: AnggotaSearchBy) => void

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
]

export function AnggotaListTable({
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
      columns={anggotaColumns}
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
