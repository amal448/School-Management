import { DataTable }     from '@/components/ui/data-table'
import {  TeacherTableProps } from '@/types/teacher.types'
import { teacherColumns } from '../columns/teacher.columns'
import { TableSkeleton }  from '@/components/shared/Skeletons'



export function TeacherTable({ data, isLoading }: TeacherTableProps) {
  if (isLoading) return <TableSkeleton rows={5} columns={4} />

  return (
    <DataTable
      columns={teacherColumns}
      data={data}
      searchKey="fullName"
      searchPlaceholder="Search teachers..."
    />
  )
}