import { useEffect, useState } from 'react'

import { listPemeriksaanEvent } from '@/server/kesehatan'

export type PemeriksaanEventItem = Awaited<
  ReturnType<typeof listPemeriksaanEvent>
>[number]

type Props = {
  eventId: number
  refreshKey: number
}

export function usePemeriksaanEvent({ eventId, refreshKey }: Props) {
  const [data, setData] = useState<PemeriksaanEventItem[]>([])

  const [isLoading, setIsLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await listPemeriksaanEvent({
          data: {
            eventId,
          },
        })

        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Gagal memuat pemeriksaan.',
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [eventId, refreshKey])

  return {
    data,
    isLoading,
    error,
  }
}
