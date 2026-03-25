import { CrudDialog }      from '@/components/shared/CrudDialog'
import { Input }           from '@/components/ui/input'
import { Label }           from '@/components/ui/label'
import { Pencil }          from 'lucide-react'
import { useForm }         from 'react-hook-form'
import { SubjectResponse, UpdateSubjectInput } from '@/types/subject.types'
import { useDepartments } from '@/hooks/department/useDepartments'
import { useUpdateSubject } from '@/hooks/subject/useSubjects'
import { Button } from '@/components/ui/button'


export const EditSubjectDialog = ({ subject }: { subject: SubjectResponse }) => {
  const { data: depts }  = useDepartments()
  const updateMutation   = useUpdateSubject(subject.id)
  const { register, handleSubmit, reset, formState: { isDirty } } =
    useForm<UpdateSubjectInput>({
      defaultValues: { subjectName: subject.subjectName, deptId: subject.deptId },
    })

  return (
    <CrudDialog
      trigger={<Button variant="outline" size="sm" className="gap-1.5"><Pencil className="size-3.5" />Edit</Button>}
      title="Edit subject"
      description={`Update ${subject.subjectName}.`}
      isPending={updateMutation.isPending}
      isSuccess={updateMutation.isSuccess}
      isError={updateMutation.isError}
      errorMessage={(updateMutation.error as any)?.response?.data?.message ?? 'Failed'}
      submitLabel="Save changes"
      isDirty={isDirty}
      onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
      onOpenChange={(open) => {
        if (!open) {
          reset({ subjectName: subject.subjectName, deptId: subject.deptId })
          updateMutation.reset()
        }
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label>Subject name</Label>
        <Input {...register('subjectName', { required: true })} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Department</Label>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register('deptId', { required: true })}
        >
          {depts?.data.map((d) => (
            <option key={d.id} value={d.id}>{d.deptName}</option>
          ))}
        </select>
      </div>
    </CrudDialog>
  )
}
