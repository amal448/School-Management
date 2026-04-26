import { DataTable }       from '@/components/ui/data-table'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { AddSubjectDialog }    from '@/components/shared/subject/AddSubjectDialog'
import { subjectColumns }      from '@/components/shared/columns/subject.columns'
import { TableSkeleton }       from '@/components/shared/Skeletons'
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
        <TableSkeleton rows={5} columns={4} />
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