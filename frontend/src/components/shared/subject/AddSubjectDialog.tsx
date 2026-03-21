import { useForm }          from 'react-hook-form'
import { Button }           from '@/components/ui/button'
import { Input }            from '@/components/ui/input'
import { Label }            from '@/components/ui/label'
import { Plus }             from 'lucide-react'
import { CrudDialog }       from '@/components/shared/CrudDialog'
import { useCreateSubject } from '@/hooks/subject/useSubjects'
import { useDepartments }   from '@/hooks/department/useDepartments'
import { CreateSubjectInput } from '@/types/subject.types'

export function AddSubjectDialog() {
  const { register, handleSubmit, reset, formState: { isDirty } } =
    useForm<CreateSubjectInput>()

  const mutation    = useCreateSubject(() => reset())
  const { data: depts } = useDepartments()

  const errorMessage = (mutation.error as any)
    ?.response?.data?.message ?? 'Failed to create subject'

  return (
    <CrudDialog
      trigger={
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Subject
        </Button>
      }
      title="Add subject"
      description="Create a new subject and assign it to a department."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={errorMessage}
      submitLabel="Create Subject"
      isDirty={isDirty}
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      onOpenChange={(open) => { if (!open) { reset(); mutation.reset() } }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subj-name">Subject name</Label>
        <Input
          id="subj-name"
          placeholder="e.g. Mathematics, English"
          {...register('subjectName', { required: true })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subj-dept">Department</Label>
        <select
          id="subj-dept"
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register('deptId', { required: true })}
        >
          <option value="">Select department</option>
          {depts?.data.map((d) => (
            <option key={d.id} value={d.id}>{d.deptName}</option>
          ))}
        </select>
      </div>
    </CrudDialog>
  )
}