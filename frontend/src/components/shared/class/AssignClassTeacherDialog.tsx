import { useState }       from 'react'
import { Button }         from '@/components/ui/button'
import { Label }          from '@/components/ui/label'
import { UserCheck }      from 'lucide-react'
import { CrudDialog }     from '@/components/shared/CrudDialog'
import { useUpdateClass } from '@/hooks/class/useClasses'
import { useTeachers }    from '@/hooks/teacher/useTeachers'
import { ClassResponse }  from '@/types/class.types'

interface Props {
  cls: ClassResponse
}

export const AssignClassTeacherDialog = ({ cls }: Props) => {
  const [teacherId, setTeacherId] = useState(cls.classTeacherId ?? '')

  const { data: teachers } = useTeachers()
  const mutation           = useUpdateClass(cls.id)

  const handleConfirm = () => {
    if (!teacherId) return
    mutation.mutate({ classTeacherId: teacherId } as any)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTeacherId(cls.classTeacherId ?? '')
      mutation.reset()
    }
  }

  return (
    <CrudDialog
      trigger={
        <Button className="gap-2">
          <UserCheck className="size-4" />
          {cls.classTeacherId ? 'Change class teacher' : 'Assign class teacher'}
        </Button>
      }
      title="Assign class teacher"
      description={`The class teacher oversees Class ${cls.grade}-${cls.section}.`}
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