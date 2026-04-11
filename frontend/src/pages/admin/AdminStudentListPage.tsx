import { DataTable } from '@/components/ui/data-table'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { studentlistcolumns } from '@/components/shared/columns/student.columns'



// ── Page ──────────────────────────────────────────────
export default function StudentListPage() {
  return (
    <PageRoot>
      <PageHeader
        title="Students"
        description="Manage and monitor all enrolled students."
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            Add Student
          </Button>
        }
      />
      <DataTable
        columns={studentlistcolumns}
        data={students}
        searchKey="name"
        searchPlaceholder="Search students..."
      />
    </PageRoot>
  )
}