import { ColumnDef }          from '@tanstack/react-table'
import { Button }             from '@/components/ui/button'
import { Badge }              from '@/components/ui/badge'
import { ArrowUpDown }        from 'lucide-react'
import { useNavigate }        from 'react-router-dom'
import { useAuthStore }       from '@/store/auth.store'
import { useClass }           from '@/hooks/class/useClasses'
import { Avatar }             from '@/components/shared/Avatar'
import { ResetStudentPasswordDialog } from '@/components/shared/student/ResetStudentPasswordDialog'
import { StudentResponse }    from '@/types/student.types'

const ActionsCell = ({ student }: { student: StudentResponse }) => {
  const navigate   = useNavigate()
  const { user }   = useAuthStore()

  // Check if current teacher is class teacher for this student
  const { data: cls } = useClass(student.classId ?? '')
  const isClassTeacher = user?.role === 'TEACHER'
    ? cls?.classTeacherId === user.userId
    : true   // admin/manager always have full access

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
        View
      </Button>

      {/* Password reset — only for class teacher or admin/manager */}
      {isClassTeacher && (
        <ResetStudentPasswordDialog
          studentId={student.id}
          studentName={student.fullName}
        />
      )}
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