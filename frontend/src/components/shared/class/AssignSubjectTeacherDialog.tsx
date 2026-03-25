import { useState }           from 'react'
import { Button }             from '@/components/ui/button'
import { Label }              from '@/components/ui/label'
import { CrudDialog }         from '@/components/shared/CrudDialog'
import { useAllocateSubject } from '@/hooks/class/useClasses'
import { useTeachers }        from '@/hooks/teacher/useTeachers'
import { AssignSubjectProps } from '@/types/class.types'

export const AssignSubjectTeacherDialog = ({ classId,subjectId,subjectName,}: AssignSubjectProps) => {
  
  const [teacherId, setTeacherId] = useState('')
  const { data: teachers } = useTeachers()
  const mutation           = useAllocateSubject(classId)

  const handleConfirm = () => {
    if (!teacherId) return
    mutation.mutate({ subjectId, teacherId })
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTeacherId('')
      mutation.reset()
    }
  }

  return (
    <CrudDialog
      trigger={
        <Button variant="outline" size="sm" className="text-xs h-7">
          Change teacher
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
      isDirty={!!teacherId}        // disabled until teacher selected
      onConfirm={handleConfirm}    // confirm mode — no form
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