import type { KKData } from './types'

import { parseHeader } from './parse-header'

import { parseMembers } from './parse-members'

export function parseKK(rawText: string): KKData {
  const header = parseHeader(rawText)

  const anggota = parseMembers(rawText)

  return {
    ...header,
    anggota,
  }
}
