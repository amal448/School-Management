// src/pages/admin/AdminManagerListPage.tsx
import { DataTable } from '@/components/ui/data-table'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { AddManagerDialog } from '@/components/admin/AddManagerDialog'
import {
  useManagers,
} from '@/hooks/admin/useManagers'
import { subjectColumns } from '@/components/shared/columns/subject.columns'

// ── Page ──────────────────────────────────────────────
export default function AdminSubjectPage() {
  const { data, isLoading } = useManagers()

  return (
    <PageRoot>
      <PageHeader
        title="Subjects"
        description={`${data?.total ?? 0} total subjects`}
        actions={<AddManagerDialog />}
      />

      <DataTable
        columns={subjectColumns}
        data={data?.data ?? []}
        searchKey="fullName"
        searchPlaceholder="Search managers..."
      />
    </PageRoot>
  )
}