import { Search, RotateCcw, X } from 'lucide-react'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type EventStatus = 'all' | 'aktif' | 'selesai'

type Props = {
  searchValue: string

  status: EventStatus

  tahun?: number

  onSearchChange: (value: string) => void

  onStatusChange: (value: EventStatus) => void

  onYearChange: (value: number | undefined) => void

  onReset: () => void
}

export function EventListToolbar({
  searchValue,
  status,
  tahun,

  onSearchChange,
  onStatusChange,
  onYearChange,
  onReset,
}: Props) {
  const [query, setQuery] = useState(searchValue)

  const [yearInput, setYearInput] = useState(tahun ? String(tahun) : '')

  useEffect(() => {
    setQuery(searchValue)
  }, [searchValue])

  useEffect(() => {
    setYearInput(tahun ? String(tahun) : '')
  }, [tahun])

  useEffect(() => {
    if (query === searchValue) {
      return
    }

    const timeout = window.setTimeout(() => {
      onSearchChange(query.trim())
    }, 400)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [query, searchValue, onSearchChange])

  const hasFilter =
    query.trim().length > 0 || status !== 'all' || Boolean(tahun)

  function clearSearch() {
    setQuery('')
    onSearchChange('')
  }

  function commitYear() {
    const value = yearInput.trim()

    if (!value) {
      onYearChange(undefined)

      return
    }

    const year = Number(value)

    if (Number.isInteger(year) && year >= 2000 && year <= 2100) {
      onYearChange(year)

      return
    }

    setYearInput(tahun ? String(tahun) : '')
  }

  function handleReset() {
    setQuery('')
    setYearInput('')

    onReset()
  }

  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama event atau lokasi..."
          className="h-10 rounded-lg border-slate-200 bg-white pl-9 pr-10 shadow-none"
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Hapus pencarian"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <Select
        value={status}
        onValueChange={(value) => {
          if (value === 'all' || value === 'aktif' || value === 'selesai') {
            onStatusChange(value)
          }
        }}
      >
        <SelectTrigger className="w-full rounded-lg border-slate-200 bg-white shadow-none data-[size=default]:h-10 sm:w-36">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Semua status</SelectItem>

          <SelectItem value="aktif">Aktif</SelectItem>

          <SelectItem value="selesai">Selesai</SelectItem>
        </SelectContent>
      </Select>

      <Input
        value={yearInput}
        inputMode="numeric"
        maxLength={4}
        placeholder="Tahun"
        onChange={(event) => {
          const value = event.target.value.replace(/\D/g, '')

          setYearInput(value)
        }}
        onBlur={commitYear}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.currentTarget.blur()
          }
        }}
        className="h-10 w-full rounded-lg border-slate-200 bg-white shadow-none sm:w-28"
      />

      {hasFilter && (
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-lg border-slate-200 bg-white"
          onClick={handleReset}
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>
      )}
    </div>
  )
}
