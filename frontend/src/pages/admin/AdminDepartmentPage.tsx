import { DataTable }     from '@/components/ui/data-table'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { AddManagerDialog }     from '@/components/admin/AddManagerDialog'
import { managerColumns }       from '@/components/admin/columns/manager.columns'
import { useManagers }          from '@/hooks/admin/useManagers'

export default function AdminDepartmentPage() {
  const { data, isLoading } = useManagers()

  return (
    <PageRoot>
      <PageHeader
        title="Managers"
        description={`${data?.total ?? 0} total managers`}
        actions={<AddManagerDialog />}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Loading managers...
        </div>
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