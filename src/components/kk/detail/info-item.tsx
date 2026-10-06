type Props = {
  label: string
  value: string | null
  mono?: boolean
}

export function InfoItem({ label, value, mono = false }: Props) {
  return (
    <div className="min-h-23 border-b border-r border-slate-100 px-5 py-4 sm:px-6">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>

      <div
        className={
          mono
            ? 'font-mono text-sm font-semibold tabular-nums text-slate-900'
            : 'text-sm font-semibold leading-relaxed text-slate-900'
        }
      >
        {value ?? '-'}
      </div>
    </div>
  )
}
