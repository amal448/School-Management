import { DataTable }       from '@/components/ui/data-table'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { AddSubjectDialog }    from '@/components/shared/subject/AddSubjectDialog'
import { subjectColumns }      from '@/components/shared/columns/subject.columns'
import { useSubjects }         from '@/hooks/subject/useSubjects'

export default function SubjectListPage() {
  const { data, isLoading } = useSubjects()

  return (
    <PageRoot>
      <PageHeader
        title="Subjects"
        description={`${data?.total ?? 0} total subjects`}
        actions={<AddSubjectDialog />}
      />
      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Loading subjects...
        </div>
      ) : (
        <DataTable
          columns={subjectColumns}
          data={data?.data ?? []}
          searchKey="subjectName"
          searchPlaceholder="Search subjects..."
        />
      )}
    </PageRoot>
  )
}