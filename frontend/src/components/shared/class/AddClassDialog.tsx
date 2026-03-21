import { useForm }        from 'react-hook-form'
import { Button }         from '@/components/ui/button'
import { Input }          from '@/components/ui/input'
import { Label }          from '@/components/ui/label'
import { Plus }           from 'lucide-react'
import { CrudDialog }     from '@/components/shared/CrudDialog'
import { useCreateClass } from '@/hooks/class/useClasses'
import { CreateClassInput } from '@/types/class.types'

export function AddClassDialog() {
  const { register, handleSubmit, reset, formState: { isDirty } } =
    useForm<CreateClassInput>()

  const mutation = useCreateClass(() => reset())

  const errorMessage = (mutation.error as any)
    ?.response?.data?.message ?? 'Failed to create class'

  return (
    <CrudDialog
      trigger={
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Class
        </Button>
      }
      title="Add class"
      description="Create a new class section for the academic year."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={errorMessage}
      submitLabel="Create Class"
      isDirty={isDirty}
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      onOpenChange={(open) => { if (!open) { reset(); mutation.reset() } }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cls-name">Class name</Label>
          <Input
            id="cls-name"
            placeholder="e.g. 10, 11"
            {...register('className', { required: true })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cls-section">Section</Label>
          <Input
            id="cls-section"
            placeholder="e.g. A, B"
            {...register('section', { required: true })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cls-year">Academic year</Label>
        <Input
          id="cls-year"
          placeholder="e.g. 2026"
          {...register('academicYear', { required: true })}
        />
      </div>
    </CrudDialog>
  )
}