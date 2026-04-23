import React from 'react'

export const EmptyState = ({
  icon: Icon,
  message,
  sub,
}: {
  icon:    React.ElementType
  message: string
  sub:     string
}) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
    <Icon className="size-8" />
    <div className="text-center">
      <p className="text-sm font-medium">{message}</p>
      <p className="text-xs mt-0.5">{sub}</p>
    </div>
  </div>
)
