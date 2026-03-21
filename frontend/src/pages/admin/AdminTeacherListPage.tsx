import { PageRoot, PageHeader } from '@/components/ui/page'
import { TeacherTable }         from '@/components/shared/teacher/TeacherTable'
import { AddTeacherDialog }     from '@/components/shared/teacher/AddTeacherDialog'
import { useTeachers }          from '@/hooks/teacher/useTeachers'

export default function AdminTeacherListPage() {
  const { data, isLoading } = useTeachers()

  return (
    <PageRoot>
      <PageHeader
        title="Teachers"
        description={`${data?.total ?? 0} total teachers`}
        actions={<AddTeacherDialog />}
      />
      <TeacherTable
        data={data?.data ?? []}
        isLoading={isLoading}
      />
    </PageRoot>
  )
}