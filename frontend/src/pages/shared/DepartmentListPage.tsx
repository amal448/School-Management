import { DataTable }        from '@/components/ui/data-table'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { AddDepartmentDialog } from '@/components/shared/department/AddDepartmentDialog'
import { departmentColumns }   from '@/components/shared/columns/department.columns'
import { useDepartments }      from '@/hooks/department/useDepartments'

export default function DepartmentListPage() {
  const { data, isLoading } = useDepartments()

  return (
    <PageRoot>
      <PageHeader
        title="Departments"
        description={`${data?.total ?? 0} total departments`}
        actions={<AddDepartmentDialog />}
      />
      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Loading departments...
        </div>
      ) : (
        <DataTable
          columns={departmentColumns}
          data={data?.data ?? []}
          searchKey="deptName"
          searchPlaceholder="Search departments..."
        />
      )}
    </PageRoot>
  )
}