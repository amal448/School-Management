import React from 'react'

export const InfoRow = ({
  icon: Icon, label, value,
}: {
  icon: React.ElementType
  label: string
  value?: string | null
}) => (
  <div className="flex items-center gap-3 py-3">
    <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0">
      <Icon className="size-4 text-muted-foreground" />
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate">{value ?? '—'}</p>
    </div>
  </div>
)
