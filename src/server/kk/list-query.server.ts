import type { Prisma } from '@/generated/prisma/client'

import { hashIdentityNumber } from '../security/hash.server'

import type { ListKKInput, SearchBy } from './schemas'

type SortBy = ListKKInput['sortBy']

type SortOrder = ListKKInput['sortOrder']

function buildNameSearch(q: string): Prisma.KartuKeluargaWhereInput {
  return {
    OR: [
      {
        kepalaKeluarga: {
          contains: q,
          mode: 'insensitive',
        },
      },

      {
        anggota: {
          some: {
            nama: {
              contains: q,
              mode: 'insensitive',
            },
          },
        },
      },
    ],
  }
}

function buildAddressSearch(q: string): Prisma.KartuKeluargaWhereInput {
  return {
    OR: [
      {
        alamat: {
          contains: q,
          mode: 'insensitive',
        },
      },

      {
        desaKelurahan: {
          contains: q,
          mode: 'insensitive',
        },
      },

      {
        kecamatan: {
          contains: q,
          mode: 'insensitive',
        },
      },

      {
        kabupatenKota: {
          contains: q,
          mode: 'insensitive',
        },
      },

      {
        provinsi: {
          contains: q,
          mode: 'insensitive',
        },
      },
    ],
  }
}

function buildNikSearch(q: string): Prisma.KartuKeluargaWhereInput {
  const normalized = q.replace(/\D/g, '')

  if (!normalized) {
    return {
      id: -1,
    }
  }

  const nikHash = hashIdentityNumber(normalized)

  return {
    anggota: {
      some: {
        nikHash,
      },
    },
  }
}

export function buildKKWhere(
  query: string,
  searchBy: SearchBy,
): Prisma.KartuKeluargaWhereInput {
  const q = query.trim()

  if (!q) {
    return {}
  }

  switch (searchBy) {
    case 'nama':
      return buildNameSearch(q)

    case 'nik':
      return buildNikSearch(q)

    case 'alamat':
      return buildAddressSearch(q)

    case 'all':
    default: {
      const textSearch: Prisma.KartuKeluargaWhereInput[] = [
        buildNameSearch(q),
        buildAddressSearch(q),
      ]

      const normalizedNik = q.replace(/\D/g, '')

      /*
       * Kalau query terlihat seperti NIK,
       * ikut cari berdasarkan hash NIK.
       */
      if (normalizedNik.length >= 10) {
        textSearch.push(buildNikSearch(normalizedNik))
      }

      return {
        OR: textSearch,
      }
    }
  }
}

export function buildKKOrderBy(
  sortBy: SortBy,
  sortOrder: SortOrder,
): Prisma.KartuKeluargaOrderByWithRelationInput {
  switch (sortBy) {
    case 'kepalaKeluarga':
      return {
        kepalaKeluarga: sortOrder,
      }

    case 'alamat':
      return {
        alamat: sortOrder,
      }

    case 'jumlahAnggota':
      return {
        anggota: {
          _count: sortOrder,
        },
      }

    case 'createdAt':
    default:
      return {
        createdAt: sortOrder,
      }
  }
}
