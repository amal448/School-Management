// src/pages/admin/AdminManagerListPage.tsx
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AddManagerDialog } from '@/components/admin/AddManagerDialog'
import {
  useManagers,
  useBlockManager,
  useUnblockManager,
  useDeleteManager,
} from '@/hooks/admin/useManagers'
import { ManagerResponse } from '@/types/manager.types'

// ── Status badge ──────────────────────────────────────
const StatusBadge = ({ manager }: { manager: ManagerResponse }) => {
  if (manager.isBlocked) {
    return <Badge variant="destructive">Blocked</Badge>
  }
  if (!manager.isActive) {
    return <Badge variant="secondary">Inactive</Badge>
  }
  if (manager.isFirstTime) {
    return <Badge variant="outline">Pending Setup</Badge>
  }
  return <Badge variant="default">Active</Badge>
}

// ── Actions cell ──────────────────────────────────────
const ActionsCell = ({ manager }: { manager: ManagerResponse }) => {
  const blockMutation = useBlockManager()
  const unblockMutation = useUnblockManager()
  const deleteMutation = useDeleteManager()
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

        <DropdownMenuItem>
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
        <DropdownMenuItem onClick={() => deleteMutation.mutate(manager.id)}>
          Remove manager
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Columns ───────────────────────────────────────────
const columns: ColumnDef<ManagerResponse>[] = [
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
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.phone ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.email ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.lastLogin
          ? new Date(row.original.lastLogin).toLocaleDateString()
          : 'Never'
        }
      </span>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => <StatusBadge manager={row.original} />,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell manager={row.original} />,
  },
]

// ── Page ──────────────────────────────────────────────
export default function AdminManagerListPage() {
  const { data, isLoading } = useManagers()

  return (
    <PageRoot>
      <PageHeader
        title="Managers"
        description={`${data?.total ?? 0} total managers`}
        actions={<AddManagerDialog />}
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        searchKey="fullName"
        searchPlaceholder="Search managers..."
      />
    </PageRoot>
  )
}