import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  Search,
  SearchX,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react'
import { useRef, useState } from 'react'

import { SelectedWargaKesehatan } from '@/components/kesehatan/selected-warga-kesehatan'
import { useWargaKesehatanSearch } from '@/components/kesehatan/use-warga-kesehatan-search'

import type { WargaKesehatan } from '@/components/kesehatan/use-warga-kesehatan-search'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type PetugasEventItem = {
  id: number
  nama: string
}

type Props = {
  eventId: number
  petugas: PetugasEventItem[]
  refreshKey: number
  onChanged: () => void | Promise<void>
}

const MAX_VISIBLE_RESULTS = 10

export function WargaKesehatanSection({
  eventId,
  petugas,
  refreshKey,
  onChanged,
}: Props) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { q, setQ, results, isSearching, hasSearched, error, markAsExamined } =
    useWargaKesehatanSearch({
      eventId,
      refreshKey,
    })

  const [selected, setSelected] = useState<WargaKesehatan | null>(null)

  const [savedWargaName, setSavedWargaName] = useState<string | null>(null)

  async function handleSaved() {
    if (!selected) {
      return
    }

    const anggotaId = selected.id
    const wargaName = selected.nama

    /*
     * Tandai hasil pencarian lokal terlebih dahulu
     * supaya warga langsung terlihat sudah diperiksa.
     */
    markAsExamined(anggotaId)

    /*
     * Siapkan workflow untuk warga berikutnya.
     */
    setSelected(null)
    setQ('')
    setSavedWargaName(wargaName)

    await onChanged()

    /*
     * Setelah kembali ke pencarian, langsung fokus
     * sehingga petugas dapat mengetik warga berikutnya.
     */
    requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }

  function handleSelect(warga: WargaKesehatan) {
    if (warga.sudahDiperiksa) {
      return
    }

    setSavedWargaName(null)
    setSelected(warga)
  }

  function handleChangeWarga() {
    setSelected(null)

    requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }

  function handleSearchChange(value: string) {
    setSavedWargaName(null)
    setQ(value)
  }

  function handleClearSearch() {
    setQ('')

    requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }

  const query = q.trim()

  const showEmpty =
    query.length > 0 &&
    hasSearched &&
    !isSearching &&
    results.length === 0 &&
    !error

  const visibleResults = results.slice(0, MAX_VISIBLE_RESULTS)

  const availableCount = results.filter((warga) => !warga.sudahDiperiksa).length

  return (
    <section className="space-y-4">
      {/* SUCCESS */}
      {savedWargaName ? (
        <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-green-800 shadow-sm sm:px-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <CheckCircle2 className="size-5" />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-semibold">
              Pemeriksaan berhasil disimpan
            </div>

            <p className="mt-1 text-sm leading-6 text-green-700">
              Data pemeriksaan{' '}
              <span className="font-semibold">{savedWargaName}</span> telah
              tersimpan. Silakan cari warga berikutnya.
            </p>
          </div>
        </div>
      ) : null}

      {/* SEARCH */}
      <Card
        className={[
          'overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm',
          selected ? 'hidden lg:block' : '',
        ].join(' ')}
      >
        <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Search className="size-4" />
            </div>

            <div className="min-w-0">
              <CardTitle className="text-base font-semibold text-slate-900">
                Cari Warga
              </CardTitle>

              <p className="mt-0.5 text-xs text-slate-500">
                Cari warga yang akan menjalani pemeriksaan.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <Input
              ref={searchInputRef}
              value={q}
              autoComplete="off"
              placeholder="Ketik nama atau NIK lengkap..."
              className="h-11 rounded-lg border-slate-200 bg-white pl-9 pr-11 shadow-none"
              onChange={(event) => handleSearchChange(event.target.value)}
              autoFocus
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isSearching ? (
                <LoaderCircle className="size-4 animate-spin text-slate-400" />
              ) : q ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="flex size-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Hapus pencarian"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-1 text-xs leading-5 text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Nama dapat diketik sebagian. Untuk NIK, masukkan nomor lengkap.
            </p>

            {query && results.length > 0 ? (
              <p className="shrink-0">
                {availableCount.toLocaleString('id-ID')} belum diperiksa
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* ERROR */}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* MOBILE: KEMBALI */}
      {selected ? (
        <div className="lg:hidden">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-lg border-slate-200 bg-white"
            onClick={handleChangeWarga}
          >
            <ArrowLeft className="size-4" />
            Ganti warga
          </Button>
        </div>
      ) : null}

      {/* WORKSPACE */}
      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
        {/* HASIL PENCARIAN */}
        <div className={selected ? 'hidden lg:block' : 'block'}>
          {visibleResults.length > 0 ? (
            <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
              <CardHeader className="border-b border-slate-200 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-sm font-semibold text-slate-900">
                      Hasil Pencarian
                    </CardTitle>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Pilih warga yang akan diperiksa.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                    {results.length.toLocaleString('id-ID')} hasil
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {visibleResults.map((warga) => {
                    const isSelected = selected?.id === warga.id

                    const isDisabled = warga.sudahDiperiksa

                    return (
                      <button
                        key={warga.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleSelect(warga)}
                        className={[
                          'flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors',
                          isDisabled
                            ? 'cursor-not-allowed bg-slate-50/80 opacity-65'
                            : isSelected
                              ? 'bg-blue-50/70'
                              : 'hover:bg-slate-50',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg',
                            isDisabled
                              ? 'bg-green-50 text-green-600'
                              : isSelected
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-slate-100 text-slate-500',
                          ].join(' ')}
                        >
                          {isDisabled ? (
                            <CheckCircle2 className="size-4" />
                          ) : (
                            <UserRound className="size-4" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-slate-900">
                              {warga.nama}
                            </span>

                            {isDisabled ? (
                              <span className="shrink-0 rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                Selesai
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-1 truncate text-xs text-slate-500">
                            NIK {warga.nik}
                          </div>

                          {warga.alamat || warga.desaKelurahan ? (
                            <div className="mt-1.5 flex min-w-0 items-center gap-1 text-xs text-slate-400">
                              <MapPin className="size-3 shrink-0" />

                              <span className="truncate">
                                {[warga.alamat, warga.desaKelurahan]
                                  .filter(Boolean)
                                  .join(', ')}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {results.length > MAX_VISIBLE_RESULTS ? (
                  <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-center text-xs leading-5 text-slate-500">
                    Menampilkan {MAX_VISIBLE_RESULTS} dari{' '}
                    {results.length.toLocaleString('id-ID')} hasil. Persempit
                    pencarian untuk menemukan warga lainnya.
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : showEmpty ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center">
              <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <SearchX className="size-4" />
              </div>

              <div className="mt-3 text-sm font-semibold text-slate-700">
                Warga tidak ditemukan
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Periksa kembali nama atau NIK yang dimasukkan.
              </p>
            </div>
          ) : (
            <div className="hidden rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center lg:block">
              <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <UsersRound className="size-4" />
              </div>

              <div className="mt-3 text-sm font-semibold text-slate-700">
                Cari warga
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Ketik nama atau NIK pada pencarian di atas.
              </p>
            </div>
          )}
        </div>

        {/* FORM PEMERIKSAAN */}
        <div className={selected ? 'block' : 'hidden lg:block'}>
          {selected ? (
            <SelectedWargaKesehatan
              eventId={eventId}
              warga={selected}
              petugas={petugas}
              refreshKey={refreshKey}
              onSaved={handleSaved}
            />
          ) : (
            <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  <UserRound className="size-5" />
                </div>

                <div className="mt-4 font-semibold text-slate-800">
                  Pilih warga
                </div>

                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
                  Pilih salah satu warga dari hasil pencarian untuk membuka form
                  pemeriksaan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
