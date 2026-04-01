import { useForm }               from 'react-hook-form'
import { Button }                from '@/components/ui/button'
import { Input }                 from '@/components/ui/input'
import { Label }                 from '@/components/ui/label'
import { Plus }                  from 'lucide-react'
import { CrudDialog }            from '@/components/shared/CrudDialog'
import { useAddSectionLanguage } from '@/hooks/exam/useExams'
import { useSubjects }           from '@/hooks/subject/useSubjects'
import { useClasses }            from '@/hooks/class/useClasses'
import { AddSectionLanguageInput, GradeConfig } from '@/types/exam.types'

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
  examId:      string
  gradeConfig: GradeConfig
}

export const AddSectionLanguageDialog = ({ examId, gradeConfig }: Props) => {
  const { register, handleSubmit, reset, formState: { isDirty, errors } } =
    useForm<FormValues>({
      defaultValues: {
        totalMarks:   100,
        passingMarks: 35,
      },
    })

  const mutation           = useAddSectionLanguage(examId)
  const { data: subjects } = useSubjects({ limit: 100 })
  const { data: classes }  = useClasses()

  // Only sections of this grade
  const gradeSections = (classes?.data ?? []).filter(
    (c) => c.grade === gradeConfig.grade
  )

  // Sections that already have a language assigned
  const assignedClassIds = new Set(
    gradeConfig.sectionLanguages.map((l) => l.classId)
  )

  // Common subject IDs — language must not be one of these
  const commonSubjectIds = new Set(
    gradeConfig.commonSubjects.map((s) => s.subjectId)
  )

  // Only non-common subjects available as language
  const languageSubjects = (subjects?.data ?? []).filter(
    (s) => !commonSubjectIds.has(s.id)
  )

  const onSubmit = (data: FormValues) => {
    const payload: AddSectionLanguageInput = {
      grade:        gradeConfig.grade,
      classId:      data.classId,
      subjectId:    data.subjectId,
      examDate:     data.examDate,
      startTime:    data.startTime,
      endTime:      data.endTime,
      totalMarks:   Number(data.totalMarks),    // ← explicit cast
      passingMarks: Number(data.passingMarks),  // ← explicit cast
    }
    mutation.mutate(payload)
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
      description="Assign one additional language subject to a specific section."
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
        {!gradeSections.length && (
          <p className="text-xs text-muted-foreground">
            No sections found for grade {gradeConfig.grade}.
          </p>
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
          Common subjects are excluded — only additional languages shown.
        </p>
      </div>

      {/* Exam date */}
      <div className="flex flex-col gap-1.5">
        <Label>Exam date</Label>
        <Input
          type="date"
          {...register('examDate', { required: 'Exam date is required' })}
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
              min:           { value: 1, message: 'Must be at least 1' },
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
              min:           { value: 1, message: 'Must be at least 1' },
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