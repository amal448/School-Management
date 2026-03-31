// src/components/shared/class/AssignSubjectTeacherDialog.tsx

import { useState }                  from 'react'
import { Button }                    from '@/components/ui/button'
import { Label }                     from '@/components/ui/label'
import { CrudDialog }                from '@/components/shared/CrudDialog'
import { useAssignSubjectTeacher }   from '@/hooks/class/useClasses'
import { useTeachers }               from '@/hooks/teacher/useTeachers'

interface Props {
  classId:          string
  subjectId:        string
  subjectName:      string
  currentTeacherId?: string   // pre-select current teacher
}

export const AssignSubjectTeacherDialog = ({
  classId,
  subjectId,
  subjectName,
  currentTeacherId,
}: Props) => {
  const [teacherId, setTeacherId] = useState(currentTeacherId ?? '')

  const { data: teachers } = useTeachers()
  const mutation           = useAssignSubjectTeacher(classId)

  const handleConfirm = () => {
    if (!teacherId) return
    mutation.mutate({ subjectId, teacherId })
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTeacherId(currentTeacherId ?? '')
      mutation.reset()
    }
  }

  return (
    <CrudDialog
      trigger={
        <Button variant="outline" size="sm" className="text-xs h-7">
          {currentTeacherId ? 'Change teacher' : 'Assign teacher'}
        </Button>
      }
      title="Assign teacher"
      description={`Assign a teacher for ${subjectName}.`}
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={
        (mutation.error as any)?.response?.data?.message
          ?? 'Failed to assign teacher'
      }
      submitLabel="Assign"
      isDirty={!!teacherId && teacherId !== currentTeacherId}
      onConfirm={handleConfirm}
      onOpenChange={handleOpenChange}
    >
      <div className="flex flex-col gap-1.5">
        <Label>Select teacher</Label>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        >
          <option value="">Choose a teacher</option>
          {teachers?.data.map((t) => (
            <option key={t.id} value={t.id}>{t.fullName}</option>
          ))}
        </select>
      </div>
    </CrudDialog>
  )
}