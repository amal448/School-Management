import { useForm }               from 'react-hook-form'
import { Button }                from '@/components/ui/button'
import { Input }                 from '@/components/ui/input'
import { Label }                 from '@/components/ui/label'
import { Plus }                  from 'lucide-react'
import { CrudDialog }            from '@/components/shared/CrudDialog'
import { useAddSectionLanguage } from '@/hooks/exam/useExams'
import { useSubjects }           from '@/hooks/subject/useSubjects'
import { useClasses }            from '@/hooks/class/useClasses'
import { AddSectionLanguageInput, ExamResponse, GradeConfig } from '@/types/exam.types'

interface FormValues {
  classId:      string
  subjectId:    string
  examDate:     string
  startTime:    string
  endTime:      string
  totalMarks:   number
  passingMarks: number
}
interface Props {
  exam:        ExamResponse   // ← was just examId + gradeConfig
  gradeConfig: GradeConfig
}

export const AddSectionLanguageDialog = ({ exam, gradeConfig }: Props) => {
  const { register, handleSubmit, reset, formState: { isDirty, errors } } =
    useForm<FormValues>({
      defaultValues: { totalMarks: 100, passingMarks: 35 },
    })

  const mutation           = useAddSectionLanguage(exam.id)
  const { data: subjects } = useSubjects({ limit: 100 })
  const { data: classes }  = useClasses({ grade: gradeConfig.grade, limit: 100 })

  const gradeSections    = classes?.data ?? []
  
  const assignedClassIds = new Set(
    gradeConfig.sectionLanguages.map((l) => l.classId)
  )
  const commonSubjectIds = new Set(
    gradeConfig.commonSubjects.map((s) => s.subjectId)
  )

  const gradeSubjectIds = new Set<string>()
  gradeSections.forEach(cls => {
    cls.subjectAllocations.forEach(a => gradeSubjectIds.add(a.subjectId))
  })

  const languageSubjects = (subjects?.data ?? []).filter(
    (s) => gradeSubjectIds.has(s.id) && !commonSubjectIds.has(s.id)
  )

  // Date bounds
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

  const onSubmit = (data: FormValues) => {
    mutation.mutate({
      grade:        gradeConfig.grade,
      classId:      data.classId,
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
          Add language
        </Button>
      }
      title={`Add section language — Grade ${gradeConfig.grade}`}
      description={`Exam period: ${minDate} to ${maxDate}`}
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={
        (mutation.error as any)?.response?.data?.message
          ?? 'Failed to add language'
      }
      submitLabel="Add Language"
      isDirty={isDirty}
      onSubmit={handleSubmit(onSubmit)}
      onOpenChange={(open) => {
        if (!open) {
          reset({ totalMarks: 100, passingMarks: 35 })
          mutation.reset()
        }
      }}
    >
      {/* Section */}
      <div className="flex flex-col gap-1.5">
        <Label>Section</Label>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          {...register('classId', { required: 'Required' })}
        >
          <option value="">Select section</option>
          {gradeSections.map((c) => (
            <option
              key={c.id}
              value={c.id}
              disabled={assignedClassIds.has(c.id)}
            >
              Grade {c.grade}-{c.section}
              {assignedClassIds.has(c.id) ? ' — language assigned' : ''}
            </option>
          ))}
        </select>
        {errors.classId && (
          <p className="text-xs text-destructive">{errors.classId.message}</p>
        )}
      </div>

      {/* Language subject */}
      <div className="flex flex-col gap-1.5">
        <Label>Language subject</Label>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          {...register('subjectId', { required: 'Required' })}
        >
          <option value="">Select language</option>
          {languageSubjects.map((s) => (
            <option key={s.id} value={s.id}>{s.subjectName}</option>
          ))}
        </select>
        {errors.subjectId && (
          <p className="text-xs text-destructive">{errors.subjectId.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Common subjects excluded — only additional languages shown.
        </p>
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
            min={1}
            {...register('totalMarks', {
              required:      'Required',
              valueAsNumber: true,
              min:           { value: 1, message: 'Min 1' },
            })}
          />
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
        </div>
      </div>
    </CrudDialog>
  )
}