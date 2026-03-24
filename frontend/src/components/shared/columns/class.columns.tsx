// src/components/shared/columns/class.columns.tsx
import { useState }      from 'react'
import { ColumnDef }     from '@tanstack/react-table'
import { Button }        from '@/components/ui/button'
import { Badge }         from '@/components/ui/badge'
import { ArrowUpDown }   from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { ClassResponse } from '@/types/class.types'
import { useDeleteClass } from '@/hooks/class/useClasses'
import { getGroupLabel }  from '@/constants/class.constants'
import { useNavigate }    from 'react-router-dom'
import { useAuthStore }   from '@/store/auth.store'

// ── Delete confirmation modal ──────────────────────────
const DeleteClassDialog = ({ cls }: { cls: ClassResponse }) => {
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
                Class {cls.className}-{cls.section}
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

// ── Actions cell ───────────────────────────────────────
const ActionsCell = ({ cls }: { cls: ClassResponse }) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const detailPath = user?.role === 'ADMIN'
    ? `/admin/classes/${cls.id}`
    : `/manager/classes/${cls.id}`

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-7"
        onClick={() => navigate(detailPath)}
      >
        View
      </Button>
      <DeleteClassDialog cls={cls} />
    </div>
  )
}

// ── Columns ───────────────────────────────────────────
export const classColumns: ColumnDef<ClassResponse>[] = [
  {
    accessorKey: 'className',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Class <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">
          Class {row.original.className} — {row.original.section}
        </p>
        <p className="text-xs text-muted-foreground">
          {getGroupLabel(row.original.className)} school
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'subjectAllocations',
    header: 'Subjects',
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.subjectAllocations.length} subjects
      </Badge>
    ),
  },
  {
    accessorKey: 'classTeacherId',
    header: 'Class Teacher',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.classTeacherId ? 'Assigned' : 'Not assigned'}
      </span>
    ),
  },
  {
    id:           'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell cls={row.original} />,
  },
]
