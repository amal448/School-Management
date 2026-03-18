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
export type Teacher = {
  id:     string
  name:   string
  email:  string
  status: 'active' | 'inactive' | 'suspended'  // ← union, not string
}

// ── Mock data ─────────────────────────────────────────
const teachers: Teacher[] = [
  { id: '1',  name: 'Arjun Menon',    email: 'arjun@school.com',   status: 'active'    },
  { id: '2',  name: 'Priya Nair',     email: 'priya@school.com',   status: 'active'    },
  { id: '3',  name: 'Rahul Das',      email: 'rahul@school.com',   status: 'suspended' },
  { id: '4',  name: 'Sneha Pillai',   email: 'sneha@school.com',   status: 'active'    },
  { id: '5',  name: 'Aditya Kumar',   email: 'aditya@school.com',  status: 'active'    },
  { id: '6',  name: 'Meera Krishnan', email: 'meera@school.com',   status: 'inactive'  },
  { id: '7',  name: 'Vishnu Raj',     email: 'vishnu@school.com',  status: 'active'    },
  { id: '8',  name: 'Lakshmi Varma',  email: 'lakshmi@school.com', status: 'active'    },
  { id: '9',  name: 'Kiran Thomas',   email: 'kiran@school.com',   status: 'suspended' },
  { id: '10', name: 'Divya Suresh',   email: 'divya@school.com',   status: 'active'    },
  { id: '11', name: 'Ravi Chandran',  email: 'ravi@school.com',    status: 'active'    },
  { id: '12', name: 'Ananya George',  email: 'ananya@school.com',  status: 'inactive'  },
]

// ── Status badge ──────────────────────────────────────
const statusVariant: Record<Teacher['status'], 'default' | 'secondary' | 'destructive'> = {
  active:    'default',
  inactive:  'secondary',
  suspended: 'destructive',
}

// ── Columns ───────────────────────────────────────────
const columns: ColumnDef<Teacher>[] = [
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Teacher['status']
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
    cell: ({ row: _ }) => (
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
          <DropdownMenuItem>Edit teacher</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            Remove teacher
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// ── Page ──────────────────────────────────────────────
export default function TeacherListPage() {
  return (
    <PageRoot>
      <PageHeader
        title="Teachers"
        description="Manage all teaching staff."
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            Add Teacher
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={teachers}
        searchKey="name"
        searchPlaceholder="Search teachers..."
      />
    </PageRoot>
  )
}