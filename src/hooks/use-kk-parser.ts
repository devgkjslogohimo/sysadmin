import { useMemo, useState } from 'react'

import type { KKData } from '@/lib/kk-parser/types'
import { createMaskedKK } from '@/lib/kk-parser/mask'
import { parseKK } from '@/lib/kk-parser/parse-kk'
import { kkSchema } from '@/lib/kk-parser/schema'

import { saveKK } from '@/server/kk.functions'
import { toast } from 'sonner'

type ValidationIssue = {
  path: readonly PropertyKey[]
  message: string
}

function formatValidationErrors(issues: readonly ValidationIssue[]): string[] {
  return issues.map((issue) => {
    const field =
      issue.path.length > 0 ? issue.path.map(String).join('.') : 'data'

    return `${field}: ${issue.message}`
  })
}

export function useKKParser() {
  const [text, setTextState] = useState('')

  const [result, setResult] = useState<KKData | null>(null)

  const [parseError, setParseError] = useState<string | null>(null)

  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const [isValid, setIsValid] = useState(false)

  const [showSensitive, setShowSensitive] = useState(false)

  const [isSaving, setIsSaving] = useState(false)

  const [isSaved, setIsSaved] = useState(false)

  const previewData = useMemo(() => {
    if (!result) {
      return null
    }

    return showSensitive ? result : createMaskedKK(result)
  }, [result, showSensitive])

  function resetResultState() {
    setResult(null)
    setParseError(null)
    setValidationErrors([])
    setIsValid(false)
    setShowSensitive(false)
    setIsSaved(false)
  }

  function setText(value: string) {
    setTextState(value)

    // Kalau raw text berubah setelah diparse,
    // hasil lama tidak lagi dianggap valid.
    if (result) {
      resetResultState()
    }
  }

  function handleParse() {
    setParseError(null)
    setResult(null)
    setValidationErrors([])
    setIsValid(false)
    setShowSensitive(false)
    setIsSaved(false)

    if (!text.trim()) {
      setParseError('Text Kartu Keluarga belum diisi.')
      return
    }

    try {
      const parsed = parseKK(text)

      setResult(parsed)

      const validation = kkSchema.safeParse(parsed)

      if (!validation.success) {
        setValidationErrors(formatValidationErrors(validation.error.issues))

        return
      }

      setIsValid(true)
    } catch {
      setParseError('Terjadi kesalahan saat melakukan parsing text.')
    }
  }

  function handleClear() {
    setTextState('')
    resetResultState()
    setIsSaving(false)
  }

  async function handleCopy() {
    if (!previewData) {
      return
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(previewData, null, 2))

      toast.success('JSON berhasil disalin')
    } catch {
      toast.error('Gagal menyalin JSON')
    }
  }

  async function handleSave() {
    if (!result || isSaving) {
      return
    }

    setIsSaving(true)

    try {
      const validation = kkSchema.safeParse(result)

      if (!validation.success) {
        const errors = formatValidationErrors(validation.error.issues)

        setValidationErrors(errors)
        setIsValid(false)

        toast.error('Data belum dapat disimpan', {
          description:
            'Data tidak lolos validasi. Periksa kembali hasil parsing.',
        })

        return
      }

      const response = await saveKK({
        data: validation.data,
      })

      setIsSaved(true)

      toast.success('Data berhasil disimpan', {
        description: `${response.memberCount} anggota keluarga berhasil disimpan ke database.`,
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Terjadi kesalahan pada server.'

      toast.error('Gagal menyimpan data', {
        description: message,
      })
    } finally {
      setIsSaving(false)
    }
  }

  function toggleSensitive() {
    if (!result) {
      return
    }

    setShowSensitive((current) => !current)
  }

  return {
    text,
    result,
    previewData,

    parseError,
    validationErrors,

    isValid,
    showSensitive,

    isSaving,
    isSaved,

    canClear: Boolean(text || result || parseError),

    canSave: Boolean(result) && isValid && !isSaving && !isSaved,

    setText,
    handleParse,
    handleClear,
    handleCopy,
    handleSave,
    toggleSensitive,
  }
}
