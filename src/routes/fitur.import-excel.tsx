import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Loader2,
  Upload,
} from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { parseKKExcel } from '@/lib/kk-parser/parse-excel'
import type { ExcelKKImportResult } from '@/lib/kk-parser/parse-excel'

import { kkSchema } from '@/lib/kk-parser/schema'

import { saveKK } from '@/server/kk.functions'

export const Route = createFileRoute('/fitur/import-excel')({
  component: ImportExcelPage,
})

function ImportExcelPage() {
  const router = useRouter()

  const [fileName, setFileName] = useState<string | null>(null)

  const [result, setResult] = useState<ExcelKKImportResult | null>(null)

  const [isReading, setIsReading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const [showSensitive, setShowSensitive] = useState(false)

  const totalAnggota =
    result?.data.reduce((total, kk) => total + kk.anggota.length, 0) ?? 0

  async function handleFile(file: File) {
    setFileName(file.name)
    setResult(null)
    setShowSensitive(false)
    setIsReading(true)

    try {
      const parsed = await parseKKExcel(file)

      setResult(parsed)

      if (parsed.errors.length > 0) {
        toast.error('Excel perlu diperiksa', {
          description: `${parsed.errors.length} masalah ditemukan.`,
        })

        return
      }

      toast.success('Excel berhasil dibaca', {
        description: `${parsed.data.length} KK siap diimpor.`,
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'File Excel tidak dapat dibaca.'

      toast.error('Gagal membaca Excel', {
        description: message,
      })
    } finally {
      setIsReading(false)
    }
  }

  async function handleImport() {
    const importResult = result

    if (
      !importResult ||
      importResult.errors.length > 0 ||
      importResult.data.length === 0 ||
      isImporting
    ) {
      return
    }

    setIsImporting(true)

    let success = 0
    const importErrors: string[] = []

    try {
      for (const kk of importResult.data) {
        const validation = kkSchema.safeParse(kk)

        if (!validation.success) {
          importErrors.push(`${kk.kepalaKeluarga ?? 'KK'}: data tidak valid.`)

          continue
        }

        try {
          await saveKK({
            data: validation.data,
          })

          success += 1
        } catch (error) {
          importErrors.push(
            `${kk.kepalaKeluarga ?? 'KK'}: ${
              error instanceof Error ? error.message : 'gagal disimpan'
            }`,
          )
        }
      }

      if (importErrors.length > 0) {
        setResult({
          ...importResult,
          errors: importErrors,
        })

        toast.error('Import selesai dengan beberapa masalah', {
          description: `${success} KK berhasil, ${importErrors.length} gagal.`,
        })

        return
      }

      toast.success('Import Excel selesai', {
        description: `${success} Kartu Keluarga berhasil disimpan.`,
      })

      await router.invalidate()
    } finally {
      setIsImporting(false)
    }
  }

  function handleClear() {
    setFileName(null)
    setResult(null)
    setShowSensitive(false)
  }

  function hasRowError(rowNumber: number) {
    if (!result) {
      return false
    }

    return result.errors.some((error) =>
      error.startsWith(`Baris ${rowNumber}:`),
    )
  }

  return (
    <main className="min-h-screen bg-slate-50/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-400" />

          <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FileSpreadsheet className="size-5" />
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                  Import Data
                </div>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  Import Data Jemaat dari Excel
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Baca data Excel, periksa seluruh isi dan hasil validasi,
                  kemudian simpan data yang valid ke database.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" asChild>
                <Link to="/fitur/parser-kk">
                  <ArrowLeft className="size-4" />
                  Parser KK
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link to="/data-kk">
                  <Database className="size-4" />
                  Data KK
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center hover:bg-slate-100">
            {isReading ? (
              <Loader2 className="size-7 animate-spin text-emerald-600" />
            ) : (
              <Upload className="size-7 text-slate-400" />
            )}

            <div className="mt-3 text-sm font-semibold text-slate-800">
              {fileName ?? 'Pilih file Excel'}
            </div>

            <div className="mt-1 text-xs text-slate-500">Format file .xlsx</div>

            <input
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="sr-only"
              disabled={isReading || isImporting}
              onChange={(event) => {
                const file = event.target.files?.[0]

                if (file) {
                  void handleFile(file)
                }

                event.currentTarget.value = ''
              }}
            />
          </label>
        </section>

        {result && (
          <>
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Summary label="Baris Excel" value={result.totalRows} />

              <Summary label="KK Valid" value={result.data.length} />

              <Summary label="Anggota Valid" value={totalAnggota} />

              <Summary label="Masalah" value={result.errors.length} />
            </section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Preview Data Excel
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Seluruh baris ditampilkan sebelum masuk database.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSensitive((current) => !current)}
                >
                  {showSensitive
                    ? 'Sembunyikan NIK / No KK'
                    : 'Tampilkan NIK / No KK'}
                </Button>
              </div>

              <div className="max-h-[60vh] overflow-auto">
                <table className="min-w-max text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 text-slate-500">
                    <tr className="border-b border-slate-200">
                      <Head>Status</Head>
                      <Head>Baris</Head>
                      <Head>Keluarga</Head>
                      <Head>No</Head>
                      <Head>Nama</Head>
                      <Head>No KK</Head>
                      <Head>NIK</Head>

                      <Head>Alamat</Head>
                      <Head>RT/RW</Head>
                      <Head>Desa/Kelurahan</Head>
                      <Head>Kecamatan</Head>
                      <Head>Kabupaten/Kota</Head>
                      <Head>Provinsi</Head>
                      <Head>Kode Pos</Head>

                      <Head>L/P</Head>
                      <Head>Tempat Lahir</Head>
                      <Head>Tanggal Lahir</Head>
                      <Head>Agama</Head>
                      <Head>Gereja</Head>
                      <Head>Pendidikan</Head>
                      <Head>Pekerjaan</Head>
                      <Head>Golongan Darah</Head>

                      <Head>Ayah</Head>
                      <Head>Ibu</Head>
                      <Head>Baptis Anak</Head>
                      <Head>Sidi / Baptis Dewasa</Head>
                      <Head>Menikah</Head>
                      <Head>Domisili</Head>
                    </tr>
                  </thead>

                  <tbody>
                    {result.preview.map((row) => (
                      <tr
                        key={row.rowNumber}
                        className={[
                          'border-b border-slate-100',
                          hasRowError(row.rowNumber)
                            ? 'bg-red-50/60'
                            : 'bg-white',
                        ].join(' ')}
                      >
                        <Cell>
                          {hasRowError(row.rowNumber) ? (
                            <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-700">
                              Error
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                              OK
                            </span>
                          )}
                        </Cell>
                        <Cell>{row.rowNumber}</Cell>
                        <Cell>{row.keluarga || '-'}</Cell>
                        <Cell>{row.nomor || '-'}</Cell>

                        <Cell strong>{row.nama || '-'}</Cell>

                        <Cell mono>
                          {showSensitive
                            ? row.noKK || '-'
                            : maskIdentity(row.noKK)}
                        </Cell>

                        <Cell mono>
                          {showSensitive
                            ? row.nik || '-'
                            : maskIdentity(row.nik)}
                        </Cell>

                        <Cell>{row.alamat || '-'}</Cell>
                        <Cell>{row.rtRw || '-'}</Cell>
                        <Cell>{row.desaKelurahan || '-'}</Cell>
                        <Cell>{row.kecamatan || '-'}</Cell>
                        <Cell>{row.kabupatenKota || '-'}</Cell>
                        <Cell>{row.provinsi || '-'}</Cell>
                        <Cell>{row.kodePos || '-'}</Cell>

                        <Cell>{row.jenisKelamin || '-'}</Cell>
                        <Cell>{row.tempatLahir || '-'}</Cell>
                        <Cell>{row.tanggalLahir || '-'}</Cell>
                        <Cell>{row.agama || '-'}</Cell>
                        <Cell>{row.gereja || '-'}</Cell>
                        <Cell>{row.pendidikan || '-'}</Cell>
                        <Cell>{row.pekerjaan || '-'}</Cell>
                        <Cell>{row.golonganDarah || '-'}</Cell>

                        <Cell>{row.ayah || '-'}</Cell>
                        <Cell>{row.ibu || '-'}</Cell>
                        <Cell>{row.baptisAnak || '-'}</Cell>
                        <Cell>{row.sidiBaptisDewasa || '-'}</Cell>
                        <Cell>{row.menikah || '-'}</Cell>
                        <Cell>{row.domisili || '-'}</Cell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {result.errors.length > 0 && (
              <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="font-semibold text-red-700">
                  Perlu diperbaiki
                </div>

                <ul className="mt-3 space-y-1 text-sm text-red-600">
                  {result.errors.map((error, index) => (
                    <li key={`${index}-${error}`}>• {error}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-6 flex flex-col-reverse gap-2 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isImporting}
                onClick={handleClear}
              >
                Pilih File Lain
              </Button>

              <Button
                type="button"
                disabled={
                  result.data.length === 0 ||
                  result.errors.length > 0 ||
                  isImporting
                }
                onClick={() => void handleImport()}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Mengimpor...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    Import ke Database
                  </>
                )}
              </Button>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

function maskIdentity(value: string) {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return '-'
  }

  if (digits.length <= 4) {
    return '••••'
  }

  return `${'•'.repeat(Math.max(digits.length - 4, 4))}${digits.slice(-4)}`
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-medium text-slate-500">{label}</div>

      <div className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
        {value.toLocaleString('id-ID')}
      </div>
    </div>
  )
}

function Head({ children }: { children: ReactNode }) {
  return (
    <th className="whitespace-nowrap px-3 py-3 font-semibold">{children}</th>
  )
}

function Cell({
  children,
  mono = false,
  strong = false,
}: {
  children: ReactNode
  mono?: boolean
  strong?: boolean
}) {
  return (
    <td
      className={[
        'whitespace-nowrap px-3 py-2.5 text-slate-700',
        mono ? 'font-mono tabular-nums' : '',
        strong ? 'font-semibold text-slate-900' : '',
      ].join(' ')}
    >
      {children}
    </td>
  )
}
