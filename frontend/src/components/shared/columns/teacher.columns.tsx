import { ColumnDef }     from '@tanstack/react-table'
import { Button }        from '@/components/ui/button'
import { Badge }         from '@/components/ui/badge'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TeacherResponse } from '@/types/teacher.types'
import { useDeactivateTeacher } from '@/hooks/teacher/useTeachers'
import { useNavigate } from 'react-router-dom'

// ── Status badge ──────────────────────────────────────
const StatusBadge = ({ teacher }: { teacher: TeacherResponse }) => {
  if (!teacher.isActive)    return <Badge variant="secondary">Inactive</Badge>
  if (teacher.isFirstTime)  return <Badge variant="outline">Pending Setup</Badge>
  if (!teacher.isVerified)  return <Badge variant="outline">Unverified</Badge>
  return <Badge variant="default">Active</Badge>
}

// ── Actions cell ──────────────────────────────────────
const ActionsCell = ({ teacher }: { teacher: TeacherResponse }) => {
  const deactivateMutation = useDeactivateTeacher()
  const navigate=useNavigate()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => navigate(`/admin/teacher/${teacher.id}`)}>
          View profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => deactivateMutation.mutate(teacher.id)}
          disabled={deactivateMutation.isPending}
        >
          Deactivate teacher
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Columns ───────────────────────────────────────────
export const teacherColumns: ColumnDef<TeacherResponse>[] = [
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.fullName}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'designation',
    header: 'Designation',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.designation ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.phone ?? '—'}
      </span>
    ),
  },
 
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => <StatusBadge teacher={row.original} />,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell teacher={row.original} />,
  },
]
