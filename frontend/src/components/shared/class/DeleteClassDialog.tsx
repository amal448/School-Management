// src/components/shared/columns/class.columns.tsx
import { useState }      from 'react'
import { Button }        from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { ClassResponse } from '@/types/class.types'
import { useDeleteClass } from '@/hooks/class/useClasses'


export const DeleteClassDialog = ({ cls }: { cls: ClassResponse }) => {
  const [open, setOpen]  = useState(false)
  const deleteMutation   = useDeleteClass()

  const handleDelete = () => {
    deleteMutation.mutate(cls.id, {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-7 text-destructive border-destructive/30 hover:bg-destructive/5"
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete class</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-medium text-foreground">
                Class {cls.grade}-{cls.section}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteMutation.isError && (
            <p className="text-xs text-destructive">
              {(deleteMutation.error as any)?.response?.data?.message
                ?? 'Failed to delete class'}
            </p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                'Delete class'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}