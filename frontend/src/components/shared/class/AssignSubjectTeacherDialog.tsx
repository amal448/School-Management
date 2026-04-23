import { useState }                from 'react'
import { Button }                  from '@/components/ui/button'
import { Label }                   from '@/components/ui/label'
import { Badge }                   from '@/components/ui/badge'
import { CrudDialog }              from '@/components/shared/CrudDialog'
import { useAssignSubjectTeacher } from '@/hooks/class/useClasses'
import { useTeachersBySubject }    from '@/hooks/teacher/useTeachers'
import { Avatar }                  from '@/components/shared/Avatar'
import { AssignSubjectProps } from '@/types/class.types'

export const AssignSubjectTeacherDialog = ({
  classId,
  subjectId,
  subjectName,
  currentTeacherId,
}: AssignSubjectProps) => {
  const [teacherId, setTeacherId] = useState(currentTeacherId ?? '')

  // Only teachers who teach this subject and are in its department
  const { data: eligibleTeachers, isLoading } =
    useTeachersBySubject(subjectId)

  const mutation = useAssignSubjectTeacher(classId)

  const handleConfirm = () => {
    if (!teacherId) return
    mutation.mutate({ subjectId, teacherId })
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
      onOpenChange={(open) => {
        if (!open) {
          setTeacherId(currentTeacherId ?? '')
          mutation.reset()
        }
      }}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label>Select teacher</Label>
          <span className="text-xs text-muted-foreground">
            Showing teachers qualified for {subjectName}
          </span>
        </div>

        {isLoading ? (
          <div className="h-10 bg-muted rounded-md animate-pulse" />
        ) : !eligibleTeachers?.length ? (
          <div className="p-3 text-center text-xs text-muted-foreground border rounded-md">
            No teachers found for this subject.
            Add teachers with this subject assigned in their profile.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
            {eligibleTeachers.map((teacher) => (
              <button
                key={teacher.id}
                type="button"
                onClick={() => setTeacherId(teacher.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5
                  text-left transition-colors border-b last:border-b-0 border-border
                  ${teacherId === teacher.id
                    ? 'bg-primary/5'
                    : 'hover:bg-muted/60'
                  }
                `}
              >
                <Avatar name={teacher.fullName} size="sm" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium truncate">
                    {teacher.fullName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {teacher.designation || 'Teacher'}
                    {teacher.level && ` · ${teacher.level.replace('_', ' ')}`}
                  </span>
                </div>
                {teacherId === teacher.id && (
                  <div className="ml-auto shrink-0">
                    <Badge variant="secondary" className="text-xs">Selected</Badge>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </CrudDialog>
  )
}