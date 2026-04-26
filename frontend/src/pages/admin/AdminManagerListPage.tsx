import { DataTable }     from '@/components/ui/data-table'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { AddManagerDialog }     from '@/components/admin/AddManagerDialog'
import { managerColumns }       from '@/components/admin/columns/manager.columns'
import { TableSkeleton }        from '@/components/shared/Skeletons'
import { useManagers }          from '@/hooks/admin/useManagers'

export default function AdminManagerListPage() {
  const { data, isLoading } = useManagers()

  return (
    <PageRoot>
      <PageHeader
        title="Managers"
        description={`${data?.total ?? 0} total managers`}
        actions={<AddManagerDialog />}
      />

      {isLoading ? (
        <TableSkeleton rows={5} columns={4} />
      ) : (
        <DataTable
          columns={managerColumns}
          data={data?.data ?? []}
          searchKey="fullName"
          searchPlaceholder="Search managers..."
        />
      )}
    </PageRoot>
  )
}