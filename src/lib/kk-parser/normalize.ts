export function normalizeText(raw: string): string[] {
  return raw
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

export function cleanValue(value?: string | null): string | null {
  if (!value) {
    return null
  }

  return value.replace(/^:\s*/, '').trim()
}

export function cleanSpaces(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}
