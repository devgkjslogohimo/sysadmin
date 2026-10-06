import type { KKData } from './types'

function maskNumber(value: string | null) {
  if (!value) {
    return value
  }

  if (value.length <= 4) {
    return '*'.repeat(value.length)
  }

  return '*'.repeat(value.length - 4) + value.slice(-4)
}

export function createMaskedKK(data: KKData): KKData {
  return {
    ...data,

    noKK: maskNumber(data.noKK),

    anggota: data.anggota.map((member) => ({
      ...member,
      nik: maskNumber(member.nik) ?? '',
    })),
  }
}
