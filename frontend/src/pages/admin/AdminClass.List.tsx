import { DataTable }     from '@/components/ui/data-table'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { AddManagerDialog }     from '@/components/admin/AddManagerDialog'
import { useManagers }          from '@/hooks/admin/useManagers'
import { classColumns } from '@/components/shared/columns/class.columns'

export default function AdminClassListPage() {
  const { data, isLoading } = useManagers()

  return (
    <PageRoot>
      <PageHeader
        title="Class List"
        description={`${data?.total ?? 0} total managers`}
        actions={<AddManagerDialog />}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Loading class list...
        </div>
      ) : (
        <DataTable
          columns={classColumns}
          data={data?.data ?? []}
          searchKey="fullName"
          searchPlaceholder="Search managers..."
        />
      )}
    </PageRoot>
  )
}