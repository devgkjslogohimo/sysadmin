export const GEREJA_OPTIONS = [
  'Gereja Induk Slogohimo',
  'GKJ Slogohimo Pept. Jatisrono',
  'GKJ Slogohimo Pept. Joho',
  'GKJ Slogohimo Pept. Jatiroto',
] as const

export type Gereja = (typeof GEREJA_OPTIONS)[number]

export function normalizeGereja(
  value: string | null | undefined,
): Gereja | null | undefined {
  if (!value?.trim()) return null

  const normalized = value
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('id-ID')

  return GEREJA_OPTIONS.find(
    (gereja) => gereja.toLocaleLowerCase('id-ID') === normalized,
  )
}
