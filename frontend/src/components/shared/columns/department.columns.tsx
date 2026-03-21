import { ColumnDef }         from '@tanstack/react-table'
import { Button }            from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DepartmentResponse } from '@/types/department.types'
import {
  useUpdateDepartment,
  useDeleteDepartment,
} from '@/hooks/department/useDepartments'
import { EditDepartmentDialog } from '@/components/shared/department/EditDepartmentDialog'

const ActionsCell = ({ department }: { department: DepartmentResponse }) => {
  const updateMutation = useUpdateDepartment(department.id)
  const deleteMutation = useDeleteDepartment()

  return (
    <div className="flex items-center gap-2">
      <EditDepartmentDialog
        department={department}
        mutation={updateMutation}
      />
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
            onClick={() => deleteMutation.mutate(department.id)}
            disabled={deleteMutation.isPending}
          >
            Delete department
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const departmentColumns: ColumnDef<DepartmentResponse>[] = [
  {
    accessorKey: 'deptName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Department <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <p className="font-medium">{row.original.deptName}</p>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.description ?? '—'}
      </span>
    ),
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
    cell: ({ row }) => <ActionsCell department={row.original} />,
  },
]