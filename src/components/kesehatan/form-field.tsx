import type { ReactNode } from 'react'

type Props = {
  label: string
  error?: string
  children: ReactNode
}

export function FormField({ label, error, children }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {children}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
