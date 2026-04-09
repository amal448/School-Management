import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ManagerResponse } from '@/types/manager.types'
import { Link } from 'react-router-dom'

// ── Status badge ──────────────────────────────────────
const StatusBadge = ({ manager }: { manager: ManagerResponse }) => {
  if (manager.isBlocked) return <Badge variant="destructive">Blocked</Badge>
  if (!manager.isActive) return <Badge variant="secondary">Inactive</Badge>
  if (manager.isFirstTime) return <Badge variant="outline">Unverified</Badge>
  return <Badge variant="default">Active</Badge>
}

// ── Actions cell ──────────────────────────────────────
const ActionsCell = ({ manager }: { manager: ManagerResponse }) => (
  <Link
    to={`/admin/manager/${manager.id}`}
    className="inline-flex items-center gap-1.5  text-xs font-medium text-primary transition-colors  hover:text-red-500"
  >
    <Eye className="h-3.5 w-3.5" />
    View Profile
  </Link>
)

// ── Columns ───────────────────────────────────────────
export const managerColumns: ColumnDef<ManagerResponse>[] = [
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
      <div className="flex flex-col justify-center">
        <p className="font-medium leading-snug">{row.original.fullName}</p>
        <p className="text-xs text-muted-foreground leading-snug">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => (
      <span className="flex items-center text-sm text-muted-foreground">
        {row.original.phone ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <span className="flex items-center">
        <StatusBadge manager={row.original} />
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => (
      <span className="flex items-center">
        <ActionsCell manager={row.original} />
      </span>
    ),
  },
]