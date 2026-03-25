import { ColumnDef }       from '@tanstack/react-table'
import { Button }          from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SubjectResponse } from '@/types/subject.types'
import { useDeleteSubject } from '@/hooks/subject/useSubjects'
import { useDepartments }  from '@/hooks/department/useDepartments'
import { EditSubjectDialog } from '../subject/EditSubjectDialog'

// Inline edit dialog for subject

const ActionsCell = ({ subject }: { subject: SubjectResponse }) => {
  const deleteMutation = useDeleteSubject()
  const { data: depts } = useDepartments()

  const deptName = depts?.data.find((d) => d.id === subject.deptId)?.deptName

  return (
    <div className="flex items-center gap-2">
      <EditSubjectDialog subject={subject} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => deleteMutation.mutate(subject.id)}
            disabled={deleteMutation.isPending}
          >
            Delete subject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const subjectColumns: ColumnDef<SubjectResponse>[] = [
  {
    accessorKey: 'subjectName',
    header: ({ column }) => (
      <Button variant="ghost" size="sm" className="-ml-3 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Subject <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <p className="font-medium">{row.original.subjectName}</p>
    ),
  },
  {
    accessorKey: 'deptId',
    header: 'Department',
    cell: ({ row }) => {
      const { data: depts } = useDepartments()
      const name = depts?.data.find((d) => d.id === row.original.deptId)?.deptName
      return <span className="text-sm text-muted-foreground">{name ?? '—'}</span>
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell subject={row.original} />,
  },
]