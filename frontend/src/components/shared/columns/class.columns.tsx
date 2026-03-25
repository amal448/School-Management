// src/components/shared/columns/class.columns.tsx
import { ColumnDef }     from '@tanstack/react-table'
import { Button }        from '@/components/ui/button'
import { Badge }         from '@/components/ui/badge'
import { ArrowUpDown }   from 'lucide-react'
import { ClassResponse } from '@/types/class.types'
import { getGroupLabel }  from '@/constants/class.constants'
import { useNavigate }    from 'react-router-dom'
import { useAuthStore }   from '@/store/auth.store'
import { DeleteClassDialog } from '../class/DeleteClassDialog'



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
          Class {row.original.grade} — {row.original.section}
        </p>
        <p className="text-xs text-muted-foreground">
          {getGroupLabel(row.original.grade)} school
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'grade',
    header: 'class',
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.grade} 
      </Badge>
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
