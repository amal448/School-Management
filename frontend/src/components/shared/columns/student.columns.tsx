// src/components/shared/columns/student.columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/shared/Avatar'
import { StudentResponse } from '@/types/student.types'

export const studentColumns: ColumnDef<StudentResponse>[] = [
  {
    accessorKey: 'fullName',
    header: 'Name',
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
    accessorKey: 'classId',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.classId ? 'default' : 'secondary'}>
        {row.original.classId ? 'Enrolled' : 'Unassigned'}
      </Badge>
    ),
  },
  {
    accessorKey: 'guardianName',
    header: 'guardianName',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.guardianName ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'guardianContact',
    header: 'guardianContact',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.guardianContact ?? '—'}
      </span>
    ),
  },
 
]