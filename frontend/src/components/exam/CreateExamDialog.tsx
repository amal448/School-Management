import { useState }          from 'react'
import { useForm }           from 'react-hook-form'
import { Button }            from '@/components/ui/button'
import { Input }             from '@/components/ui/input'
import { Label }             from '@/components/ui/label'
import { Badge }             from '@/components/ui/badge'
import { Plus, X, Check }   from 'lucide-react'
import { CrudDialog }        from '@/components/shared/CrudDialog'
import { useCreateExam }     from '@/hooks/exam/useExams'
import { useClasses }        from '@/hooks/class/useClasses'
import { CreateExamInput }   from '@/types/exam.types'
import { ExamType }          from '@/types/enums'
import {
  EXAM_TYPE_LABELS,
  ACADEMIC_YEAR_OPTIONS,
  CURRENT_ACADEMIC_YEAR,
} from '@/constants/exam.constants'
import { getGroupLabel }     from '@/constants/class.constants'

interface CreateExamForm {
  examName:     string
  examType:     ExamType
  academicYear: string
  startDate:    string
  endDate:      string
}

export const CreateExamDialog = () => {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [classError,      setClassError]      = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isDirty } } =
    useForm<CreateExamForm>({
      defaultValues: { academicYear: CURRENT_ACADEMIC_YEAR },
    })

  const mutation         = useCreateExam(() => {
    reset()
    setSelectedClasses([])
  })
  const { data: classes } = useClasses()

  const toggleClass = (classId: string) => {
    setSelectedClasses((prev) => {
      const next = prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
      if (next.length > 0) setClassError(false)
      return next
    })
  }

  const onSubmit = (data: CreateExamForm) => {
    if (selectedClasses.length === 0) { setClassError(true); return }
    mutation.mutate({
      ...data,
      applicableClasses: selectedClasses,
    })
  }

  // Group classes by level for display
  const groupedClasses = ['Primary', 'Middle', 'Secondary'].map((label) => ({
    label,
    classes: (classes?.data ?? []).filter(
      (c) => getGroupLabel(c.grade) === label
    ),
  })).filter((g) => g.classes.length > 0)

  return (
    <CrudDialog
      trigger={
        <Button className="gap-2">
          <Plus className="size-4" />
          Create Exam
        </Button>
      }
      title="Create exam"
      description="Declare a new exam event for selected classes."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={
        (mutation.error as any)?.response?.data?.message
          ?? 'Failed to create exam'
      }
      submitLabel="Create Exam"
      isDirty={isDirty || selectedClasses.length > 0}
      onSubmit={handleSubmit(onSubmit)}
      onOpenChange={(open) => {
        if (!open) {
          reset()
          setSelectedClasses([])
          setClassError(false)
          mutation.reset()
        }
      }}
    >
      {/* Exam name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ex-name">Exam name</Label>
        <Input
          id="ex-name"
          placeholder="e.g. Mid Term 2026"
          {...register('examName', { required: 'Required' })}
        />
        {errors.examName && (
          <p className="text-xs text-destructive">{errors.examName.message}</p>
        )}
      </div>

      {/* Exam type + Academic year */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ex-type">Exam type</Label>
          <select
            id="ex-type"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('examType', { required: true })}
          >
            {Object.entries(EXAM_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ex-year">Academic year</Label>
          <select
            id="ex-year"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('academicYear', { required: true })}
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
          <Label htmlFor="ex-start">Start date</Label>
          <Input
            id="ex-start"
            type="date"
            {...register('startDate', { required: 'Required' })}
          />
          {errors.startDate && (
            <p className="text-xs text-destructive">{errors.startDate.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ex-end">End date</Label>
          <Input
            id="ex-end"
            type="date"
            {...register('endDate', { required: 'Required' })}
          />
          {errors.endDate && (
            <p className="text-xs text-destructive">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Applicable classes */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label className={classError ? 'text-destructive' : ''}>
            Applicable classes
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (required)
            </span>
          </Label>
          {selectedClasses.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedClasses.length} selected
            </Badge>
          )}
        </div>

        <div className={`
          border rounded-lg overflow-hidden
          ${classError ? 'border-destructive' : 'border-border'}
        `}>
          {!classes?.data.length ? (
            <p className="p-3 text-center text-sm text-muted-foreground">
              No classes found.
            </p>
          ) : (
            <div className="divide-y divide-border max-h-48 overflow-y-auto">
              {groupedClasses.map(({ label, classes: groupClasses }) => (
                <div key={label}>
                  <div className="px-3 py-1.5 bg-muted/50">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {label}
                    </p>
                  </div>
                  <div className="grid grid-cols-2">
                    {groupClasses.map((cls) => {
                      const isSelected = selectedClasses.includes(cls.id)
                      return (
                        <button
                          key={cls.id}
                          type="button"
                          onClick={() => toggleClass(cls.id)}
                          className={`
                            flex items-center justify-between
                            px-3 py-2 text-sm text-left transition-colors
                            border-b border-r border-border
                            ${isSelected
                              ? 'bg-primary/5 text-primary'
                              : 'hover:bg-muted/60'
                            }
                          `}
                        >
                          <span>Class {cls.grade}-{cls.section}</span>
                          {isSelected && (
                            <Check className="size-3.5 shrink-0 text-primary" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {classError && (
          <p className="text-xs text-destructive">
            Select at least one class
          </p>
        )}

        {selectedClasses.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedClasses.map((id) => {
              const cls = classes?.data.find((c) => c.id === id)
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md"
                >
                  {cls ? `${cls.grade}-${cls.section}` : id}
                  <button
                    type="button"
                    onClick={() => toggleClass(id)}
                    className="hover:text-destructive ml-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )
            })}
          </div>
        )}
      </div>
    </CrudDialog>
  )
}