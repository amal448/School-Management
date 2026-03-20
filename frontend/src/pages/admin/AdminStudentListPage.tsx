import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ── Type ──────────────────────────────────────────────
export type Student = {
  id:         string
  name:       string
  email:      string
  class:      string
  attendance: number
  status:     'active' | 'inactive' | 'suspended'
}

// ── Mock data (replace with API) ──────────────────────
const students: Student[] = [
  { id: '1',  name: 'Arjun Menon',     email: 'arjun@school.com',   class: '10-A', attendance: 92, status: 'active' },
  { id: '2',  name: 'Priya Nair',      email: 'priya@school.com',   class: '10-B', attendance: 78, status: 'active' },
  { id: '3',  name: 'Rahul Das',       email: 'rahul@school.com',   class: '9-A',  attendance: 65, status: 'suspended' },
  { id: '4',  name: 'Sneha Pillai',    email: 'sneha@school.com',   class: '11-A', attendance: 88, status: 'active' },
  { id: '5',  name: 'Aditya Kumar',    email: 'aditya@school.com',  class: '9-B',  attendance: 95, status: 'active' },
  { id: '6',  name: 'Meera Krishnan',  email: 'meera@school.com',   class: '10-A', attendance: 72, status: 'inactive' },
  { id: '7',  name: 'Vishnu Raj',      email: 'vishnu@school.com',  class: '11-B', attendance: 89, status: 'active' },
  { id: '8',  name: 'Lakshmi Varma',   email: 'lakshmi@school.com', class: '10-B', attendance: 91, status: 'active' },
  { id: '9',  name: 'Kiran Thomas',    email: 'kiran@school.com',   class: '9-A',  attendance: 60, status: 'suspended' },
  { id: '10', name: 'Divya Suresh',    email: 'divya@school.com',   class: '11-A', attendance: 97, status: 'active' },
  { id: '11', name: 'Ravi Chandran',   email: 'ravi@school.com',    class: '9-B',  attendance: 83, status: 'active' },
  { id: '12', name: 'Ananya George',   email: 'ananya@school.com',  class: '10-A', attendance: 76, status: 'inactive' },
]

// ── Status badge ──────────────────────────────────────
const statusVariant = {
  active:    'default',
  inactive:  'secondary',
  suspended: 'destructive',
} as const

// ── Columns ───────────────────────────────────────────
const columns: ColumnDef<Student>[] = [
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

// ── Page ──────────────────────────────────────────────
export default function StudentListPage() {
  return (
    <PageRoot>
      <PageHeader
        title="Students"
        description="Manage and monitor all enrolled students."
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            Add Student
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={students}
        searchKey="name"
        searchPlaceholder="Search students..."
      />
    </PageRoot>
  )
}