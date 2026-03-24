import { useState }           from 'react'
import { useForm }            from 'react-hook-form'
import { Button }             from '@/components/ui/button'
import { Plus }               from 'lucide-react'
import { CrudDialog }         from '@/components/shared/CrudDialog'
import { ClassSectionPicker } from '@/components/shared/class/ClassSectionPicker'
import { SubjectPicker }      from '@/components/shared/class/SubjectPicker'
import { useCreateClass }     from '@/hooks/class/useClasses'
import { useSubjects }        from '@/hooks/subject/useSubjects'

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

  const mutation           = useCreateClass(() => {
    reset()
    setSelectedSubjects([])
    setSubjectError(false)
  })

  const { data: subjects } = useSubjects({ limit: 100 })

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) => {
      const next = prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
      if (next.length > 0) setSubjectError(false)
      return next
    })
  }

  const onSubmit = (data: AddClassForm) => {
    if (selectedSubjects.length === 0) { setSubjectError(true); return }
    mutation.mutate({
      className: data.className,
      section:   data.section,
      subjectAllocations: selectedSubjects.map((subjectId) => ({ subjectId })),
    } as any)
  }

  return (
    <CrudDialog
      trigger={<Button className="gap-2"><Plus className="size-4" />Add Class</Button>}
      title="Add class"
      description="Create a new class and assign subjects."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={(mutation.error as any)?.response?.data?.message ?? 'Failed to create class'}
      submitLabel="Create Class"
      isDirty={true}
      onSubmit={handleSubmit(onSubmit)}
      onOpenChange={(open) => {
        if (!open) {
          reset()
          setSelectedSubjects([])
          setSubjectError(false)
          mutation.reset()
        }
      }}
    >
      {/* Hidden inputs for react-hook-form */}
      <input type="hidden" {...register('className', { required: true })} />
      <input type="hidden" {...register('section',   { required: true })} />

      <ClassSectionPicker
        selectedClass={selectedClass}
        selectedSection={selectedSection}
        onClassChange={(cls) => setValue('className', cls, { shouldDirty: true })}
        onSectionChange={(sec) => setValue('section', sec, { shouldDirty: true })}
        classError={!!errors.className}
        sectionError={!!errors.section}
      />

      <SubjectPicker
        subjects={subjects?.data ?? []}
        selectedIds={selectedSubjects}
        onToggle={toggleSubject}
        error={subjectError}
      />
    </CrudDialog>
  )
}