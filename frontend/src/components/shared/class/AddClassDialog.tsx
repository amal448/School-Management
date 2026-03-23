import { useState }       from 'react'
import { useForm }        from 'react-hook-form'
import { Button }         from '@/components/ui/button'
import { Badge }          from '@/components/ui/badge'
import { Label }          from '@/components/ui/label'
import { Plus, X, Check } from 'lucide-react'
import { CrudDialog }     from '@/components/shared/CrudDialog'
import { useCreateClass } from '@/hooks/class/useClasses'
import { useSubjects }    from '@/hooks/subject/useSubjects'
import {
  CLASS_GROUPS,
  SECTIONS,
  getGroupLabel,
} from '@/constants/class.constants'

interface AddClassForm {
  className: string
  section:   string
}

export function AddClassDialog() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [subjectError,     setSubjectError]     = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddClassForm>({
    defaultValues: { className: '', section: '' },
  })

  const selectedClass   = watch('className')
  const selectedSection = watch('section')

  const mutation = useCreateClass(() => {
    reset()
    setSelectedSubjects([])
    setSubjectError(false)
  })

  const { data: subjects } = useSubjects({ limit: 100 })

  const errorMessage = (mutation.error as any)
    ?.response?.data?.message ?? 'Failed to create class'

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) => {
      const next = prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
      if (next.length > 0) setSubjectError(false)
      return next
    })
  }

  const onSubmit = (data: AddClassForm) => {
    if (selectedSubjects.length === 0) {
      setSubjectError(true)
      return
    }
    mutation.mutate({
      className: data.className,
      section:   data.section,
      subjectAllocations: selectedSubjects.map((subjectId) => ({
        subjectId,
       
      })),
    } as any)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
      setSelectedSubjects([])
      setSubjectError(false)
      mutation.reset()
    }
  }

  return (
    <CrudDialog
      trigger={
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Class
        </Button>
      }
      title="Add class"
      description="Create a new class and assign subjects."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={errorMessage}
      submitLabel="Create Class"
      isDirty={true}
      onSubmit={handleSubmit(onSubmit)}
      onOpenChange={handleOpenChange}
    >

      {/* ── Class number ──────────────────────────── */}
      <div className="flex flex-col gap-2">
        <Label>
          Class
          {selectedClass && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {getGroupLabel(selectedClass)} school
            </span>
          )}
        </Label>

        <div className="flex flex-col gap-3">
          {CLASS_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-xs text-muted-foreground mb-1.5">
                {group.label}
              </p>
              <div className="flex gap-2 flex-wrap">
                {group.classes.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setValue('className', cls, { shouldDirty: true })}
                    className={`
                      w-10 h-10 rounded-lg text-sm font-medium border transition-all
                      ${selectedClass === cls
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:border-primary/50 hover:bg-muted'
                      }
                    `}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <input type="hidden" {...register('className', { required: true })} />
        {errors.className && (
          <p className="text-xs text-destructive">Please select a class</p>
        )}
      </div>

      {/* ── Section ──────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <Label>Section</Label>
        <div className="flex gap-2 flex-wrap">
          {SECTIONS.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setValue('section', sec, { shouldDirty: true })}
              className={`
                w-10 h-10 rounded-lg text-sm font-medium border transition-all
                ${selectedSection === sec
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary/50 hover:bg-muted'
                }
              `}
            >
              {sec}
            </button>
          ))}
        </div>
        <input type="hidden" {...register('section', { required: true })} />
        {errors.section && (
          <p className="text-xs text-destructive">Please select a section</p>
        )}
      </div>

      {/* ── Subjects (mandatory) ──────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className={subjectError ? 'text-destructive' : ''}>
            Subjects
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (at least one required)
            </span>
          </Label>
          {selectedSubjects.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedSubjects.length} selected
            </Badge>
          )}
        </div>

        <div className={`
          border rounded-lg max-h-44 overflow-y-auto
          ${subjectError ? 'border-destructive' : 'border-border'}
        `}>
          {!subjects?.data.length ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No subjects found. Add subjects first.
            </div>
          ) : (
            subjects.data.map((subject) => {
              const isSelected = selectedSubjects.includes(subject.id)
              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => toggleSubject(subject.id)}
                  className={`
                    w-full flex items-center justify-between
                    px-3 py-2.5 text-sm text-left transition-colors
                    border-b last:border-b-0 border-border
                    ${isSelected
                      ? 'bg-primary/5 text-primary'
                      : 'hover:bg-muted/60 text-foreground'
                    }
                  `}
                >
                  <span>{subject.subjectName}</span>
                  {isSelected && (
                    <Check className="size-3.5 shrink-0 text-primary" />
                  )}
                </button>
              )
            })
          )}
        </div>

        {subjectError && (
          <p className="text-xs text-destructive">
            Please select at least one subject
          </p>
        )}

        {selectedSubjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedSubjects.map((id) => {
              const subject = subjects?.data.find((s) => s.id === id)
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium"
                >
                  {subject?.subjectName}
                  <button
                    type="button"
                    onClick={() => toggleSubject(id)}
                    className="hover:text-destructive transition-colors ml-0.5"
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