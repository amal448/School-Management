import { useState }           from 'react'
import { Button }             from '@/components/ui/button'
import { Label }              from '@/components/ui/label'
import { Badge }              from '@/components/ui/badge'
import { UserCheck }          from 'lucide-react'
import { CrudDialog }         from '@/components/shared/CrudDialog'
import { useUpdateClass }     from '@/hooks/class/useClasses'
import { useTeachersByLevel } from '@/hooks/teacher/useTeachers'
import { ClassResponse }      from '@/types/class.types'
import { Avatar }             from '@/components/shared/Avatar'

// Grade → level mapping
const getLevel = (grade: string): string => {
  const g = Number(grade)
  if (g <= 5)  return 'primary'
  if (g <= 8)  return 'middle'
  if (g <= 10) return 'secondary'
  return 'higher_secondary'
}

interface Props {
  cls: ClassResponse
}

export const AssignClassTeacherDialog = ({ cls }: Props) => {
  const [teacherId, setTeacherId] = useState(cls.classTeacherId ?? '')

  const level              = getLevel(cls.grade)
  const { data: teachers, isLoading } = useTeachersByLevel(level)
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

  const currentTeacher = teachers?.find((t) => t.id === cls.classTeacherId)

  return (
    <CrudDialog
      trigger={
        <Button className="gap-2">
          <UserCheck className="size-4" />
          {cls.classTeacherId ? 'Change class teacher' : 'Assign class teacher'}
        </Button>
      }
      title="Assign class teacher"
      description={`Showing ${level.replace('_', ' ')} level teachers for Grade ${cls.grade}-${cls.section}.`}
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={
        (mutation.error as any)?.response?.data?.message
          ?? 'Failed to assign'
      }
      submitLabel="Assign"
      isDirty={!!teacherId && teacherId !== cls.classTeacherId}
      onConfirm={handleConfirm}
      onOpenChange={handleOpenChange}
    >
      {/* Current teacher info */}
      {currentTeacher && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 border border-border">
          <Avatar name={currentTeacher.fullName} size="sm" />
          <div>
            <p className="text-xs text-muted-foreground">Current class teacher</p>
            <p className="text-sm font-medium">{currentTeacher.fullName}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label>Select teacher</Label>
          <span className="text-xs text-muted-foreground capitalize">
            {level.replace('_', ' ')} level
          </span>
        </div>

        {isLoading ? (
          <div className="h-10 bg-muted rounded-md animate-pulse" />
        ) : !teachers?.length ? (
          <div className="p-3 text-center text-xs text-muted-foreground border rounded-lg">
            No teachers found for {level.replace('_', ' ')} level.
            Add teachers with this level assigned.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden max-h-52 overflow-y-auto">
            {teachers.map((teacher) => (
              <button
                key={teacher.id}
                type="button"
                onClick={() => setTeacherId(teacher.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5
                  text-left transition-colors
                  border-b last:border-b-0 border-border
                  ${teacherId === teacher.id
                    ? 'bg-primary/5'
                    : 'hover:bg-muted/60'
                  }
                `}
              >
                <Avatar name={teacher.fullName} size="sm" />
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="text-sm font-medium truncate">
                    {teacher.fullName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {teacher.designation || 'Teacher'}
                  </span>
                </div>
                {teacherId === teacher.id && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    Selected
                  </Badge>
                )}
                {teacher.id === cls.classTeacherId && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    Current
                  </Badge>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </CrudDialog>
  )
}