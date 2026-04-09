import { useForm }             from 'react-hook-form'
import { Button }              from '@/components/ui/button'
import { Input }               from '@/components/ui/input'
import { Label }               from '@/components/ui/label'
import { Plus }                from 'lucide-react'
import { CrudDialog }          from '@/components/shared/CrudDialog'
import { useAddCommonSubject } from '@/hooks/exam/useExams'
import { useSubjects }         from '@/hooks/subject/useSubjects'
import { AddCommonSubjectInput, ExamResponse } from '@/types/exam.types'
import { GradeConfig }         from '@/types/exam.types'
// Change Props interface
interface Props {
  exam:        ExamResponse   // ← was just examId + gradeConfig
  gradeConfig: GradeConfig
}

export const AddCommonSubjectDialog = ({ exam, gradeConfig }: Props) => {
  const { register, handleSubmit, reset, watch,
    formState: { isDirty, errors } } =
    useForm<AddCommonSubjectInput>({
      defaultValues: { totalMarks: 100, passingMarks: 35 },
    })

  const mutation           = useAddCommonSubject(exam.id)
  const { data: subjects } = useSubjects({ limit: 100 })

  const usedSubjectIds = new Set(
    gradeConfig.commonSubjects.map((s) => s.subjectId)
  )
  const availableSubjects = (subjects?.data ?? []).filter(
    (s) => !usedSubjectIds.has(s.id)
  )

  // Date bounds from exam period
  const minDate = exam.startDate.split('T')[0]
  const maxDate = exam.endDate.split('T')[0]

  const validateDate = (val: string): string | true => {
    if (!val) return 'Required'
    const d = new Date(val); d.setHours(0, 0, 0, 0)
    const s = new Date(exam.startDate); s.setHours(0, 0, 0, 0)
    const e = new Date(exam.endDate);   e.setHours(0, 0, 0, 0)
    if (d < s || d > e) {
      return `Date must be within exam period (${minDate} to ${maxDate})`
    }
    return true
  }

  const onSubmit = (data: AddCommonSubjectInput) => {
    mutation.mutate({
      grade:        gradeConfig.grade,
      subjectId:    data.subjectId,
      examDate:     data.examDate,
      startTime:    data.startTime,
      endTime:      data.endTime,
      totalMarks:   Number(data.totalMarks),
      passingMarks: Number(data.passingMarks),
    })
  }

  return (
    <CrudDialog
      trigger={
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="size-4" />
          Add subject
        </Button>
      }
      title={`Add subject — Grade ${gradeConfig.grade}`}
      description={`Exam period: ${minDate} to ${maxDate}`}
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={
        (mutation.error as any)?.response?.data?.message
          ?? 'Failed to add subject'
      }
      submitLabel="Add Subject"
      isDirty={isDirty}
      onSubmit={handleSubmit(onSubmit)}
      onOpenChange={(open) => {
        if (!open) {
          reset({ totalMarks: 100, passingMarks: 35 })
          mutation.reset()
        }
      }}
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
      </div>

      {/* Exam date — constrained to exam period */}
      <div className="flex flex-col gap-1.5">
        <Label>Exam date</Label>
        <Input
          type="date"
          min={minDate}
          max={maxDate}
          {...register('examDate', {
            required: 'Required',
            validate:  validateDate,
          })}
        />
        {errors.examDate && (
          <p className="text-xs text-destructive">{errors.examDate.message}</p>
        )}
      </div>

      {/* Times */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Start time</Label>
          <Input
            type="time"
            {...register('startTime', { required: 'Required' })}
          />
          {errors.startTime && (
            <p className="text-xs text-destructive">{errors.startTime.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>End time</Label>
          <Input
            type="time"
            {...register('endTime', { required: 'Required' })}
          />
          {errors.endTime && (
            <p className="text-xs text-destructive">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      {/* Marks */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Total marks</Label>
          <Input
            type="number"
            min={1}
            {...register('totalMarks', {
              required:      'Required',
              valueAsNumber: true,
              min:           { value: 1, message: 'Min 1' },
            })}
          />
          {errors.totalMarks && (
            <p className="text-xs text-destructive">{errors.totalMarks.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Passing marks</Label>
          <Input
            type="number"
            min={1}
            {...register('passingMarks', {
              required:      'Required',
              valueAsNumber: true,
              min:           { value: 1, message: 'Min 1' },
            })}
          />
          {errors.passingMarks && (
            <p className="text-xs text-destructive">{errors.passingMarks.message}</p>
          )}
        </div>
      </div>
    </CrudDialog>
  )
}