import { useForm }             from 'react-hook-form'
import { Button }              from '@/components/ui/button'
import { Input }               from '@/components/ui/input'
import { Label }               from '@/components/ui/label'
import { Pencil }              from 'lucide-react'
import { CrudDialog }          from '@/components/shared/CrudDialog'
import { UseMutationResult }   from '@tanstack/react-query'
import { DepartmentResponse, UpdateDepartmentInput } from '@/types/department.types'

interface Props {
  department: DepartmentResponse
  mutation:   UseMutationResult<DepartmentResponse, Error, UpdateDepartmentInput>
}

export function EditDepartmentDialog({ department, mutation }: Props) {
  const { register, handleSubmit, reset, formState: { isDirty } } =
    useForm<UpdateDepartmentInput>({
      defaultValues: {
        deptName:    department.deptName,
        description: department.description ?? '',
      },
    })

  const errorMessage = (mutation.error as any)
    ?.response?.data?.message ?? 'Failed to update department'

  return (
    <CrudDialog
      trigger={
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="size-4" />
          Edit
        </Button>
      }
      title="Edit department"
      description={`Update ${department.deptName}.`}
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={errorMessage}
      submitLabel="Save changes"
      isDirty={isDirty}
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      onOpenChange={(open) => {
        if (!open) {
          reset({ deptName: department.deptName, description: department.description ?? '' })
          mutation.reset()
        }
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="edit-dept-name">Department name</Label>
        <Input
          id="edit-dept-name"
          {...register('deptName', { required: true })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="edit-dept-desc">
          Description
          <span className="text-muted-foreground ml-1">(optional)</span>
        </Label>
        <Input
          id="edit-dept-desc"
          {...register('description')}
        />
      </div>
    </CrudDialog>
  )
}