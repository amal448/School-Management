import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { CrudDialog } from '@/components/shared/CrudDialog'
import { ClassSectionPicker } from '@/components/shared/class/ClassSectionPicker'
import { SubjectPicker } from '@/components/shared/class/SubjectPicker'
import { useUpdateClass } from '@/hooks/class/useClasses'
import { useSubjects } from '@/hooks/subject/useSubjects'
import { ClassResponse, UpdateClassInput } from '@/types/class.types'
import { DialogTrigger } from '@/components/ui/dialog'

export const EditClassDialog = ({ cls }: { cls: ClassResponse }) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    cls.subjectAllocations.map((a) => a.subjectId)
  )

  const mutation = useUpdateClass(cls.id)
  const { data: subjects } = useSubjects({ limit: 100 })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateClassInput>({
    defaultValues: { className: cls.className, section: cls.section },
  })

  const selectedClass = watch('className')
  const selectedSection = watch('section')

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const onSubmit = (data: UpdateClassInput) => {
    mutation.mutate({
      className: data.className,
      section: data.section,
      subjectAllocations: selectedSubjects.map((subjectId) => ({
        subjectId,
        teacherId: cls.subjectAllocations.find(
          (a) => a.subjectId === subjectId
        )?.teacherId,
      })),
    } as any)
  }

  return (
    <CrudDialog
      trigger={
        <Button variant="outline" className="gap-2">
          <Pencil className="size-3.5" />
          Edit
        </Button>
      }
      title="Edit class"
      description={`Update Class ${cls.className}-${cls.section}.`}
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={(mutation.error as any)?.response?.data?.message ?? 'Failed to update'}
      submitLabel="Save changes"
      isDirty={true}
      onSubmit={handleSubmit(onSubmit)}
      onOpenChange={(open) => {
        if (!open) {
          reset({ className: cls.className, section: cls.section })
          setSelectedSubjects(cls.subjectAllocations.map((a) => a.subjectId))
          mutation.reset()
        }
      }}
    >
      <input type="hidden" {...register('className', { required: true })} />
      <input type="hidden" {...register('section', { required: true })} />

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
        showTeacherHint={true}
        allocations={cls.subjectAllocations}
      />
    </CrudDialog>
  )
}