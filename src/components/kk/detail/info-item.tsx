type Props = {
  label: string
  value: string | null
  mono?: boolean
}

export function InfoItem({ label, value, mono = false }: Props) {
  return (
    <div className="min-w-0 px-5 py-4 sm:px-6">
      <div className="text-xs font-medium text-slate-400">{label}</div>

      <div
        className={[
          'mt-1 min-w-0 text-sm font-semibold leading-6 text-slate-900',
          mono ? 'font-mono tabular-nums' : '',
        ].join(' ')}
      >
        {value || '-'}
      </div>
    </div>
  )
}
