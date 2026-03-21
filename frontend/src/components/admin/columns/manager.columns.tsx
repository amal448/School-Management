import { ColumnDef }      from '@tanstack/react-table'
import { Button }         from '@/components/ui/button'
import { Badge }          from '@/components/ui/badge'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ManagerResponse } from '@/types/manager.types'
import {
  useBlockManager,
  useUnblockManager,
  useDeleteManager,
} from '@/hooks/admin/useManagers'
import { useNavigate } from 'react-router-dom'

// ── Status badge ──────────────────────────────────────
const StatusBadge = ({ manager }: { manager: ManagerResponse }) => {
  if (manager.isBlocked)   return <Badge variant="destructive">Blocked</Badge>
  if (!manager.isActive)   return <Badge variant="secondary">Inactive</Badge>
  if (manager.isFirstTime) return <Badge variant="outline">UnVerified</Badge>
  return <Badge variant="default">Active</Badge>
}
// ── Actions cell ──────────────────────────────────────
const ActionsCell = ({ manager }: { manager: ManagerResponse }) => {
  const navigate = useNavigate()
  
  const blockMutation   = useBlockManager()
  const unblockMutation = useUnblockManager()
  const deleteMutation  = useDeleteManager()

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

        <DropdownMenuItem onClick={() => navigate(`/admin/manager/${manager.id}`)}>
          View profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {manager.isBlocked ? (
          <DropdownMenuItem
            onClick={() => unblockMutation.mutate(manager.id)}
            disabled={unblockMutation.isPending}
          >
            Unblock manager
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => blockMutation.mutate(manager.id)}
            disabled={blockMutation.isPending}
          >
            Block manager
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => deleteMutation.mutate(manager.id)}
          disabled={deleteMutation.isPending}
        >
          Remove manager
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
      <div>
        <p className="font-medium">{row.original.fullName}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
    {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.department ?? '—'}
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
    cell: ({ row }) => <StatusBadge manager={row.original} />,
  },
  {
    id:           'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell manager={row.original} />,
  },
]