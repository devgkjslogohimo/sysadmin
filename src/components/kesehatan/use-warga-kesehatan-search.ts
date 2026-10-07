import { useEffect, useState } from 'react'

import { searchWargaKesehatan } from '@/server/kesehatan'

export type WargaKesehatan = Awaited<
  ReturnType<typeof searchWargaKesehatan>
>[number]

type Props = {
  eventId: number
  refreshKey: number
}

export function useWargaKesehatanSearch({ eventId, refreshKey }: Props) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<WargaKesehatan[]>([])

  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const query = q.trim()

    setHasSearched(false)
    setError(null)

    if (!query) {
      setResults([])
      setIsSearching(false)

      return
    }

    let cancelled = false

    const timer = window.setTimeout(async () => {
      setIsSearching(true)

      try {
        const data = await searchWargaKesehatan({
          data: {
            eventId,
            q: query,
          },
        })

        if (!cancelled) {
          setResults(data)
          setHasSearched(true)
        }
      } catch (error) {
        if (!cancelled) {
          setResults([])
          setHasSearched(true)

          setError(
            error instanceof Error ? error.message : 'Gagal mencari warga.',
          )
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false)
        }
      }
    }, 350)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [q, eventId, refreshKey])

  function markAsExamined(anggotaId: number) {
    setResults((current) =>
      current.map((item) =>
        item.id === anggotaId
          ? {
              ...item,
              sudahDiperiksa: true,
            }
          : item,
      ),
    )
  }

  return {
    q,
    setQ,

    results,

    isSearching,
    hasSearched,
    error,

    markAsExamined,
  }
}
