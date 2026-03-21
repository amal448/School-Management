// src/components/shared/CrudDialog.tsx
// Generic reusable dialog wrapper used by all three modules class subject department

import { ReactNode }    from 'react'
import { Button }       from '@/components/ui/button'
import {
  Dialog, DialogClose, DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

const Spinner = () => (
  <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
)

interface Props {
  trigger:      ReactNode
  title:        string
  description:  string
  children:     ReactNode
  isPending:    boolean
  isSuccess:    boolean
  isError:      boolean
  errorMessage: string
  submitLabel:  string
  isDirty?:     boolean
  onSubmit:     (e: React.FormEvent) => void
  onOpenChange: (open: boolean) => void
}

export function CrudDialog({
  trigger, title, description, children,
  isPending, isSuccess, isError, errorMessage,
  submitLabel, isDirty = true,
  onSubmit, onOpenChange,
}: Props) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4 py-2">

            {isSuccess && (
              <Alert className="py-3 border-green-200 bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="size-4 text-green-600" />
                <AlertDescription className="text-xs text-green-700 dark:text-green-400">
                  Saved successfully.
                </AlertDescription>
              </Alert>
            )}

            {isError && (
              <Alert variant="destructive" className="py-3">
                <AlertCircle className="size-4" />
                <AlertDescription className="text-xs">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            {children}
          </div>

          <DialogFooter className="mt-4">
            {isSuccess ? (
              <DialogClose asChild>
                <Button type="button">Done</Button>
              </DialogClose>
            ) : (
              <>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isPending || !isDirty}
                >
                  {isPending ? <><Spinner /> Saving...</> : submitLabel}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}