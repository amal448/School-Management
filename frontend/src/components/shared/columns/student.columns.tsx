import { ColumnDef }          from '@tanstack/react-table'
import { Button }             from '@/components/ui/button'
import { Badge }              from '@/components/ui/badge'
import { useNavigate }        from 'react-router-dom'
import { useAuthStore }       from '@/store/auth.store'
import { Avatar }             from '@/components/shared/Avatar'
import { ResetStudentPasswordDialog } from '@/components/shared/student/ResetStudentPasswordDialog'
import { StudentResponse }    from '@/types/student.types'
import { ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Student } from '@/constants/mockdata'

// ── Status badge ──────────────────────────────────────
const statusVariant = {
  active: 'default',
  inactive: 'secondary',
  suspended: 'destructive',
} as const



const ActionsCell = ({ student }: { student: StudentResponse }) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const profilePath =
    user?.role === 'ADMIN'   ? `/admin/students/${student.id}`   :
    user?.role === 'MANAGER' ? `/manager/students/${student.id}` :
                               `/teacher/students/${student.id}`

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-7"
        onClick={() => navigate(profilePath)}
      >
        View profile
      </Button>
      <ResetStudentPasswordDialog
        studentId={student.id}
        studentName={student.fullName}
      />
    </div>
  )
}

export const studentColumns: ColumnDef<StudentResponse>[] = [
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Student <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar name={row.original.fullName} size="sm" />
        <div>
          <p className="text-sm font-medium">{row.original.fullName}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'guardianName',
    header: 'Guardian',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.guardianName ?? '—'}
      </span>
    ),
  },
  // {
  //   accessorKey: 'phone',
  //   header: 'Phone',
  //   cell: ({ row }) => (
  //     <span className="text-sm text-muted-foreground">
  //       {row.original.phone ?? '—'}
  //     </span>
  //   ),
  // },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      if (!row.original.isActive)   return <Badge variant="secondary">Inactive</Badge>
      if (row.original.isFirstTime) return <Badge variant="outline">Pending setup</Badge>
      return <Badge variant="default">Active</Badge>
    },
  },
  {
    id:           'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell student={row.original} />,
  },
]


export const studentlistcolumns: ColumnDef<Student>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" size="sm" className="-ml-3 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.getValue('name')}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'class',
    header: 'Class',
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue('class')}</Badge>
    ),
  },
  {
    accessorKey: 'attendance',
    header: ({ column }) => (
      <Button variant="ghost" size="sm" className="-ml-3 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Attendance <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const val: number = row.getValue('attendance')
      return (
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${val}%` }}
            />
          </div>
          <span className="text-sm tabular-nums">{val}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Student['status']
      return (
        <Badge variant={statusVariant[status]} className="capitalize">
          {status}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View profile</DropdownMenuItem>
          <DropdownMenuItem>Edit student</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            Remove student
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]