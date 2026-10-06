import { useState } from 'react'

import { getKKPrivateLocal } from '@/server/kk.local.functions'

type PrivateKK = Awaited<ReturnType<typeof getKKPrivateLocal>>

export function useSensitiveKK(id: number) {
  const [data, setData] = useState<PrivateKK | null>(null)

  const [isVisible, setIsVisible] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  async function toggle() {
    if (isVisible) {
      hide()
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await getKKPrivateLocal({
        data: {
          id,
        },
      })

      setData(response)
      setIsVisible(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal membuka data sensitif.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  function hide() {
    setIsVisible(false)

    // Plaintext langsung dibuang dari React state.
    setData(null)
  }

  function getNik(memberNo: number, maskedNik: string) {
    if (!isVisible || !data) {
      return maskedNik
    }

    return (
      data.kk.anggota.find((member) => member.no === memberNo)?.nik ?? maskedNik
    )
  }

  function getNoKK(maskedNoKK: string) {
    if (!isVisible || !data) {
      return maskedNoKK
    }

    return data.kk.noKK
  }

  return {
    data,
    isVisible,
    isLoading,
    error,

    toggle,
    hide,
    getNik,
    getNoKK,
  }
}
