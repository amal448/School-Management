import { useState }        from 'react'
import { useForm }         from 'react-hook-form'
import { Button }          from '@/components/ui/button'
import { Input }           from '@/components/ui/input'
import { Label }           from '@/components/ui/label'
import { Badge }           from '@/components/ui/badge'
import { Plus, X, Check } from 'lucide-react'
import { CrudDialog }      from '@/components/shared/CrudDialog'
import { useCreateExam }   from '@/hooks/exam/useExams'
import { useClasses }      from '@/hooks/class/useClasses'
import { CreateExamInput } from '@/types/exam.types'
import { ExamType }        from '@/types/enums'
import {
  EXAM_TYPE_LABELS,
  ACADEMIC_YEAR_OPTIONS,
  CURRENT_ACADEMIC_YEAR,
} from '@/constants/exam.constants'

interface FormValues {
  examName:     string
  examType:     ExamType
  academicYear: string
  startDate:    string
  endDate:      string
}

export const CreateExamDialog = () => {
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [gradeError,     setGradeError]     = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isDirty } } =
    useForm<FormValues>({
      defaultValues: {
        examType:     ExamType.MIDTERM,
        academicYear: CURRENT_ACADEMIC_YEAR,
      },
    })

  const mutation         = useCreateExam(() => {
    reset()
    setSelectedGrades([])
    setGradeError(false)
  })
  const { data: classes } = useClasses()

  // Get unique grades from existing classes
  const availableGrades = [
    ...new Set((classes?.data ?? []).map((c) => c.grade))
  ].sort((a, b) => Number(a) - Number(b))

  const toggleGrade = (grade: string) => {
    setSelectedGrades((prev) => {
      const next = prev.includes(grade)
        ? prev.filter((g) => g !== grade)
        : [...prev, grade]
      if (next.length > 0) setGradeError(false)
      return next
    })
  }

  const onSubmit = (data: FormValues) => {
    if (!selectedGrades.length) { setGradeError(true); return }
    mutation.mutate({ ...data, grades: selectedGrades })
  }

  return (
    <CrudDialog
      trigger={
        <Button className="gap-2">
          <Plus className="size-4" />
          Create Exam
        </Button>
      }
      title="Create exam"
      description="Declare a new exam for selected grades."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={
        (mutation.error as any)?.response?.data?.message
          ?? 'Failed to create exam'
      }
      submitLabel="Create Exam"
      isDirty={isDirty || selectedGrades.length > 0}
      onSubmit={handleSubmit(onSubmit)}
      onOpenChange={(open) => {
        if (!open) {
          reset()
          setSelectedGrades([])
          setGradeError(false)
          mutation.reset()
        }
      }}
    >
      {/* Exam name */}
      <div className="flex flex-col gap-1.5">
        <Label>Exam name</Label>
        <Input
          placeholder="e.g. Mid Term 2026"
          {...register('examName', { required: 'Required' })}
        />
        {errors.examName && (
          <p className="text-xs text-destructive">{errors.examName.message}</p>
        )}
      </div>

      {/* Type + Year */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Exam type</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('examType')}
          >
            {Object.entries(EXAM_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Academic year</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('academicYear')}
          >
            {ACADEMIC_YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date range */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Start date</Label>
          <Input
            type="date"
            {...register('startDate', { required: 'Required' })}
          />
          {errors.startDate && (
            <p className="text-xs text-destructive">{errors.startDate.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>End date</Label>
          <Input
            type="date"
            {...register('endDate', { required: 'Required' })}
          />
          {errors.endDate && (
            <p className="text-xs text-destructive">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Grade selection */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label className={gradeError ? 'text-destructive' : ''}>
            Applicable grades
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (required)
            </span>
          </Label>
          {selectedGrades.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedGrades.length} selected
            </Badge>
          )}
        </div>

        {!availableGrades.length ? (
          <p className="text-xs text-muted-foreground p-3 border rounded-lg text-center">
            No grades found. Create classes first.
          </p>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {availableGrades.map((grade) => {
              const isSelected = selectedGrades.includes(grade)
              return (
                <button
                  key={grade}
                  type="button"
                  onClick={() => toggleGrade(grade)}
                  className={`
                    w-12 h-12 rounded-lg text-sm font-medium border transition-all
                    ${isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:border-primary/50 hover:bg-muted'
                    }
                  `}
                >
                  {grade}
                </button>
              )
            })}
          </div>
        )}

        {gradeError && (
          <p className="text-xs text-destructive">
            Select at least one grade
          </p>
        )}

        {selectedGrades.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {selectedGrades.sort((a, b) => Number(a) - Number(b)).map((g) => (
              <span
                key={g}
                className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md"
              >
                Grade {g}
                <button type="button" onClick={() => toggleGrade(g)}>
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </CrudDialog>
  )
}