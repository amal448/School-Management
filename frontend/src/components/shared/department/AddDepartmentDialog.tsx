import { useForm }           from 'react-hook-form'
import { Button }            from '@/components/ui/button'
import { Input }             from '@/components/ui/input'
import { Label }             from '@/components/ui/label'
import { Plus }              from 'lucide-react'
import { CrudDialog }        from '@/components/shared/CrudDialog'
import { useCreateDepartment } from '@/hooks/department/useDepartments'
import { CreateDepartmentInput } from '@/types/department.types'

export function AddDepartmentDialog() {
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<CreateDepartmentInput>()

  const mutation = useCreateDepartment(() => reset())

  const errorMessage = (mutation.error as any)
    ?.response?.data?.message ?? 'Failed to create department'

  return (
    <CrudDialog
      trigger={
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Department
        </Button>
      }
      title="Add department"
      description="Create a new department for the school."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={errorMessage}
      submitLabel="Create Department"
      isDirty={isDirty}
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      onOpenChange={(open) => { if (!open) { reset(); mutation.reset() } }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dept-name">Department name</Label>
        <Input
          id="dept-name"
          placeholder="e.g. Science, Mathematics"
          {...register('deptName', { required: true })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dept-desc">
          Description
          <span className="text-muted-foreground ml-1">(optional)</span>
        </Label>
        <Input
          id="dept-desc"
          placeholder="Brief description"
          {...register('description')}
        />
      </div>
    </CrudDialog>
  )
}