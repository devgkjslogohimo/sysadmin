import type { Prisma } from '@/generated/prisma/client'

import { hashIdentityNumber } from '../security/hash.server'

import type { AnggotaSearchBy, ListAnggotaInput } from './schemas'

type SortBy = ListAnggotaInput['sortBy']

type SortOrder = ListAnggotaInput['sortOrder']

function buildNamaWhere(q: string): Prisma.AnggotaKeluargaWhereInput {
  return {
    OR: [
      {
        nama: {
          contains: q,
          mode: 'insensitive',
        },
      },

      {
        kk: {
          is: {
            kepalaKeluarga: {
              contains: q,
              mode: 'insensitive',
            },
          },
        },
      },
    ],
  }
}

function buildAlamatWhere(q: string): Prisma.AnggotaKeluargaWhereInput {
  return {
    kk: {
      is: {
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
      },
    },
  }
}

function buildNikWhere(q: string): Prisma.AnggotaKeluargaWhereInput {
  const nik = q.replace(/\D/g, '')

  if (!nik) {
    return {
      id: -1,
    }
  }

  return {
    nikHash: hashIdentityNumber(nik),
  }
}

export function buildAnggotaWhere(
  query: string,
  searchBy: AnggotaSearchBy,
): Prisma.AnggotaKeluargaWhereInput {
  const q = query.trim()

  if (!q) {
    return {}
  }

  switch (searchBy) {
    case 'nama':
      return buildNamaWhere(q)

    case 'nik':
      return buildNikWhere(q)

    case 'alamat':
      return buildAlamatWhere(q)

    case 'all':
    default: {
      const conditions: Prisma.AnggotaKeluargaWhereInput[] = [
        buildNamaWhere(q),
        buildAlamatWhere(q),
      ]

      const numericQuery = q.replace(/\D/g, '')

      /*
       * Jangan menganggap angka pendek
       * seperti RT/RW sebagai NIK.
       */
      if (numericQuery.length >= 10 && numericQuery === q.replace(/\s/g, '')) {
        conditions.push(buildNikWhere(q))
      }

      return {
        OR: conditions,
      }
    }
  }
}

export function buildAnggotaOrderBy(
  sortBy: SortBy,
  sortOrder: SortOrder,
): Prisma.AnggotaKeluargaOrderByWithRelationInput {
  switch (sortBy) {
    case 'kepalaKeluarga':
      return {
        kk: {
          kepalaKeluarga: sortOrder,
        },
      }

    case 'alamat':
      return {
        kk: {
          alamat: sortOrder,
        },
      }

    case 'createdAt':
      return {
        createdAt: sortOrder,
      }

    case 'nama':
    default:
      return {
        nama: sortOrder,
      }
  }
}
