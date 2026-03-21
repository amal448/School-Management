import { DataTable }     from '@/components/ui/data-table'
import { TeacherResponse } from '@/types/teacher.types'
import { teacherColumns } from '../columns/teacher.columns'

// ── Reusable table ─────────────────────────────────────
interface TeacherTableProps {
  data:      TeacherResponse[]
  isLoading: boolean
}

export function TeacherTable({ data, isLoading }: TeacherTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Loading teachers...
      </div>
    )
  }

  return (
    <DataTable
      columns={teacherColumns}
      data={data}
      searchKey="fullName"
      searchPlaceholder="Search teachers..."
    />
  )
}