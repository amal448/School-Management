import { useState } from 'react'
import { Button } from '@/components/ui/button'

export const ConfirmDialog = ({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
  isPending,
  variant = 'default',
}: {
  trigger: React.ReactNode
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  isPending: boolean
  variant?: 'default' | 'destructive'
}) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background border border-border rounded-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4 shadow-lg">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant={variant}
                disabled={isPending}
                onClick={() => { onConfirm(); setOpen(false) }}
              >
                {isPending ? 'Processing...' : confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
