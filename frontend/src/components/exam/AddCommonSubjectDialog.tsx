import { useForm }             from 'react-hook-form'
import { Button }              from '@/components/ui/button'
import { Input }               from '@/components/ui/input'
import { Label }               from '@/components/ui/label'
import { Plus }                from 'lucide-react'
import { CrudDialog }          from '@/components/shared/CrudDialog'
import { useAddCommonSubject } from '@/hooks/exam/useExams'
import { useSubjects }         from '@/hooks/subject/useSubjects'
import { AddCommonSubjectInput } from '@/types/exam.types'
import { GradeConfig }         from '@/types/exam.types'

interface Props {
  examId:      string
  gradeConfig: GradeConfig
}

export const AddCommonSubjectDialog = ({ examId, gradeConfig }: Props) => {
  const { register, handleSubmit, reset, formState: { isDirty, errors } } =
    useForm<Omit<AddCommonSubjectInput, 'grade'>>({
      defaultValues: { totalMarks: 100, passingMarks: 35 },
    })

  const mutation           = useAddCommonSubject(examId)
  const { data: subjects } = useSubjects({ limit: 100 })

  // Subjects already added for this grade
  const usedSubjectIds = new Set(
    gradeConfig.commonSubjects.map((s) => s.subjectId)
  )

  const availableSubjects = (subjects?.data ?? []).filter(
    (s) => !usedSubjectIds.has(s.id)
  )

  return (
    <CrudDialog
      trigger={
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="size-4" />
          Add subject
        </Button>
      }
      title={`Add subject — Grade ${gradeConfig.grade}`}
      description="Schedule a common subject for all sections of this grade."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={
        (mutation.error as any)?.response?.data?.message
          ?? 'Failed to add subject'
      }
      submitLabel="Add Subject"
      isDirty={isDirty}
      onSubmit={handleSubmit((data) =>
        mutation.mutate({ ...data, grade: gradeConfig.grade })
      )}
      onOpenChange={(open) => { if (!open) { reset(); mutation.reset() } }}
    >
      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <Label>Subject</Label>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          {...register('subjectId', { required: 'Required' })}
        >
          <option value="">Select subject</option>
          {availableSubjects.map((s) => (
            <option key={s.id} value={s.id}>{s.subjectName}</option>
          ))}
        </select>
        {errors.subjectId && (
          <p className="text-xs text-destructive">{errors.subjectId.message}</p>
        )}
        {!availableSubjects.length && (
          <p className="text-xs text-muted-foreground">
            All subjects already added for this grade.
          </p>
        )}
      </div>

      {/* Exam date */}
      <div className="flex flex-col gap-1.5">
        <Label>Exam date</Label>
        <Input
          type="date"
          {...register('examDate', { required: 'Required' })}
        />
      </div>

      {/* Time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Start time</Label>
          <Input
            type="time"
            {...register('startTime', { required: 'Required' })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>End time</Label>
          <Input
            type="time"
            {...register('endTime', { required: 'Required' })}
          />
        </div>
      </div>

      {/* Marks */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Total marks</Label>
          <Input
            type="number"
            {...register('totalMarks', { required: true, valueAsNumber: true, min: 1 })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Passing marks</Label>
          <Input
            type="number"
            {...register('passingMarks', { required: true, valueAsNumber: true, min: 1 })}
          />
        </div>
      </div>
    </CrudDialog>
  )
}