import { Activity, Droplets, HeartPulse, Scale, TestTube2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { getTrenKesehatan } from '@/server/kesehatan'

type TrenData = Awaited<ReturnType<typeof getTrenKesehatan>>

type TrenItem = TrenData[number]

type Metric = 'tensi' | 'gulaDarah' | 'kolesterol' | 'asamUrat' | 'beratBadan'

type Props = {
  anggotaId: number
}

export function TrenKesehatan({ anggotaId }: Props) {
  const [data, setData] = useState<TrenData>([])

  const [isLoading, setIsLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const [metric, setMetric] = useState<Metric>('tensi')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getTrenKesehatan({
          data: {
            anggotaId,
          },
        })

        if (!cancelled) {
          setData(result)
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : 'Gagal memuat tren kesehatan.',
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
  }, [anggotaId])

  if (isLoading) {
    return (
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <TrenHeader />
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="animate-pulse">
            <div className="flex flex-wrap gap-2">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <div key={index} className="h-9 w-24 rounded-lg bg-slate-100" />
              ))}
            </div>

            <div className="mt-5 h-72 rounded-xl border border-slate-200 bg-slate-50" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="overflow-hidden rounded-2xl border-red-200 bg-white shadow-sm">
        <CardHeader className="border-b border-red-100 px-5 py-4 sm:px-6">
          <TrenHeader />
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <TrenHeader />
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-200">
              <Activity className="size-4" />
            </div>

            <div className="mt-3 text-sm font-semibold text-slate-700">
              Belum ada tren kesehatan
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Grafik perkembangan akan muncul setelah tersedia data pemeriksaan
              kesehatan.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const visibleData = data.length > 12 ? data.slice(-12) : data

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <TrenHeader />

          <span className="w-fit shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
            {data.length.toLocaleString('id-ID')} pemeriksaan
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6">
        <MetricSelector value={metric} onChange={setMetric} />

        <div className="mt-5">
          <ChartForMetric metric={metric} data={visibleData} />
        </div>

        {data.length > 12 && (
          <p className="mt-4 text-xs leading-5 text-slate-400">
            Grafik menampilkan 12 pemeriksaan terakhir agar perkembangan tetap
            mudah dibaca.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function TrenHeader() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Activity className="size-4" />
      </div>

      <div>
        <CardTitle className="text-base font-semibold text-slate-900">
          Tren Kesehatan
        </CardTitle>

        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          Perkembangan hasil pemeriksaan dari waktu ke waktu
        </p>
      </div>
    </div>
  )
}

function MetricSelector({
  value,
  onChange,
}: {
  value: Metric
  onChange: (value: Metric) => void
}) {
  const options: Array<{
    value: Metric
    label: string
  }> = [
    {
      value: 'tensi',
      label: 'Tensi',
    },
    {
      value: 'gulaDarah',
      label: 'Gula Darah',
    },
    {
      value: 'kolesterol',
      label: 'Kolesterol',
    },
    {
      value: 'asamUrat',
      label: 'Asam Urat',
    },
    {
      value: 'beratBadan',
      label: 'Berat Badan',
    },
  ]

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-1 rounded-xl bg-slate-100/80 p-1">
        {options.map((option) => {
          const active = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={[
                'h-9 rounded-lg px-3 text-sm font-medium transition',
                active
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:bg-white/60 hover:text-slate-800',
              ].join(' ')}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ChartForMetric({
  metric,
  data,
}: {
  metric: Metric
  data: TrenItem[]
}) {
  if (metric === 'tensi') {
    return (
      <div className="space-y-3">
        <ChartHeading
          icon={<HeartPulse className="size-4" />}
          title="Tekanan Darah"
        />

        <TrendChart
          data={data}
          unit="mmHg"
          series={[
            {
              label: 'Sistolik',
              values: data.map((item) => item.tensiSistolik),
              stroke: 'var(--primary)',
            },
            {
              label: 'Diastolik',
              values: data.map((item) => item.tensiDiastolik),
              stroke: 'var(--muted-foreground)',
            },
          ]}
        />
      </div>
    )
  }

  if (metric === 'gulaDarah') {
    return (
      <MetricChart
        icon={<Droplets className="size-4" />}
        title="Gula Darah"
        unit="mg/dL"
        data={data}
        values={data.map((item) => item.gulaDarah)}
      />
    )
  }

  if (metric === 'kolesterol') {
    return (
      <MetricChart
        icon={<TestTube2 className="size-4" />}
        title="Kolesterol"
        unit="mg/dL"
        data={data}
        values={data.map((item) => item.kolesterol)}
      />
    )
  }

  if (metric === 'asamUrat') {
    return (
      <MetricChart
        icon={<TestTube2 className="size-4" />}
        title="Asam Urat"
        unit="mg/dL"
        data={data}
        values={data.map((item) => item.asamUrat)}
      />
    )
  }

  return (
    <MetricChart
      icon={<Scale className="size-4" />}
      title="Berat Badan"
      unit="kg"
      data={data}
      values={data.map((item) => item.beratBadan)}
    />
  )
}

function MetricChart({
  icon,
  title,
  unit,
  data,
  values,
}: {
  icon: ReactNode
  title: string
  unit: string
  data: TrenItem[]
  values: Array<number | null>
}) {
  return (
    <div className="space-y-3">
      <ChartHeading icon={icon} title={title} />

      <TrendChart
        data={data}
        unit={unit}
        series={[
          {
            label: title,
            values,
            stroke: 'var(--primary)',
          },
        ]}
      />
    </div>
  )
}

function ChartHeading({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-400">{icon}</span>

      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
    </div>
  )
}

type Series = {
  label: string
  values: Array<number | null>
  stroke: string
}

function TrendChart({
  data,
  series,
  unit,
}: {
  data: TrenItem[]
  series: Series[]
  unit: string
}) {
  const allValues = series
    .flatMap((item) => item.values)
    .filter((value): value is number => value !== null)

  if (allValues.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center text-sm text-slate-500">
        Belum ada data untuk grafik ini.
      </div>
    )
  }

  const width = 760
  const height = 280

  const paddingLeft = 58
  const paddingRight = 24
  const paddingTop = 20
  const paddingBottom = 46

  const chartWidth = width - paddingLeft - paddingRight

  const chartHeight = height - paddingTop - paddingBottom

  const rawMin = Math.min(...allValues)

  const rawMax = Math.max(...allValues)

  const rawRange = rawMax - rawMin

  const padding =
    rawRange === 0 ? Math.max(Math.abs(rawMax) * 0.1, 1) : rawRange * 0.12

  const minValue = Math.max(0, rawMin - padding)

  const maxValue = rawMax + padding

  const range = maxValue - minValue || 1

  function getX(index: number) {
    if (data.length <= 1) {
      return paddingLeft + chartWidth / 2
    }

    return paddingLeft + (index / (data.length - 1)) * chartWidth
  }

  function getY(value: number) {
    return paddingTop + ((maxValue - value) / range) * chartHeight
  }

  const tickCount = 4

  const yTicks = Array.from(
    {
      length: tickCount,
    },
    (_, index) => {
      const ratio = index / (tickCount - 1)

      return maxValue - ratio * (maxValue - minValue)
    },
  )

  const xLabelStep = data.length <= 6 ? 1 : Math.ceil(data.length / 6)

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="min-w-[620px] w-full"
          role="img"
          aria-label={`Grafik ${series.map((item) => item.label).join(', ')}`}
        >
          {yTicks.map((value, index) => {
            const y = paddingTop + (index / (tickCount - 1)) * chartHeight

            return (
              <g key={`${value}-${index}`}>
                <line
                  x1={paddingLeft}
                  x2={width - paddingRight}
                  y1={y}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                />

                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--muted-foreground)"
                >
                  {formatAxisValue(value)}
                </text>
              </g>
            )
          })}

          {data.map((item, index) => {
            if (index % xLabelStep !== 0 && index !== data.length - 1) {
              return null
            }

            return (
              <text
                key={item.id}
                x={getX(index)}
                y={height - 16}
                textAnchor="middle"
                fontSize="10"
                fill="var(--muted-foreground)"
              >
                {formatShortDate(item.tanggal)}
              </text>
            )
          })}

          {series.map((item) => {
            const segments = buildSegments(item.values, getX, getY)

            return (
              <g key={item.label}>
                {segments.map((points, index) => (
                  <polyline
                    key={index}
                    points={points}
                    fill="none"
                    stroke={item.stroke}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                {item.values.map((value, index) => {
                  if (value === null) {
                    return null
                  }

                  return (
                    <circle
                      key={index}
                      cx={getX(index)}
                      cy={getY(value)}
                      r="4"
                      fill={item.stroke}
                      stroke="white"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    >
                      <title>
                        {`${item.label}: ${formatDisplayValue(
                          value,
                        )} ${unit} — ${formatTanggal(data[index].tanggal)} — ${
                          data[index].eventNama
                        }`}
                      </title>
                    </circle>
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        {series.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="h-0.5 w-5 rounded-full"
              style={{
                backgroundColor: item.stroke,
              }}
            />

            {item.label}
          </div>
        ))}

        <span className="ml-auto">Satuan: {unit}</span>
      </div>
    </div>
  )
}

function buildSegments(
  values: Array<number | null>,
  getX: (index: number) => number,
  getY: (value: number) => number,
) {
  const segments: string[] = []

  let current: string[] = []

  values.forEach((value, index) => {
    if (value === null) {
      if (current.length > 0) {
        segments.push(current.join(' '))

        current = []
      }

      return
    }

    current.push(`${getX(index)},${getY(value)}`)
  })

  if (current.length > 0) {
    segments.push(current.join(' '))
  }

  return segments
}

function formatAxisValue(value: number) {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 1,
  }).format(value)
}

function formatDisplayValue(value: number) {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 1,
  }).format(value)
}

function formatShortDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(year, month - 1, day))
}

function formatTanggal(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}
