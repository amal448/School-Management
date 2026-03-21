import { DataTable }      from '@/components/ui/data-table'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { AddClassDialog }      from '@/components/shared/class/AddClassDialog'
import { classColumns }        from '@/components/shared/columns/class.columns'
import { useClasses }          from '@/hooks/class/useClasses'

export default function ClassListPage() {
  const { data, isLoading } = useClasses()

  return (
    <PageRoot>
      <PageHeader
        title="Classes"
        description={`${data?.total ?? 0} total classes`}
        actions={<AddClassDialog />}
      />
      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Loading classes...
        </div>
      ) : (
        <DataTable
          columns={classColumns}
          data={data?.data ?? []}
          searchKey="className"
          searchPlaceholder="Search classes..."
        />
      )}
    </PageRoot>
  )
}